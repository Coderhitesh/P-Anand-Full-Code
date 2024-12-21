import React, { createContext, useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Create the CartContext
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const SESSION_KEY = 'user_session';
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [open, setOpen] = useState(false);
    const session = sessionStorage.getItem(SESSION_KEY);
    const token = sessionStorage.getItem('token');
    const [userToken, setUserToken] = useState(token);

    useEffect(() => {
        setUserToken(token);
        fetchData(); // Fetch cart data when the provider mounts to show in header
    }, [token]);

    // Fetch cart items from API
    const fetchData = async () => {
        try {
            const response = await axios.get(`https://www.api.panandacademy.com/api/v1/get-products-by-session/${session}`);
            if (response.data) {
                setCartItems(response.data.cart);
                setProductCount(response.data.cart.length); // Update product count
                calculateTotalPrice(response.data.cart);
            } else {
                toast.error("Error fetching cart details.");
            }
        } catch (error) {
            console.error("Error fetching cart details", error);
        }
    };

    // Add a product to the cart (trigger an immediate update)
    const addProductToCart = async (productId) => {
        try {
            const response = await axios.post('https://www.api.panandacademy.com/api/v1/add-product', {
                productId,
                sessionId: session,
            });
            if (response.data) {
                setCartItems(response.data.cart);
                setProductCount(response.data.cart.length); // Immediately update the product count
                calculateTotalPrice(response.data.cart);
                toast.success("Product added to cart.");
            } else {
                toast.error("Error adding product to cart.");
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };

    // Remove product from cart
    const removeProduct = async (productId) => {
        try {
            const response = await axios.post(`https://www.api.panandacademy.com/api/v1/remove-product`, {
                productId,
                sessionId: session,
            });
            if (response.data) {
                setCartItems(response.data.cart);
                setProductCount(response.data.cart.length); // Update product count
                calculateTotalPrice(response.data.cart);
                toast.success("Product removed from cart.");
            } else {
                toast.error("Error removing product. Please try again.");
            }
        } catch (error) {
            console.error("Error removing product:", error);
        }
    };

    // Delete all products from cart
    const deleteAll = async () => {
        try {
            const res = await axios.post('https://www.api.panandacademy.com/api/v1/delete-by-session', { session });
            console.log('res', res.data)
            setCartItems([]);
            setTotalPrice(0);
            setProductCount(0); // Reset product count
        } catch (error) {
            console.error("Error deleting all products:", error);
        }
    };

    // Calculate the total price
    const calculateTotalPrice = (cartItems) => {
        const total = cartItems.reduce((sum, item) => sum + item.productPrice, 0);
        setTotalPrice(total);
    };

    // Handle checkout
    const clickToCheckout = async () => {
        if (userToken) {
            const checkAddressDetails = JSON.parse(sessionStorage.getItem('Address-Details'));
            const cartItemsInCheckout = cartItems.some(
                (item) =>
                    item.selectedMode?.name === 'Pen Drive' ||
                    item.selectedMode?.id === '66d84947fe3508950760fa0a'
            );

            if (cartItemsInCheckout && !checkAddressDetails) {
                setOpen(true);
            } else {
                console.log('cartitem', cartItems);

                const cartData = {
                    CartItems: cartItems,
                    AddressDetails: cartItemsInCheckout ? checkAddressDetails : undefined,
                    totalPrice: totalPrice,
                };

                try {
                    // Call Make-Order API
                    const orderResponse = await axios.post('https://www.api.panandacademy.com/api/v1/Make-Order', cartData, {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    });

                    const orderData = orderResponse.data.data;
                    console.log('orderData', orderData?._id);


                    const checkoutResponse = await axios.post(
                        'https://www.api.panandacademy.com/api/v1/Checkout',
                        { totalPrice: totalPrice, orderId: orderData?._id },
                        {
                            headers: {
                                Authorization: `Bearer ${userToken}`,
                            },
                        }
                    );

                    if (checkoutResponse.data.success) {

                        window.location.href = checkoutResponse.data.url;
                    } else {
                        console.error('Error initiating payment:', checkoutResponse.data.msg);
                    }


                    deleteAll();
                    setTotalPrice(0);
                    sessionStorage.setItem('Address-Details', null);
                } catch (error) {
                    console.error('Error placing the order or initiating payment:', error);
                }
            }
        } else {
            window.location.href = `/login?redirect=cart`;
        }
    };


    // Context values
    const contextValues = {
        cartItems,
        totalPrice,
        removeProduct,
        addProductToCart, // Added this function to be used for adding products
        clickToCheckout,
        open,
        setOpen,
        fetchData,
        deleteAll,
        productCount, // Pass product count in context
    };

    return (
        <CartContext.Provider value={contextValues}>
            {/* <Toaster /> */}
            {children}
        </CartContext.Provider>
    );
};
