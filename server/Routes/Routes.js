const express = require('express')
const upload = require("../middlewares/Multer")
const { register, login, logout, passwordChangeRequest, verifyOtpAndChangePassword, resendOtp, addDeliveryDetails, userDetails, GetDeliveryAddressOfUser, updateDeliveryAddress, getAllUsers } = require('../Controllers/Usercontroller')
const { protect } = require('../middlewares/Protect')
const { createBundle, getAllBundles, deleteSingleBundle, updateBundle, getSingleBundle } = require('../Controllers/Bundle.Controller')
const { createCategory, getAllCategory, singleCategory, deleteCategory, updateCategory } = require('../Controllers/Category.Controller')
const { createBanner, getAllBanner, deletebanner, updateBanner } = require('../Controllers/Banner.controller')
const { createCourse, getAllCourse, getSingleCourse, deleteCourse, updateCourse, updateCourseFeature, getCoursesByCategory } = require('../Controllers/Course.controller')
const { createTag, getAllTag, getSingleTag, updateTag, deleteTag } = require('../Controllers/Tag.Controller')
const { createTeacher, getAllTeacher, getSingleTeacher, deleteTeacher, updateTeacher } = require('../Controllers/Teacher.controller')
const { createTeacherRating, getAllTeacherRating, singleTeacherRating, updateTeacherRating, deleteTeacherRating } = require('../Controllers/TeacherRating.controller')
const { createCourseRating, getAllCourseRating, singleCourseRating, updateCourseRating, deleteCourseRating } = require('../Controllers/CourseRating.controller')
const { createHomeBanner, getAllHomeBanner, deleteHomeBanner } = require('../Controllers/HomeBanner.Controller')
const { createCourseTitle, getAllCourseTitle, deleteCourseTitle, updateCourseTitle, getSingleCourseTitle } = require('../Controllers/CourseTitle.controller')
const { createBook, getAllBook, getSingleBook, deleteBook, updateBook, updateBookFeature, getBookByCategory } = require('../Controllers/BookController')
const { createBookCategory, getAllBookCategory, singleBookCategory, deleteBookCategory, updateBookCategory } = require('../Controllers/BookCategory.controller')
const { createBookTag, getAllBookTags, getSingleBookTag, deleteBookTag, updateBookTag } = require('../Controllers/BookTag.controller')
const { createBookRating, getAllBookRating, singleBookRating, updateBookRating, deleteBookRating } = require('../Controllers/BookRating.controller')
const { createBookBundle, getBookBundle, getSingleBookBundle, updateBookBundle, deleteBookBundle } = require('../Controllers/BookBundle.controller')
const { AddProductIncart, increaseQuantity, removeProductFromCart, GetAllProductCart, GetAllBySessionIdProductCart, GetAllByUserIdProductCart, decreaseQuantity, deleteBySessionId } = require('../Controllers/CartController')
const { CreateCheckOut, FindMode, MakeOrder, MyOrderOfPenDrive, OrderStatusById, ShowMyCourse, BookOrder } = require('../Controllers/Ordercontroller')
const { createCourseMode, getCourseMode, getSingleCourseMode, deleteCourseMode, updateCourseMode } = require('../Controllers/CourseMode.controller')
const router = express.Router()

// user routers 

router.post('/Create-User', register)
router.post('/Login', login)
router.get('/Logout', protect, logout)
router.post('/Password-Change', passwordChangeRequest)
router.post('/Verify-Otp', verifyOtpAndChangePassword)
router.post('/resend-otp', resendOtp)


router.post('/Add-Delivery-Address', protect, addDeliveryDetails)
router.get('/user-details', protect, userDetails)
router.get('/get-Delivery-Address', protect, GetDeliveryAddressOfUser)
router.post('/update-Delivery-Address', protect, updateDeliveryAddress)
router.get('/AllUser', getAllUsers)

// bundle routers 

router.post('/create-Bundle', upload.single("bundleImage"), createBundle)
router.get('/get-all-Bundles', getAllBundles)
router.delete('/delete-bundle/:_id', deleteSingleBundle)
router.put('/update-bundle/:_id', upload.single("bundleImage"), updateBundle)
router.get('/single-bundle/:_id', getSingleBundle)

// category routers 

router.post('/create-category', upload.single('categoryImage'), createCategory)
router.get('/get-all-category', getAllCategory)
router.get('/single-category/:_id', singleCategory)
router.delete('/delete-category/:_id', deleteCategory)
router.put('/update-category/:_id', upload.single('categoryImage'), updateCategory)

// banner routers 

router.post('/create-banner', upload.single('bannerImage'), createBanner);
router.get('/get-all-banner', getAllBanner)
router.delete('/delete-banner/:_id', deletebanner)
router.put('/update-baner/:_id', upload.single('bannerImage'), updateBanner)

// tag routers 

router.post('/create-tag', createTag)
router.get('/get-all-tag', getAllTag)
router.get('/single-tag/:_id', getSingleTag)
router.put('/update-tag/:_id', updateTag)
router.delete('/delete-tag/:_id', deleteTag)

// course routers 

router.post('/create-course', upload.single('courseImage'), createCourse)
router.get('/get-all-course', getAllCourse)
router.get('/single-course/:_id', getSingleCourse)
router.delete('/delete-course/:_id', deleteCourse)
router.put('/update-course/:_id', upload.single('courseImage'), updateCourse)
router.put('/update-course-feature/:id', updateCourseFeature)
router.get('/get-courses-by-category/:categoryId', getCoursesByCategory)

// Teacher routers

router.post('/create-teacher', upload.single('teacherImage'), createTeacher)
router.get('/get-all-teacher', getAllTeacher)
router.get('/single-teacher/:_id', getSingleTeacher)
router.delete('/delete-teacher/:_id', deleteTeacher)
router.put('/update-teacher/:_id', upload.single('teacherImage'), updateTeacher)

// Teacher Rating router 

router.post('/create-teacher-rating', createTeacherRating)
router.get('/get-all-teacher-rating', getAllTeacherRating)
router.get('/get-single-teacher-rating/:_id', singleTeacherRating)
router.put('/update-teacher-rating/:_id', updateTeacherRating)
router.delete('/delete-teacher-rating/:_id', deleteTeacherRating)

// course rating router 

router.post('/create-course-rating', createCourseRating)
router.get('/get-all-course-rating', getAllCourseRating)
router.get('/get-single-course-rating/:_id', singleCourseRating)
router.put('/update-course-rating/:_id', updateCourseRating)
router.delete('/delete-course-rating/:_id', deleteCourseRating)

// home banner 

router.post('/create-home-banner', upload.single('homeBannerImage'), createHomeBanner)
router.get('/get-home-banner', getAllHomeBanner)
router.delete('/delete-home-banner/:_id', deleteHomeBanner)

// course title router 

router.post('/create-course-title', createCourseTitle)
router.get('/get-all-course-title', getAllCourseTitle)
router.delete('/delete-course-title/:_id', deleteCourseTitle)
router.put('/update-course-title/:_id', updateCourseTitle)
router.get('/get-single-course-title/:_id', getSingleCourseTitle)

// create book router 

// router.post('/create-book',upload.fields([{ name: 'bookImage' }, { name: 'bookPdf' }]),createBook)
router.post('/create-book', upload.fields([{ name: 'bookImage' }, { name: 'bookPdf' }]), createBook)
router.get('/get-all-book', getAllBook)
router.get('/get-single-book/:_id', getSingleBook)
router.delete('/delete-book/:_id', deleteBook)
router.put('/update-book/:_id', upload.single('bookImage'), updateBook)
router.put('/update-book-feature/:id', updateBookFeature)
router.get('/get-book-by-category/:categoryId', getBookByCategory)

// category book routers 

router.post('/create-book-category', upload.single('categoryImage'), createBookCategory)
router.get('/get-all-book-category', getAllBookCategory)
router.get('/single-book-category/:_id', singleBookCategory)
router.delete('/delete-book-category/:_id', deleteBookCategory)
router.put('/update-book-category/:_id', upload.single('categoryImage'), updateBookCategory)

// book tag routers 

router.post('/create-book-tag', createBookTag)
router.get('/get-all-book-tag', getAllBookTags)
router.get('/single-book-tag/:_id', getSingleBookTag)
router.put('/update-book-tag/:_id', updateBookTag)
router.delete('/delete-book-tag/:_id', deleteBookTag)

// book rating router 

router.post('/create-book-rating', createBookRating)
router.get('/get-all-book-rating', getAllBookRating)
router.get('/get-single-book-rating/:_id', singleBookRating)
router.put('/update-book-rating/:_id', updateBookRating)
router.delete('/delete-book-rating/:_id', deleteBookRating)

// book bundle router 

router.post('/create-book-bundle', upload.single('bundleImage'), createBookBundle)
router.get('/get-all-book-bundle', getBookBundle)
router.get('/get-single-book-bundle/:_id', getSingleBookBundle)
router.put('/update-book-bundle/:_id', upload.single('bundleImage'), updateBookBundle)
router.delete('/delete-book-bundle/:_id', deleteBookBundle)


//Cart Routes
router.post('/add-to-cart', AddProductIncart);
router.put('/update-quantity-increase', increaseQuantity);
router.put('/update-quantity-decrease', decreaseQuantity);
router.post('/delete-by-session', deleteBySessionId);

router.post('/remove-product', removeProductFromCart);
router.get('/get-all-products', GetAllProductCart);
router.get('/get-products-by-session/:sessionId', GetAllBySessionIdProductCart);
router.get('/get-products-by-user/:userId', GetAllByUserIdProductCart);

//Payments Routes

router.post('/Checkout', CreateCheckOut);
router.post('/Make-Order', protect, MakeOrder);
router.get('/my-Order-PenDrive', protect, MyOrderOfPenDrive);
router.get('/Order-Status/:OrderId', protect, OrderStatusById);
router.get('/show-course', protect, ShowMyCourse);
router.get('/book-order', protect, BookOrder);









// router.post('/Find-Mode', FindMode)

// course mode 

router.post('/create-course-mode', createCourseMode)
router.get('/get-course-mode', getCourseMode)
router.get('/get-single-course-mode', getSingleCourseMode)
router.delete('/delete-course-mode:_id', deleteCourseMode)
router.put('/update-course-mode:_id', updateCourseMode)



module.exports = router