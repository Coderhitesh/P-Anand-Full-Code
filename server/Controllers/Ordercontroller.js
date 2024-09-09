const merchantId = "M2257T8PKCFTS"
const apiKey = "382a6ef0-8a78-4abd-bc79-5fd4afca18e6"
const crypto = require('crypto');
const axios = require('axios');
const Course = require('../Models/Course.Model')
const CourseBundle = require('../Models/Bundles.Model');
const OrderModel = require('../Models/OrderModel');

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

        if (!checkOrder.length) {
            return res.status(402).json({
                success: false,
                message: "No Orders Found"
            });
        }

        // Iterate through orders and filter CartItems
        const checkOrderType = checkOrder.flatMap(order => 
            order.CartItems?.filter(item => 
                ["Google Drive", "Offline", "Live", "Pen Drive"].includes(item.selectedMode?.name)
            ) || []
        );

        if (!checkOrderType.length) {
            return res.status(402).json({
                success: false,
                message: "No Matching Orders Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Orders Found Successfully",
            data: checkOrderType
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error Finding Courses"
        });
    }
};


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
        
        console.log(checkOrderType)

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
        const { CartItems, AddressDetails } = req.body;

        const PhonePeOrderId = crypto.randomBytes(9).toString('hex');
        const transactionId = crypto.randomBytes(9).toString('hex');
        const PhonePePaymentId = crypto.randomBytes(10).toString('hex');

        const hasPenDrive = CartItems.some(item => item.selectedMode?.name === "Pen Drive");
        const hasGoogleDrive = CartItems.some(item => item.selectedMode?.name === "Google Drive");

        const OrderStatus = hasPenDrive ? "Pending" : null;

        // Initialize these variables outside the condition to avoid reference errors
        let CourseStartData = null;
        let CourseEnd = null;

        if (hasGoogleDrive) {
            const currentDate = new Date();
            CourseStartData = currentDate;
            CourseEnd = new Date(currentDate.setFullYear(currentDate.getFullYear() + 2));
        }

        const newOrder = new OrderModel({
            userId: userId,
            CartItems,
            OrderStatus,
            Address: AddressDetails,
            PhonePeOrderId,
            transactionId,
            CourseExpireData: CourseEnd,
            CourseStartData,
            PhonePePaymentId,
            PaymentDone: true
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order Placed Successfully",
            OrderData: newOrder
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

        const { totalPrice } = req.body.CheckOutData

        const transactionId = crypto.randomBytes(9).toString('hex');
        const merchantUserId = crypto.randomBytes(12).toString('hex');
        const data = {
            merchantId: merchantId,
            merchantTransactionId: transactionId,
            merchantUserId,
            name: "User",
            amount: totalPrice * 100,
            redirectUrl: `${process.env.BACKEND_URL}/api/v1/status/${transactionId}}`,
            redirectMode: 'POST',
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + apiKey;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
        const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
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
        console.log(response.data);
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