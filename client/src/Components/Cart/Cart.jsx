import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import AddressForOrder from '../Address/AddressForOrder';

function Cart() {
    const SESSION_KEY = 'user_session';
    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    let session = sessionStorage.getItem(SESSION_KEY);
    let token = sessionStorage.getItem('token')
    const [cartItems, setCartItems] = useState([]);
    const [userToken, setUserToken] = useState();
    const [open, setOpen] = useState(false)
    useEffect(() => {
        setUserToken(token)
    }, [token])

    console.log(session)
    const [totalPrice, setTotalPrice] = useState(0);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/v1/get-products-by-session/${session}`);
            console.log(response.data.cart);
            if (response.data) {
                setCartItems(response.data.cart);
                calculateTotalPrice(response.data.cart);
            } else {
                toast.error("Error in Fetching Cart Details Please Wait....");
            }
        } catch (error) {
            console.log(error);
            // toast.error("Error in Fetching Cart Details Please Wait....");
        }
    };

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }
    const removeProduct = async (productId) => {

        try {
            const response = await axios.post(`http://localhost:9000/api/v1/remove-product`, {
                productId,
                sessionId: session
            });
            console.log(response.data.cart);
            if (response.data) {
                setCartItems(response.data.cart);
                calculateTotalPrice(response.data.cart);
                toast.success("Product removed from cart");
                handleFetchCourse()
            } else {
                toast.error("Error in removing product. Please try again.");
            }
        } catch (error) {
            console.log(error);
            // toast.error("Error in removing product. Please try again.");
        }
    };

    const deleteAll = async()=>{
        // console.log(session)
        try {
            const res  = await axios.post('http://localhost:9000/api/v1/delete-by-session',{session})
            console.log(res.data)
        } catch (error) {
            
        }
    }

    const calculateTotalPrice = (cartItems) => {
        const total = cartItems.reduce((sum, item) => sum + 1 * item.productPrice, 0);
        setTotalPrice(total);
    };

    // deleteAll()


    const clickToCheckout = async () => {
        if (userToken) {
            const checkAddressDetails = JSON.parse(sessionStorage.getItem('Address-Details'));
            const cartItemsInCheckout = cartItems.some( (item) => item.selectedMode?.name === 'Pen Drive' || item.selectedMode?.id === '66d84947fe3508950760fa0a' || false);
    
            // If cart items require an address and no address is found, open the modal
            if (cartItemsInCheckout === true && !checkAddressDetails) {
                handleOpen();
            }
    
            // If address is found, or  address is required, proceed with the checkout
            if (cartItemsInCheckout === true && checkAddressDetails) {
                const cartData = {
                    CartItems: cartItems,
                    AddressDetails:checkAddressDetails // Add address only if necessary
                };
    
                try {
                    const response = await axios.post('http://localhost:9000/api/v1/Make-Order', cartData, {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    });
                    deleteAll()
                    window.location.href="/Order-Confirmed"
                    // Handle success (e.g., navigate to a success page, display a message, etc.)
                    console.log('Order successfully placed:', response.data);
                } catch (error) {
                    // Handle error (e.g., display an error message, log the error, etc.)
                    console.error('Error placing the order:', error);
                }
            }
            else if(cartItemsInCheckout === false){
                const cartData = {
                    CartItems: cartItems,
                    
                };
    
                try {
                    const response = await axios.post('http://localhost:9000/api/v1/Make-Order', cartData, {
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        }
                    });
                    window.location.href="/Order-Confirmed"
                    deleteAll()

                    // Handle success (e.g., navigate to a success page, display a message, etc.)
                    console.log('Order successfully placed:', response.data);
                } catch (error) {
                    // Handle error (e.g., display an error message, log the error, etc.)
                    console.error('Error placing the order:', error);
                }
            }
        } else {
            window.location.href = `/login?redirect=cart`;
        }
    };
    


    const applyCouponCode = () => {
        // Implement coupon code logic here
        toast.info("Coupon code applied successfully");
    };

    // console.log("Cart", cartItems)

    useEffect(() => {
        fetchData();
    }, [session]);

    return (
        <>
            <ToastContainer />
            {/* Breadcrumb Section Start */}
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <div className="page-heading">
                        <h1>Cart</h1>
                        <div className="page-header">
                            <ul className="breadcrumb-items">
                                <Link to={"/"}>
                                    Home
                                </Link>
                                <li>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </li>
                                <li>Cart</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {/* Shop Cart Section Start */}
                <div className="cart-section section-padding">
                    <div className="container">
                        <div className="main-cart-wrapper">
                            <div className="row g-5">
                                <div className="col-xl-9">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Price</th>
                                                    <th>Mode</th>
                                                    <th>Subtotal</th>
                                                    <th>Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.length > 0 ? (
                                                    cartItems.map((item, index) => (
                                                        <tr key={index}>
                                                            {console.log(item)}
                                                            <td>
                                                                <span className="d-flex gap-5 align-items-center">
                                                                    <img src={item.productImage} width={90} alt={'No-image'} />
                                                                    <span className="cart-title">{item.productName}</span>
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="cart-price">Rs {item.productPrice} </span>
                                                            </td>
                                                            <td>
                                                                <span className="cart-price"> {item.selectedMode?.name} </span>
                                                            </td>
                                                            
                                                            {/* <td>
                                                                <span className="quantity-basket">
                                                                    <span className="qty">
                                                                        <button
                                                                            className="qtyminus"
                                                                            aria-hidden="true"
                                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                                        >
                                                                            −
                                                                        </button>
                                                                        <input
                                                                            type="number"
                                                                            name="qty"
                                                                            min="1"
                                                                            max="10"
                                                                            step="1"
                                                                            value={item.quantity}
                                                                            readOnly
                                                                        />
                                                                        <button
                                                                            className="qtyplus"
                                                                            aria-hidden="true"
                                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </span>
                                                                </span>
                                                            </td> */}
                                                            <td>
                                                                <span className="subtotal-price">
                                                                    Rs {1 * item.productPrice}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="remove-icon"
                                                                    onClick={() => removeProduct(item.productId)}
                                                                >
                                                                    <img src="assets/img/icon/icon-9.svg" alt="remove" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (<tr><td colSpan="5"><p>No Product in cart</p></td></tr>)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-xl-3">
                                    <div className="table-responsive cart-total">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Cart Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <span className="d-flex gap-5 align-items-center justify-content-between">
                                                            <span className="sub-title">Total:</span>
                                                            <span className="sub-price sub-price-total">
                                                                Rs {totalPrice}
                                                            </span>
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {/* <button className="theme-btn" onClick={() => applyCouponCode()}>
                                            Apply Coupon Code
                                        </button> */}
                                        <button type='button' onClick={clickToCheckout} style={{ whiteSpace: 'nowrap', padding:'20px 18px' }} className="theme-btn mt-3">
                                            Proceed to checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <AddressForOrder isOpen={open} onClose={handleClose} UserToken={userToken} OrderData={cartItems} />
        </>
    );
}

export default Cart;
