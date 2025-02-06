require('dotenv').config()
const crypto = require('crypto');
const axios = require('axios');
const merchantId = process.env.PHONEPAY_MERCHANT_ID
const apiKey = process.env.PHONEPAY_API_KEY

exports.createPaymentInstant = async (req, res) => {
    try {
        const { amount } = req.body;
        console.log("amount", amount)
        if (!amount) {
            return res.status(400).json({ success: false, message: 'Please enter amount' })
        }

        const transactionId = crypto.randomBytes(9).toString('hex');
        const merchantUserId = crypto.randomBytes(12).toString('hex');
        const data = {
            merchantId: merchantId,
            merchantTransactionId: transactionId,
            merchantUserId,
            name: "User",
            amount: amount * 100,
            callbackUrl: `https://www.panandacademy.com/payment-failed`,
            // redirectUrl: `https://www.api.panandacademy.com/api/v1/status-payment/${transactionId}`,
            redirectUrl: `https://www.api.panandacademy.com/api/v1/verify-instant-payment/${transactionId}`,
            redirectMode: 'POST',
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };

        const payload = JSON.stringify(data);
        // console.log("payload",payload)
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + apiKey;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;
        const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
        // console.log("Checksum:", checksum);
        // console.log("Payload (Base64):", payloadMain);

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
        // console.log("response", response.data.data.instrumentResponse.redirectInfo.url);
        // console.log("i am response id ", response?.data?.data?.merchantTransactionId);
        // console.log("i am response ", response);
        res.status(201).json({
            success: true,
            url: response.data.data.instrumentResponse.redirectInfo.url
        })

    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.verifyInstantPayment = async (req, res) => {
    try {
        const { merchantTransactionId } = req.params;
        // console.log("merchantTransactionId",merchantTransactionId)

        if (!merchantTransactionId) {
            return res.status(400).json({ success: false, message: "Merchant transaction ID not provided" });
        }

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
        console.log("daata",data)

        if (data.success === true) {

            const successRedirect = `https://panandacademy.com/payment-done`;
            return res.redirect(successRedirect);
        } else {
            const failureRedirect = `https://panandacademy.com/payment-failed`;
            return res.redirect(failureRedirect);
        }

    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}