const express = require('express');
const router = express.Router();

const options = {
  clientId: process.env.K2_CLIENT_ID,
  clientSecret: process.env.K2_CLIENT_SECRET
};

//Including the kopokopo module
var k2 = require("/home/k2-engineering-01/Desktop/repos/k2_connect_nodejs/index")(options);
var STK = k2.STK;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('stkreceive', res.locals.commonData);
});

router.get('/receive', function(req, res, next){
  res.render('stkreceive', res.locals.commonData)
});



router.post('/receive',function(req, res, next){

  var stkOptions = {
    payment_channel: 'M-PESA',
    till_identifier: process.env.K2_TILL_NUMBER,
    subscriber: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      email: req.body.email
    },
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
    _links: {
      //This is where once the request is completed kopokopo will post the response
      call_back_url: 'http://localhost:8000/stk/requestresponse'
    }
  };
  
  // Send message and capture the response or error
  
  STK.receive(stkOptions)
    .then( response => {     
      return res.render('stkreceive', {message: "STK push request sent successfully payment request url is: "+response.location})
    })
    .catch( error => {
      console.log(error);
    });
})

module.exports = router;