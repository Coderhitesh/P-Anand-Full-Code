const express = require('express')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 9123;
const cors = require('cors')
const ConnectDB = require('./Config/DataBase');
const cookieParser = require('cookie-parser')
const Router = require('./Routes/Routes')
const path = require('path')
const { rateLimit } = require('express-rate-limit')
// Middlewares
ConnectDB()
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    limit: 200,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: "Too many Request",
    statusCode: 429,
    handler: async (req, res, next) => {
        try {
            next()
        } catch (error) {
            res.status(options.statusCode).send(options.message)
        }
    }

})


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// All other routes should serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../client/build/index.html'));
});

// app.use('./public/artits',express.static('files'))
// app.use('/files',express.static(path.join(__dirname,'artits')))
app.set(express.static('public'))
app.use('/public',express.static('public'))

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: [
        'https://www.panandacademy.com',
        'https://www.admin.panandacademy.com',
        'https://admin.panandacademy.com',
        'https://panandacademy.com',
        'http://localhost:3000',
        'http://localhost:3001' ,
        'http://localhost:5173'

    ],
    credentials: true 
};

app.use(cors(corsOptions));

app.use(limiter)
app.use('/api/v1', Router)

app.get('/', (req, res) => {
    res.send('Welcome To P Anand Server')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

