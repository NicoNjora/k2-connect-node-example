"use strict";

const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 8000

require('dotenv').load();

//ApiKey
const options =  process.env.K2_API_KEY;

//Including the kopokopo module
var k2 = require("/home/k2-engineering-01/Desktop/repos/k2_connect_nodejs/index")(options);

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
) 

app.set('view engine', 'jade');

var webhooks = k2.webhooks;
var resource;

app.post('/webhook', function(req, res, next){
  resource = webhooks.buygoodsReceived(req,res);
})

  /* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', res.locals.commonData);
});

/* GET resource page. */
app.get('/getresource', function(req, res, next) {

  if (resource != null){
    res.render('resource', {param1: resource.name} );
  }else{
    console.log("Resource not yet created")
    res.render('resource', {param1: "Resource not yet created"} );
  }  
});

app.listen(port, () => {
   console.log(`App running on port ${port}.`)
})
