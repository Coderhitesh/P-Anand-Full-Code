const mongoose = require('mongoose');

const tempCartSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true, // Removes whitespace from both ends
    },
    productPrice: {
      type: Number,
      required: true,
      min: 0, // Ensure price cannot be negative
    },
    productCategory: {
      type: String,
      required: true,
      trim: true,
    },
    productSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Assuming there is a User model
    },
    productHsnCode: {
      type: String,
      trim: true,
    },
    productImage: {
      type: String,
      required: true,
      trim: true,
    },
    bundleBookId: [String],
    productType: {
      type: String,
      required: true,
      enum: ['BookBundle', 'Book', 'Course', 'Bundle', 'Book-Bundle', 'Course-Bundle'], // Restrict to specific types if applicable
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'productType', // Dynamic referencing based on productType
      required: true,
    },
    productLearningMode: {
      type: String,
      enum: ['Live', 'Offline', 'Pendrive', 'Google Drive', 'Pdf', 'Delivery', 'mode-selected'], // Limit to specific learning modes
    },
    selectedMode: {
      name: {
        type: String,
      },
      id: {
        type: String,
      }
    },
    quantity: {
      type: Number,
      required: true,
      min: 1, // Ensure quantity is at least 1
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0, // Ensure total price cannot be negative
    },
    discount: {
      type: Number,
      default: 0,
      min: 0, // Ensure discount cannot be negative
    },
    tax: {
      type: Number,
      default: 0,
      min: 0, // Ensure tax cannot be negative
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['USD', 'EUR', 'INR', 'GBP', 'AUD'], // Include only valid currencies
    },
    userLoginWhenAdd: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming there is a User model
      required: function () {
        // Make `addedBy` required only if `sessionId` is not provided
        return !this.sessionId;
      },
    },
    sessionId: {
      type: String,
      required: function () {
        // Make `sessionId` required only if `addedBy` is not provided
        return !this.addedBy;
      },
      trim: true,
      index: true, // Index `sessionId` for better query performance
    },
  },
  {
    timestamps: true
  }
);

// Add indexes for frequently queried fields
tempCartSchema.index({ productId: 1 });
tempCartSchema.index({ userLoginWhenAdd: 1 });

// Add a pre-save hook to automatically calculate the total price if not provided
tempCartSchema.pre('save', function (next) {
  if (!this.totalPrice) {
    this.totalPrice = this.productPrice * this.quantity;
  }
  next();
});

const TempCart = mongoose.model('TempCart', tempCartSchema);

module.exports = TempCart;
