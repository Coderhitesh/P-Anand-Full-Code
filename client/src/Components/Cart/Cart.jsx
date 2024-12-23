import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import { CartContext } from '../../Context/CartContext';
import AddressForOrder from '../Address/AddressForOrder';
import './cart.css'

function Cart() {
    const {
        cartItems,
        totalPrice,
        removeProduct,
        clickToCheckout,
        open,
        setOpen,
        fetchData,
    } = useContext(CartContext);

    const formatCurrency = (amount) => {
        if (!amount) return '0.00';
        return parseFloat(amount)
            .toFixed(2) // Ensure two decimal places
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Format with commas
    };

    console.log("cart",cartItems)
    

    useEffect(() => {
        fetchData();
    }, [cartItems]);

    return (
        <>
            {/* <ToastContainer /> */}
            <Toaster />
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
                                                            <td>
                                                                <span className="d-flex gap-5 align-items-center">
                                                                    <img src={item.productImage} width={90} alt={'No-image'} />
                                                                    <span className="cart-title">{item.productName}</span>
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className="cart-price">₹ {formatCurrency(item.productPrice)} </span>
                                                            </td>
                                                            <td>
                                                                <span className="cart-price"> {item.selectedMode?.name} </span>
                                                            </td>
                                                            <td>
                                                                <span className="subtotal-price">
                                                                    ₹ {formatCurrency(1 * item.productPrice)}
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
                                                                ₹ {formatCurrency(totalPrice)}
                                                            </span>
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <button type='button' onClick={clickToCheckout} style={{ whiteSpace: 'nowrap', padding: '20px 18px' }} className="theme-btn mt-3">
                                            Proceed to checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddressForOrder isOpen={open} onClose={() => setOpen(false)} />
        </>
    );
}

export default Cart;
