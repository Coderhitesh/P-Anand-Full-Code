const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    CartItems: [

        {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    ],

    Address: {
        streetAddress: { type: String },
        houseNumber: { type: String },
        pincode: { type: String },
        landmark: { type: String },
        addressType: {
            type: String,
            enum: ['Home', 'Work', 'Other'],
            default: 'Home'
        },
        confirm: { type: Boolean },
        City:{type:String},
        State:{type:String}
    },
    OrderStatus: {
        type: String,
        enum: ["Pending", 'Order-Packed', 'Ready To Ship', 'Dispatch', 'Delivered', 'Cancelled'],
        default:'Pending'
    },
    CourseStartData: {
        type: Date,
    },

    CourseExpireData: {
        type: Date,
    },
    totalPrice:{type:Number},
    PhonePeOrderId: { type: String, },
    PhonePePaymentId: { type: String, },
    transactionId: { type: String },
    PaymentDone: { type: Boolean, default: false },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
