const Cart = require('../Models/temprarycart.model');

// Function to add a product to the cart
exports.AddProductIncart = async (req, res) => {
    try {
        const {
            productName,
            productPrice,
            productCategory,
            productSubCategory,
            productHsnCode,
            productImage,
            productType,
            productId,
            productLearningMode,
            quantity,
            totalPrice,
            selectedMode,
            discount,
            bundleBookId,
            userLoginWhenAdd,
            sessionId,
            addedBy
        } = req.body;
        console.log(req.body)
        // Validate required fields
        if (!productName || !totalPrice || !productPrice || !productCategory || !productImage || !productType || !productId || !productLearningMode || !quantity) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Validate data types and constraints
        if (typeof productPrice !== 'number' || productPrice < 0) {
            return res.status(400).json({ message: 'Product price must be a non-negative number.' });
        }

        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1.' });
        }

        if (totalPrice && (typeof totalPrice !== 'number' || totalPrice < 0)) {
            return res.status(400).json({ message: 'Total price must be a non-negative number.' });
        }

        if (discount && (typeof discount !== 'number' || discount < 0)) {
            return res.status(400).json({ message: 'Discount must be a non-negative number.' });
        }

        const isLogin = false /* your logic to determine if the user is logged in */;
        const query = {
            productId,
            ...(isLogin ? { addedBy } : { sessionId })
        };

        const existingCartItem = await Cart.findOne(query);

        if (existingCartItem) {
            // If the product already exists, update the quantity and recalculate the total price
            existingCartItem.quantity += quantity;
            existingCartItem.totalPrice = existingCartItem.productPrice * existingCartItem.quantity - (existingCartItem.discount || 0);
            await existingCartItem.save();
            return res.status(200).json({ message: 'Product quantity updated in cart', cart: existingCartItem });
        } else {
            // If the product does not exist in the cart, create a new entry
            const newCartItem = new Cart({
                productName,
                productPrice,
                productCategory,
                productSubCategory,
                productHsnCode,
                productImage,
                productType,
                bundleBookId,
                selectedMode,
                productId,
                productLearningMode,
                quantity,
                totalPrice: totalPrice || productPrice * quantity - (discount || 0),
                discount,
                userLoginWhenAdd,
                sessionId,
                addedBy
            });

            await newCartItem.save();
            console.log(newCartItem)
            return res.status(201).json({ message: 'Product added to cart', cart: newCartItem });
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.increaseQuantity = async (req, res) => {
    try {
        const { productId, sessionId, newQuantity } = req.body;

        // Validate required fields
        if (!productId || !sessionId) {
            return res.status(400).json({ message: 'Product ID and Session ID are required.' });
        }

        // Validate quantity
        if (typeof newQuantity !== 'number' || newQuantity < 1) {
            return res.status(400).json({ message: 'Quantity must be a positive number.' });
        }

        // Find the cart item by productId and sessionId
        const cartItem = await Cart.findOne({ productId, sessionId });

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in the cart.' });
        }

        // Update the quantity and recalculate the total price
        cartItem.quantity += newQuantity;
        cartItem.totalPrice = cartItem.productPrice * cartItem.quantity - (cartItem.discount || 0);

        await cartItem.save();

        res.status(200).json({ message: 'Product quantity updated successfully.', cart: cartItem });

    } catch (error) {
        console.error('Error updating product quantity:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.decreaseQuantity = async (req, res) => {
    try {
        const { productId, sessionId, newQuantity } = req.body;

        // Validate required fields
        if (!productId || !sessionId) {
            return res.status(400).json({ message: 'Product ID and Session ID are required.' });
        }

        // Validate quantity
        if (typeof newQuantity !== 'number' || newQuantity < 1) {
            return res.status(400).json({ message: 'Quantity must be a positive number.' });
        }

        // Find the cart item by productId and sessionId
        const cartItem = await Cart.findOne({ productId, sessionId });

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in the cart.' });
        }

        // Update the quantity
        cartItem.quantity -= newQuantity;

        // Check if the quantity is zero or negative, remove the item
        if (cartItem.quantity <= 0) {
            await cartItem.deleteOne();
            return res.status(200).json({ message: 'Product removed from the cart.' });
        }

        // Recalculate the total price
        cartItem.totalPrice = cartItem.productPrice * cartItem.quantity - (cartItem.discount || 0);

        await cartItem.save();

        res.status(200).json({ message: 'Product quantity updated successfully.', cart: cartItem });

    } catch (error) {
        console.error('Error updating product quantity:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.removeProductFromCart = async (req, res) => {
    try {
        const { productId, sessionId } = req.body;

        // Validate required fields
        if (!productId || !sessionId) {
            return res.status(400).json({ message: 'Product ID and Session ID are required.' });
        }

        // Remove the product from the cart
        const removedProduct = await Cart.findOneAndDelete({ productId, sessionId });

        if (!removedProduct) {
            return res.status(404).json({ message: 'Product not found in the cart.' });
        }

        // Fetch the remaining cart items
        const cartItems = await Cart.find({ sessionId });

        res.status(200).json({
            message: 'Product removed from the cart successfully.',
            cart: cartItems
        });

    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};


exports.GetAllProductCart = async (req, res) => {
    try {
        const allCartItems = await Cart.find({});

        if (!allCartItems.length) {
            return res.status(404).json({ message: 'No products found in the cart.' });
        }

        res.status(200).json({ message: 'Products retrieved successfully.', cart: allCartItems });

    } catch (error) {
        console.error('Error retrieving all products in cart:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.GetAllBySessionIdProductCart = async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required.' });
        }

        const cartItemsBySession = await Cart.find({ sessionId });

        if (!cartItemsBySession.length) {
            return res.status(404).json({ message: 'No products found for this session ID in the cart.' });
        }

        res.status(200).json({ message: 'Products retrieved successfully for session ID.', cart: cartItemsBySession });

    } catch (error) {
        console.error('Error retrieving products by session ID:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.GetAllByUserIdProductCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const cartItemsByUser = await Cart.find({ addedBy: userId });

        if (!cartItemsByUser.length) {
            return res.status(404).json({ message: 'No products found for this user in the cart.' });
        }

        res.status(200).json({ message: 'Products retrieved successfully for user.', cart: cartItemsByUser });

    } catch (error) {
        console.error('Error retrieving products by user ID:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


exports.deleteBySessionId = async (req, res) => {
    try {
      const { session } = req.body;
  console.log(session)
      if (!session) {
        return res.status(400).json({
          success: false,
          message: 'Session ID is required',
        });
      }
  
      const deletedCart = await Cart.findOneAndDelete({ sessionId:session });
  
      if (!deletedCart) {
        return res.status(404).json({
          success: false,
          message: 'No cart items found for the given session ID',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Cart items deleted successfully',
        deletedCart,
      });
    } catch (error) {
      // Handle any errors during the process
      res.status(500).json({
        success: false,
        message: 'An error occurred while deleting cart items',
        error: error.message,
      });
    }
  };
  