const express = require('express');
const router = express.Router();

var stkResource;

const options = {
  clientId: process.env.K2_CLIENT_ID,
  clientSecret: process.env.K2_CLIENT_SECRET
};

//Including the kopokopo module
var k2 = require("/home/k2-engineering-01/Desktop/repos/k2_connect_nodejs/index")(options);
var StkService = k2.StkService;
var Webhooks = k2.Webhooks;

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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('stkrequest', res.locals.commonData);
});

router.post('/result', function(req, res, next){  
  // Send message and capture the response or error
  Webhooks
      .webhookHandler(req, res)
      .then( response => {
        stkResource = response
      })
      .catch( error => {
          console.log(error);
      });
})

router.get('/result', function(req, res, next) {
  let resource =  stkResource;

  if (resource != null){
    res.render('stkresult', {origination_time: resource.origination_time, 
                            sender_msisdn: resource.sender_msisdn,
                            amount: resource.amount,
                            currency: resource.currency,
                            till_number: resource.till_number,
                            name: resource.sender_first_name,
                            status: resource.status,
                            system: resource.system
                            } );
  }else{
    console.log("STK push result not yet posted")
    res.render('stkresult', {error: "STK push result not yet posted"} );
  }  
});

router.post('/receive',function(req, res, next){

  var stkOptions = {
    till_identifier: process.env.K2_TILL_NUMBER,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    phone: req.body.phone,
    email: req.body.email,
    amount: {
      currency: 'KES',
      value: req.body.amount 
    },
    //A maximum of 5 key value pairs
    metadata: {
      customer_id: '123456789',
      reference: '123456',
      notes: 'Payment for invoice 123456'
    },
      //This is where once the request is completed kopokopo will post the response
    call_back_url: 'http://localhost:8000/stk/requestresponse', 

    token_details: token_details
  };
  console.log(token_details)
  
  // Send message and capture the response or error
  StkService
    .paymentRequest(stkOptions)
    .then( response => {     
      return res.render('stkrequest', {message: "STK push request sent successfully payment request url is: " + response})
    })
    .catch( error => {
      console.log(error);
      return res.render('stkrequest', {message: "Error " + error})

    });
})

router.get('/status', function(req, res, next){
  StkService
      .paymentRequestStatus({token_details: token_details})
      .then( response =>{
          return res.render('stkstatus', {message: "STK status is: "+response})
      })
      .catch( error => {
          console.log(error);
          return res.render('stkstatus', {message: "Error: " + error})
      });
})

module.exports = router;