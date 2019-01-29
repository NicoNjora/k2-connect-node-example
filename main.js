"use strict";

const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 8000

require('dotenv').load();

//api key is secret

const options = {
  apiKey: process.env.K2_API_KEY,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

//Including the kopokopo module
var k2 = require("/home/k2-engineering-01/Desktop/repos/k2_connect_nodejs/index")(options);

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
) 

app.set('view engine', 'jade');

var Webhooks = k2.Webhooks;
var resource;

app.post('/webhook', function(req, res, next){
  resource = Webhooks.buygoodsReceived(req,res);
})

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', res.locals.commonData);
});

/* GET resource page. */
app.get('/getresource', function(req, res, next) {

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

// Use the service
const subscribeOptions = {
  event_type: "buygooods_transaction_received",
  url: "http://localhost/webhook"
}

// Send message and capture the response or error
Webhooks.subscribe(subscribeOptions)
        .then( response => {
            console.log(response);
        })
        .catch( error => {
            console.log(error);
        });


app.listen(port, () => {
   console.log(`App running on port ${port}.`)
})
