const express = require('express');
const router = express.Router();

const options = {
    clientId: process.env.K2_CLIENT_ID,
    clientSecret: process.env.K2_CLIENT_SECRET
};

//Including the kopokopo module
var k2 = require("/home/k2-engineering-01/Desktop/repos/k2_connect_nodejs/index")(options);
var Webhooks = k2.Webhooks;
var resource;
var token_details;

router.post('/', function(req, res, next){
    resource = Webhooks.buygoodsReceived(req,res);
})

router.get('/resource', function(req, res, next) {

    if (resource != null){
      res.render('resource', {origination_time: resource._origination_time, 
                              sender_msisdn: resource._sender_msisdn,
                              amount: resource._amount,
                              currency: resource._currency,
                              till_number: resource._till_number,
                              name: resource.name,
                              status: resource.status,
                              system: resource.system
                              } );
    }else{
      console.log("Resource not yet created")
      res.render('resource', {error: "Resource not yet created"} );
    }  
});

router.get('/subscribe',function(req, res, next) {
    res.render('subscribe', res.locals.commonData);
});
  
router.post('/subscribe', function(req, res, next){

    const subscribeOptions = {
        event_type: req.body.event_type,
        url: req.body.url,
        webhook_secret: process.env.BUYGOODS_WEBHOOK_SECRET,
        token_details: token_details
    }

    // Send message and capture the response or error
    Webhooks.subscribe(subscribeOptions)
        .then( response => {
            console.log(response);
            return res.render('subscribe', {message: "Subscribe successful"})
        })
        .catch( error => {
            console.log(error);
        });
      
})
  

module.exports = router;
