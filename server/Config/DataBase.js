const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const MONGO_LINK = process.env.MONGO_LINK;

        if (!MONGO_LINK) {
            throw new Error('MONGO_LINK not defined in environment variables');
        }

        await mongoose.connect(MONGO_LINK, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1); // Exit the process to avoid continuing with a broken DB connection
    }
};

module.exports = connectDB;
