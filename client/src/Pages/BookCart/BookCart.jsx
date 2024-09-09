import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function BookCart() {
    const [cartItems, setCartItems] = useState(JSON.parse(sessionStorage.getItem('bookCart')) || []);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        sessionStorage.setItem('bookCart', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleQuantityChange = (id, change) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.book._id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + change) }
                    : item
            )
        );
    };

    const handleRemoveItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.book._id !== id));
    };

    const handleCouponApply = (e) => {
        e.preventDefault();
        if (couponCode === 'DISCOUNT10') {
            setDiscount(10);
            toast.success('Coupon applied successfully!');
        } else {
            toast.error('Invalid Coupon Code');
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    return (
        <>
            <ToastContainer />
            {/* Breadcrumb Section Start */}
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <div className="page-heading">
                        <h1>Book Cart</h1>
                        <div className="page-header">
                            <ul className="breadcrumb-items">
                                <Link to={"/"}>
                                    Home
                                </Link>
                                <li>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </li>
                                <li>Book Cart</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

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
                                                <th>Quantity</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.length > 0 ? (
                                                cartItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <span className="d-flex gap-5 align-items-center">
                                                                <a
                                                                    href="#"
                                                                    className="remove-icon"
                                                                    onClick={() => handleRemoveItem(item.book._id)}
                                                                >
                                                                    <img src="assets/img/icon/icon-9.svg" alt="remove" />
                                                                </a>
                                                                <span className="cart">
                                                                    <img src={item.book?.bookImage?.url} width={90} alt={item.book.bookName} />
                                                                </span>
                                                                <span className="cart-title">{item.book.bookName}</span>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="cart-price">Rs {item.price.toFixed(2)}</span>
                                                        </td>
                                                        <td>
                                                            <span className="quantity-basket">
                                                                <span className="qty">
                                                                    <button
                                                                        className="qtyminus"
                                                                        aria-hidden="true"
                                                                        onClick={() => handleQuantityChange(item.book._id, -1)}
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
                                                                        onClick={() => handleQuantityChange(item.book._id, 1)}
                                                                    >
                                                                        +
                                                                    </button>
                                                                </span>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="subtotal-price">
                                                                Rs {(item.price * item.quantity).toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4">
                                                        <p>No Product in cart</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="cart-wrapper-footer">
                                    <form onSubmit={handleCouponApply}>
                                        <div className="input-area">
                                            <input
                                                type="text"
                                                name="CouponCode"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="Coupon Code"
                                            />
                                            <button type="submit" className="theme-btn">
                                                Apply
                                            </button>
                                        </div>
                                    </form>
                                    <button className="theme-btn" onClick={() => setCartItems([...cartItems])}>
                                        Update Cart
                                    </button>
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
                                                        <span className="sub-title">Subtotal:</span>
                                                        <span className="sub-price">Rs {subtotal.toFixed(2)}</span>
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-5 align-items-center justify-content-between">
                                                        <span className="sub-title">Discount:</span>
                                                        <span className="sub-price">{discount}%</span>
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span className="d-flex gap-5 align-items-center justify-content-between">
                                                        <span className="sub-title">Total:</span>
                                                        <span className="sub-price sub-price-total">Rs {total.toFixed(2)}</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <Link to={`/checkout?modeAvailable=${cartItems.map((item) => item.mode ? true : false)}&modeId=${cartItems.map((item) => item.mode)}&Total=${total.toFixed(0)}`} className="theme-btn">
                                        Proceed to checkout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BookCart;
