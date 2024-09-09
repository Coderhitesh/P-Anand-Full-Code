import React, { useEffect, useState } from 'react';

const CourseAndCourseBundle = ({ Course, CourseBundle }) => {
    const [courseItems, setCourseItems] = useState([]);
    const [bundleItems, setBundleItems] = useState([]);

    useEffect(() => {
        if (Course) {
            setCourseItems(Array.isArray(Course) ? Course : [Course]);
        }
        if (CourseBundle) {
            setBundleItems(Array.isArray(CourseBundle) ? CourseBundle : [CourseBundle]);
        }
    }, [Course, CourseBundle]);

    const handleQuantityChange = (id, change, type) => {
        if (type === 'course') {
            setCourseItems(prevItems =>
                prevItems.map(item =>
                    item._id === id
                        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
                        : item
                )
            );
            sessionStorage.setItem('cart', JSON.stringify(courseItems));
        } else if (type === 'bundle') {
            setBundleItems(prevItems =>
                prevItems.map(item =>
                    item._id === id
                        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
                        : item
                )
            );
            sessionStorage.setItem('bookCart', JSON.stringify(bundleItems));
        }
    };

    const handleRemoveItem = (id, type) => {
        if (type === 'course') {
            const updatedItems = courseItems.filter(item => item._id !== id);
            setCourseItems(updatedItems);
            sessionStorage.setItem('cart', JSON.stringify(updatedItems));
        } else if (type === 'bundle') {
            const updatedItems = bundleItems.filter(item => item._id !== id);
            setBundleItems(updatedItems);
            sessionStorage.setItem('bookCart', JSON.stringify(updatedItems));
        }
    };

    const calculateSubtotal = (price, quantity) => {
        return price * quantity;
    };

    const renderCartItems = (items, type) => {
        return items.length > 0 ? (
            items.map((item, index) => {
                const price = type === 'course'
                    ? item.product?.courseMode?.find(mode => mode._id === item.mode)?.coursePriceAfterDiscount
                    : item.bundle.bundleStartingPrice;

                return (
                    <tr key={index}>
                        <td>
                            <span className="d-flex gap-5 align-items-center">
                                <img src={type === 'course' ? item.product?.courseImage?.url : item.bundle.bundleImage?.url} width={90} alt={type === 'course' ? item.product?.courseName : item.bundleName} />
                                <span className="cart-title">{type === 'course' ? item.product?.courseName : item.bundle.bundleName}</span>
                            </span>
                        </td>
                        <td>
                            <span className="cart-price">Rs {price.toFixed(2)}</span>
                        </td>
                        <td>
                            <span className="quantity-basket">
                                <span className="qty">
                                    <button
                                        className="qtyminus"
                                        aria-hidden="true"
                                        onClick={() => handleQuantityChange(item._id, -1, type)}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        name="qty"
                                        min="1"
                                        max="10"
                                        step="1"
                                        value={item.quantity || 1}
                                        readOnly
                                    />
                                    <button
                                        className="qtyplus"
                                        aria-hidden="true"
                                        onClick={() => handleQuantityChange(item._id, 1, type)}
                                    >
                                        +
                                    </button>
                                </span>
                            </span>
                        </td>
                        <td>
                            <span className="subtotal-price">
                                Rs {calculateSubtotal(price, item.quantity || 1).toFixed(2)}
                            </span>
                        </td>
                        <td>
                            <button onClick={() => handleRemoveItem(item._id, type)} className="remove-icon">
                                <img src="assets/img/icon/icon-9.svg" alt="remove" />
                            </button>
                        </td>
                    </tr>
                );
            })
        ) : (
            <tr>
                <td colSpan="5">
                    <p></p>
                </td>
            </tr>
        );
    };

    const totalCoursePrice = courseItems.reduce(
        (acc, item) => acc + calculateSubtotal(item.product?.courseMode?.find(mode => mode._id === item.mode)?.coursePriceAfterDiscount, item.quantity || 1),
        0
    );

    const totalBundlePrice = bundleItems.reduce(
        (acc, item) => acc + calculateSubtotal(item.bundle.bundleStartingPrice, item.quantity || 1),
        0
    );

    return (
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
                                                <th>Quantity</th>
                                                <th>Subtotal</th>
                                                <th>Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderCartItems(courseItems, 'course')}
                                            {renderCartItems(bundleItems, 'bundle')}
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
                                                            Rs {(totalCoursePrice + totalBundlePrice).toFixed(2)}
                                                        </span>
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button className="theme-btn">
                                        Proceed to checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseAndCourseBundle;
