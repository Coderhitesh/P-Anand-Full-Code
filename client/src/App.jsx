import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import About from './Components/About/About';
import Shop from './Components/Shop/Shop';
import Contact from './Components/Contact/Contact';
import Cart from './Components/Cart/Cart';
import Wishlist from './Components/Wishlist/Wishlist';
import StudyMaterial from './Components/StudyMaterial/StudyMaterial';
import CourseDetail from './Pages/CourseDetail/CourseDetail';
import BundlePage from './Pages/BundlePage/BundlePage';
import BundleDetail from './Pages/BundleDetail/BundleDetail';
import BookPage from './Pages/BookPage/BookPage';
import BookDetail from './Pages/BookDetail/BookDetail';
import BookBundlePage from './Pages/BookBundlePage/BookBundlePage';
import BookBundleDetail from './Pages/BookBundleDetail/BookBundleDetail';
import Login from './Components/Auth/Login';
import ForgetPassword from './Components/Auth/ForgetPassword';
import Signin from './Components/Auth/Signin';
import BookCart from './Pages/BookCart/BookCart';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import OrderSuccess from './Components/Cart/OrderSuccess';
import PageNotFound from './Pages/Error/PageNotFound';
import UserProfile from './Pages/UserProfile/UserProfile';
import Privacy from './Pages/PrivacyPolicy/Privacy';
import Term from './Pages/PrivacyPolicy/Term';
import Refund from './Pages/PrivacyPolicy/Refund';

const SESSION_KEY = 'user_session';
const SESSION_EXPIRATION_KEY = 'user_session_expiration';

function App() {
  const [sessionId, setSessionId] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setIsloading] = useState(false)

  // Generate session ID and store it with expiration
  const generateSessionId = () => {
    try {
      const session = uuidv4();
      const expiration = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
      sessionStorage.setItem(SESSION_KEY, session);
      sessionStorage.setItem(SESSION_EXPIRATION_KEY, expiration.toString());
      setSessionId(session);
      console.log('Session created:', session);
    } catch (error) {
      console.error('Failed to create session', error);
    }
  };

  // Check if session is valid or expired
  const initializeSession = () => {
    const storedSession = sessionStorage.getItem(SESSION_KEY);
    const storedExpiration = sessionStorage.getItem(SESSION_EXPIRATION_KEY);

    if (!storedSession || !storedExpiration || new Date().getTime() > Number(storedExpiration)) {
      // No valid session found or session expired
      generateSessionId();
    } else {
      // Valid session found
      setSessionId(storedSession);
    }
  };

  useEffect(() => {
    initializeSession(); // Initialize session on component mount
  }, []);

  const handleAddToCart = async (product) => {
    try {
      console.log(product)

      // Retrieve session from session storage or generate a new one if not found
      let session = sessionStorage.getItem(SESSION_KEY);
      if (!session) {
        session = generateSessionId(); // Ensure session ID is set after generation
        sessionStorage.setItem(SESSION_KEY, session); // Store the generated session
      }

      // Determine the product image, safely checking for various image types
      const productImage = product?.bookImage?.url || product?.bundleImage?.url || product?.courseImage?.url || null;

      // Extract bundleBookIds if available
      const bundleBookIds = product?.bundleBookId?.map(item => item.id) || product?.bundleCourseId?.map(item => item.id) || [];

      // Find the price of the selected course mode
      const selectedCourseMode = product?.courseMode?.find(item => item.modeId === product.selectedMode?.id) || product?.bundleMode?.find(item => item.modeId === product.selectedMode?.id) || null;
      const productPrice = product?.bookPrice || product?.bundlePrice || selectedCourseMode?.coursePrice || 0;
      
      const productType = product?.bundleName && product?.bundleCourseId
        ? 'Course-Bundle'
        : product?.bundleName && !product?.bundleCourseId
          ? 'Book-Bundle'
          : product?.courseName
            ? 'Course'
            : product?.bookName
              ? 'Book'
              : null;

      // Construct the data object to be sent in the request
      const addProductToCartData = {
        productName: product?.bookName || product?.bundleName || product?.courseName,
        productPrice,
        productCategory: product?.bookCategory || product?.categoryId || product?.courseCategory,
        productSubCategory: product?.SubCategory || product?.courseSubCategory || null,
        productHsnCode: product?.BookHSNCode || 0,
        productImage,
        productType,
        productId: product?._id,
        productLearningMode: product?.bookPdf ? 'Pdf' : product.bundleMode ? 'mode-selected' : 'Delivery',
        quantity: 1,
        selectedMode: product?.selectedMode || null,
        bundleBookId: bundleBookIds.length > 0 ? bundleBookIds : null,
        totalPrice: productPrice,
        discount: product?.bookDiscountPresent || product?.bundleDiscountPercent || selectedCourseMode?.courseDiscountPercent || 0,
        userLoginWhenAdd: false,
        ...(!isLogin ? { sessionId: session } : { addedBy: "I am Login" }), // Add sessionId if not logged in
        currency: 'INR',
        tax: 0,
      };

      // Set loading state to true while making the request
      setIsloading(true);

      // Make the API call to add the product to the cart
      const res = await axios.post('http://localhost:9000/api/v1/add-to-cart', addProductToCartData);

      // Handle successful addition
      toast.success(res.data.message || 'Product added to cart successfully');
      console.log(res.data);
    } catch (error) {
      // Handle errors during the API call
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred while adding the product to the cart');
    } finally {
      // Reset the loading state after the request is complete
      setIsloading(false);
    }
  };


  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/forget-password" element={<ForgetPassword />} />
          <Route path="/sign-up" element={<Signin />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/book-cart" element={<BookCart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/Bundle" element={<BundlePage />} />
          <Route path="/Book" element={<BookPage />} />
          <Route path="/Book-detail/:id" element={<BookDetail loadingFromCart={loading} handleAddToCart={handleAddToCart} />} />
          <Route path='/course-detail/:id' element={<CourseDetail loadingFromCart={loading} handleAddToCart={handleAddToCart} />} />
          <Route path='/bundle-detail/:id' element={<BundleDetail loadingFromCart={loading} handleAddToCart={handleAddToCart} />} />
          <Route path='/category/:id' element={<StudyMaterial />} />
          <Route path='/book-bundle' element={<BookBundlePage />} />
          <Route path='/Order-Confirmed' element={<OrderSuccess />} />
          <Route path='/Profile' element={<UserProfile />} />
          <Route path='/*' element={<PageNotFound />} />
          <Route path='/book-bundle-detail/:id' element={<BookBundleDetail loadingFromCart={loading} handleAddToCart={handleAddToCart} />} />

          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/term" element={<Term />} />
          <Route path="/refund" element={<Refund />} />
        </Routes>
        <Footer />
        {/* <ToastCon??tainer /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
