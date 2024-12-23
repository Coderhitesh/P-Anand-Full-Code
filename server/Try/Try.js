require('dotenv').config()
const crypto = require('crypto');
const axios = require('axios');
const merchantId = process.env.PHONEPAY_MERCHANT_ID || 'M22FUH75NPY7Y'
const apiKey = process.env.PHONEPAY_API_KEY || '10168ec1-1469-426f-b589-40378ab18505'

exports.createCheckOutFunction = async (req, res) => {
    try {
        const transactionId = crypto.randomBytes(9).toString('hex');
        const merchantUserId = crypto.randomBytes(12).toString('hex');
        console.log("merchantUserId", merchantUserId)
        const data = {
            merchantId: merchantId,
            merchantTransactionId: transactionId,
            merchantUserId,
            name: "User",
            amount: 50000,
            redirectUrl: `https://www.api.panandacademy.com/api/v1/status-payment/${transactionId}}`,
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


        }

        const response = await axios.request(options);
        res.status(201).json({
            success: true,
            url: response.data.data.instrumentResponse
        })


    }
    catch (error) {
        console.log(error)
    }
}