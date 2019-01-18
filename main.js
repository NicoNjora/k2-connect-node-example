const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 8000

//Including the kopokopo module
var k2 = require("/home/k2-engineering-01/kopokopo_nodejs/index");

//ApiKey
const apiKey = '10af7ad062a21d9c841877f87b7dec3dbe51aeb3';

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
) 

app.post('/webhook', k2.queries.buygoodsReceived)

app.listen(port, () => {
   console.log(`App running on port ${port}.`)
})
