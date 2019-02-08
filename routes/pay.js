const express = require('express');
const router = express.Router();

const options = {
    clientId: process.env.K2_CLIENT_ID,
    clientSecret: process.env.K2_CLIENT_SECRET
};

//Including the kopokopo module
var k2 = require("/home/k2-engineering-01/Desktop/repos/k2_connect_nodejs/index")(options);
var PayService = k2.PayService;

//Put in another file and import when needed
var tokens = k2.TokenService;
var token_details;
tokens
    .getTokens()
    .then(response => {
        //Developer can decide to store the token_details and track expiry
        token_details = response;
    })
    .catch( error => {
        console.log(error);
    }); 

router.get('/', function(req, res, next) {
    res.render('pay', res.locals.commonData);
});

router.post('/',function(req, res, next){
    var payOpts = {
        destination: req.body.destination,
        amount: {
          currency: 'KES',
          value: req.body.amount
        },
        metadata: {
          customer_id: '8675309',
          notes: 'Salary payment for May 2018'
        },
        callback_url: 'https://your-call-bak.yourapplication.com/payment_result',   
        token_details: token_details
      };

      // Send message and capture the response or error
    PayService
    .sendPay(payOpts)
    .then( response => {     
        return res.render('pay', {message: "Pay recipients request sent successfully request url is: " + response})
    })
    .catch( error => {
        console.log(error);
        return res.render('pay', {message: "Error: " + error})
    });
      
})

router.get('/recipients', function(req, res, next) {
    res.render('payrecipient', res.locals.commonData);
});

router.post('/recipients', function(req, res, next){
    var recipientOpts = {
        type: 'mobile_wallet',
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        network: 'Safaricom',
        token_details: token_details
    };

    // Send message and capture the response or error
    PayService
    .addPayRecipient(recipientOpts)
    .then( response => {     
        return res.render('payrecipient', {message: "Pay recipients request sent successfully request url is: " + response})
    })
    .catch( error => {
        console.log(error);
        return res.render('payrecipient', {message: "Error: " + error})
    });
})

router.get('/status', function(req, res, next){
    PayService
        .payStatus({token_details: token_details})
        .then( response =>{
            return res.render('paystatus', {message: "Pay status is: "+response})
        })
        .catch( error => {
            console.log(error);
            return res.render('paystatus', {message: "Error: " + error})
        });
})

module.exports = router;