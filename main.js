"use strict";

const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 8000

require('dotenv').load();

// routes
const indexRoutes = require('./routes/index');
const webhooksRoutes = require('./routes/webhooks');
const stkRoutes = require('./routes/stk');

// //api key is secret

// const options = {
//   clientId: process.env.K2_CLIENT_ID,
//   clientSecret: process.env.K2_CLIENT_SECRET
// };

// //Including the kopokopo module
// var k2 = require("/home/k2-engineering-01/Desktop/repos/k2_connect_nodejs/index")(options);

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
) 

app.set('view engine', 'jade');

app.use('/', indexRoutes);
app.use('/webhook', webhooksRoutes);
app.use('/stk', stkRoutes);

app.listen(port, () => {
   console.log(`App running on port ${port}.`)
})
