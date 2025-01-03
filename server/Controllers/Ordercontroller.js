const crypto = require('crypto');
const axios = require('axios');
const Course = require('../Models/Course.Model')
const CourseBundle = require('../Models/Bundles.Model');
const OrderModel = require('../Models/OrderModel');
require('dotenv').config()
// const merchantId = "M2257T8PKCFTS"
// const apiKey = "382a6ef0-8a78-4abd-bc79-5fd4afca18e6"
const merchantId = process.env.PHONEPAY_MERCHANT_ID
const apiKey = process.env.PHONEPAY_API_KEY

exports.MyOrderOfPenDrive = async (req, res) => {
    try {
        const user = req.user.id
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User No Authorized'
            })
        }
        const checkOrder = await OrderModel.findById({ userId: user })

        const checkOrderType = checkOrder.CartItems.some(item => item.selectedMode?.name === "Pen Drive");

        if (!checkOrderType) {
            return res.status(402).json({
                success: false,
                message: "No Order Found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Order Found Successful",
            data: checkOrderType
        })
    } catch (error) {
        console.log(error)
        res.status(501).json({
            success: false,
            message: "Error in  Order Found"
        })
    }
}

exports.OrderStatusById = async (req, res) => {
    try {
        const user = req.user.id
        const OrderId = req.params.OrderId
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User No Authorized'
            })
        }
        const checkOrder = await OrderModel.findById({
            $or: {
                userId: user,
                _id: OrderId
            }
        })

        const checkOrderType = checkOrder.CartItems.some(item => item.selectedMode?.name === "Pen Drive");

        if (!checkOrderType) {
            return res.status(402).json({
                success: false,
                message: "No Order Found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Order Found Successful",
            data: checkOrderType.OrderStatus
        })
    } catch (error) {
        console.log(error)
        res.status(501).json({
            success: false,
            message: "Error in  Order Found"
        })
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const user = req.user.id; // Assume middleware sets req.user
        const OrderId = req.params.OrderId;
        const { OrderStatus } = req.body;

        // console.log("detail",user,OrderId,OrderStatus)

        // Validate user authentication
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not authorized'
            });
        }
        const userId = user._id
        console.log("userId", userId)

        // Validate OrderStatus
        const validStatuses = ["Pending", "Order-Packed", "Ready To Ship", "Dispatch", "Delivered", "Cancelled"];
        if (!validStatuses.includes(OrderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OrderStatus'
            });
        }

        // Find and validate the order
        const order = await OrderModel.findOne({
            _id: OrderId,
            // userId: userId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update the order status
        order.OrderStatus = OrderStatus;
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status'
        });
    }
};


exports.ShowMyCourse = async (req, res) => {
    try {
        const user = req.user.id._id;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User Not Authorized'
            });
        }

        const checkOrder = await OrderModel.find({ userId: user });

        console.log("checkOrder", checkOrder)

        if (!checkOrder.length) {
            return res.status(402).json({
                success: false,
                message: "No Orders Found"
            });
        }

        // Iterate through orders and filter CartItems
        // const checkOrderType = checkOrder.flatMap(order =>
        //     order.CartItems?.filter(item =>
        //         ["Google Drive", "Offline", "Live", "Pen Drive"].includes(item.selectedMode?.name)
        //     ) || []
        // );

        // if (!checkOrderType.length) {
        //     return res.status(402).json({
        //         success: false,
        //         message: "No Matching Orders Found"
        //     });
        // }

        res.status(200).json({
            success: true,
            message: "Orders Found Successfully",
            data: checkOrder
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error Finding Courses"
        });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const checkOrder = await OrderModel.find().populate('userId');

        if (!checkOrder.length) {
            return res.status(402).json({
                success: false,
                message: "No Orders Found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Orders Found Successfully",
            data: checkOrder
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: error,
            message: "Error in finding orders"
        })
    }
}


exports.BookOrder = async (req, res) => {
    // console.log("req",req)
    try {

        const user = req.user.id._id
        // console.log(user)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User No Authorized'
            })
        }
        const checkOrder = await OrderModel.find({ userId: user })
        //console.log("checkOrder",checkOrder)

        const checkOrderType = checkOrder.flatMap(order =>
            order.CartItems?.filter(item =>
                item.selectedMode === null
            ) || []
        );

        // console.log(checkOrderType)

        if (!checkOrderType) {
            return res.status(402).json({
                success: false,
                message: "No Order Found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Order Found Successful",
            data: checkOrderType
        })




    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in Book Found",
        })
    }
}


exports.MakeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { CartItems, AddressDetails, totalPrice } = req.body;

        const hasPenDrive = CartItems.some(item => item.selectedMode?.name === "Pen Drive");
        const hasGoogleDrive = CartItems.some(item => item.selectedMode?.name === "Google Drive");

        const OrderStatus = hasPenDrive ? "Pending" : null;

        // Initialize these variables outside the condition to avoid reference errors
        let CourseStartData = null;
        let CourseEnd = null;

        if (hasGoogleDrive) {
            const currentDate = new Date();
            CourseStartData = currentDate;
            CourseEnd = new Date(currentDate);
            // CourseEnd = new Date(currentDate.setFullYear(currentDate.getFullYear() + 2));
            CourseEnd.setFullYear(CourseEnd.getFullYear() + 1);
        }

        const newOrder = new OrderModel({
            userId: userId,
            CartItems,
            OrderStatus,
            Address: AddressDetails,
            CourseExpireData: CourseEnd,
            CourseStartData,
            totalPrice: totalPrice
            // PaymentDone: true
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order Placed Successfully",
            data: newOrder
        });

    } catch (error) {
        console.error(error);
        res.status(501).json({
            success: false,
            message: "Order Placement Failed",
            error: error.message
        });
    }
};


exports.CreateCheckOut = async (req, res) => {
    try {

        const { totalPrice, orderId } = req.body

        const transactionId = crypto.randomBytes(9).toString('hex');
        const merchantUserId = crypto.randomBytes(12).toString('hex');
        const data = {
            merchantId: merchantId,
            merchantTransactionId: transactionId,
            merchantUserId,
            name: "User",
            amount: totalPrice * 100,
            callbackUrl: `https://www.panandacademy.com/payment-failed`,
            // redirectUrl: `https://www.api.panandacademy.com/api/v1/status-payment/${transactionId}`,
            redirectUrl: `https://www.api.panandacademy.com/api/v1/status-payment/${transactionId}`,
            redirectMode: 'POST',
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        // console.log("data", data)

        const payload = JSON.stringify(data);
        // console.log("payload",payload)
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + apiKey;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
        const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
        console.log("Checksum:", checksum);
        console.log("Payload (Base64):", payloadMain);

        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        const response = await axios.request(options);
        // console.log("i am response id ", response?.data?.data?.merchantTransactionId);
        // console.log("i am response ", response);
        const updateOrder = await OrderModel.findById(orderId)
        if (updateOrder) {
            updateOrder.PhonePeOrderId = response?.data?.data?.merchantTransactionId
            await updateOrder.save()
        }
        res.status(201).json({
            success: true,
            url: response.data.data.instrumentResponse.redirectInfo.url
        })
    } catch (error) {
        console.log(error)
        res.status(501).json({
            success: false,
            msg: "Payment initiated failed"
        })
    }
}

exports.checkStatus = async (req, res) => {
    // console.log("pay")
    const { merchantTransactionId } = req.params;
    // console.log("merchantTransactionId",merchantTransactionId)

    if (!merchantTransactionId) {
        return res.status(400).json({ success: false, message: "Merchant transaction ID not provided" });
    }

    try {
        const merchantIdD = merchantId; // Ensure merchantId is defined
        const keyIndex = 1;
        const string = `/pg/v1/status/${merchantIdD}/${merchantTransactionId}` + apiKey;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + "###" + keyIndex;
        const testUrlCheck = "https://api.phonepe.com/apis/hermes/pg/v1";

        const options = {
            method: 'GET',
            url: `${testUrlCheck}/status/${merchantId}/${merchantTransactionId}`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': `${merchantId}`
            }
        };

        const { data } = await axios.request(options);
        // console.log("data in", data)
        if (data.success === true) {
            // console.log("i am in ")
            const findOrder = await OrderModel.findOne({ PhonePeOrderId: merchantTransactionId });
            if (findOrder) {
                findOrder.transactionId = data?.data?.merchantTransactionId;
                findOrder.PaymentDone = true;
                findOrder.paymentStatus = "Completed";
                await findOrder.save();
                // console.log("findOrder in")
            }
            // console.log("findOrder out",findOrder)

            const successRedirect = `https://panandacademy.com/order-confirmed?id=${merchantTransactionId}&success=true&data=${encodeURIComponent(
                JSON.stringify(findOrder)
            )}`;
            return res.redirect(successRedirect);
        } else {
            const failureRedirect = `https://panandacademy.com/payment-failed`;
            return res.redirect(failureRedirect);
        }

    } catch (error) {
        console.error("Error in checkStatus:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
};


exports.PaymentCallback = async (req, res) => {
    try {
        const { merchantTransactionId, amount, status, message } = req.body;
        const order = await OrderModel.findOne({ transactionId: merchantTransactionId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (status === "SUCCESS") {
            order.PaymentDone = true;
            order.paymentStatus = "Completed";
            await order.save();

            return res.status(200).json({
                success: true,
                message: "Payment successful",
                order
            });
        } else {
            order.paymentStatus = "Failed";
            await order.save();

            return res.status(400).json({
                success: false,
                message: `Payment failed: ${message}`
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error processing payment callback",
            error: error.message
        });
    }
};


exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await OrderModel.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                msg: "Order not found"
            })
        }
        res.status(200).json({
            success: true,
            msg: "Order deleted successfully"
        })

    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            msg: "Internal server error"
        })
    }
}