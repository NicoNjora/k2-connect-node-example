const express = require('express');
const router = express.Router();

const options = {
    clientId: process.env.K2_CLIENT_ID,
    clientSecret: process.env.K2_CLIENT_SECRET
};

//Including the kopokopo module
var K2 = require("/home/k2-engineering-01/Desktop/repos/k2_connect_nodejs/index")(options);
var TransferService = K2.TransferService;

//Put in another file and import when needed
var tokens = K2.TokenService;
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

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('transfer', res.locals.commonData);
});

router.post('/', function(req, res, next){
    var transferOpts = {
        amount: {
          currency: 'KES',
          value: req.body.amount
        },
        destination: req.body.destination,
        token_details: token_details
      };

        // Send message and capture the response or error
    TransferService
        .settleFunds(transferOpts)
        .then( response => {     
            return res.render('transfer', {message: "Transfer request sent successfully request url is: " + response})
        })
        .catch( error => {
            console.log(error);
            return res.render('transfer', {message: "Error: " + error})
        });
})

router.get('/status', function(req, res, next){
    TransferService
        .settlementStatus({token_details: token_details})
        .then( response =>{
            return res.render('transferstatus', {message: "Transfer status is: "+response})
        })
        .catch( error => {
            console.log(error);
            return res.render('transferstatus', {message: "Error: " + error})
        });
})

module.exports = router;