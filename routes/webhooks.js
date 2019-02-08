const express = require('express');
const router = express.Router();

const options = {
    clientId: process.env.K2_CLIENT_ID,
    clientSecret: process.env.K2_CLIENT_SECRET
};

//Including the kopokopo module
var k2 = require("/home/k2-engineering-01/Desktop/repos/k2_connect_nodejs/index")(options);
var Webhooks = k2.Webhooks;
var tokens = k2.TokenService;
var buyGoodsResource;
var customerResource;
var reversalResource;
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


router.post('/', function(req, res, next){
    // resource = Webhooks.buygoodsReceived(req,res);

    // Send message and capture the response or error
    Webhooks
        .webhookHandler(req, res)
        .then( response => {
            buyGoodsResource = response
        })
        .catch( error => {
            console.log(error);
        });
})

router.post('/customercreated', function(req, res, next){  
    // Send message and capture the response or error
    Webhooks
        .webhookHandler(req, res)
        .then( response => {
            customerResource = response
        })
        .catch( error => {
            console.log(error);
        });
})

router.post('/transactionreversed', function(req, res, next){  
    // Send message and capture the response or error
    Webhooks
        .webhookHandler(req, res)
        .then( response => {
            reversalResource = response
        })
        .catch( error => {
            console.log(error);
        });
})

router.get('/customerresource', function(req, res, next) {

    let resource =  customerResource;

    if (resource != null){
      res.render('customerresource', {sender_msisdn: resource.msisdn,
                                    name: resource.first_name
                                    } );
    }else{
      console.log("Resource not yet created")
      res.render('customerresource', {error: "Resource not yet created"} );
    }  
});

router.get('/reversalresource', function(req, res, next) {

    let resource =  reversalResource;

    if (resource != null){
      res.render('reversalresource', {  origination_time: resource.origination_time, 
                                        sender_msisdn: resource.sender_msisdn,
                                        amount: resource.amount,
                                        currency: resource.currency,
                                        till_number: resource.till_number,
                                        name: resource.sender_first_name,
                                        status: resource.status,
                                        system: resource.system
                                        });
    }else{
      console.log("Resource not yet created")
      res.render('reversalresource', {error: "Resource not yet created"} );
    }  
});

router.get('/resource', function(req, res, next) {
    let resource =  buyGoodsResource;

    if (resource != null){
      res.render('resource', {origination_time: resource.origination_time, 
                              sender_msisdn: resource.sender_msisdn,
                              amount: resource.amount,
                              currency: resource.currency,
                              till_number: resource.till_number,
                              name: resource.sender_first_name,
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
    console.log("I am token details access token: "+ token_details.access_token)

    // Send message and capture the response or error
    Webhooks
        .subscribe(subscribeOptions)
        .then( response => {
            console.log(response);
            return res.render('subscribe', {message: "Subscribe successful resource id is: "+response.resourceId})
        })
        .catch( error => {
            console.log(error);
            return res.render('subscribe', {message: error.error.message})
        });
      
})
  

module.exports = router;
