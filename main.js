const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 8000

//ApiKey
const options =  '10af7ad062a21d9c841877f87b7dec3dbe51aeb3';

//Including the kopokopo module
var k2 = require("/home/k2-engineering-01/kopokopo_nodejs/index")(options);



app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
) 

webhooks = k2.webhooks;

app.post('/webhook', webhooks.buygoodsReceived)



// var options = {
//   host: "developer.api.autodesk.com",
//   path: "/oss/v1/buckets",
//   method: "POST",
//   headers: {
//       "Content-Type": "application/json",
//       "Authorization": "Bearer token"
//   }
// };

// var req = http.request(options, function (res) {
//   var responseString = "";

//   res.on("data", function (data) {
//       responseString += data;
//       // save all the data from response
//   });
//   res.on("end", function () {
//       console.log(responseString); 
//       // print to console when response ends
//   });
// });

// var reqBody = "sometext";
// req.write(reqBody);

// req.end();


// app.get('/resource', k2.Resource.sayHello())

// console.log(k2.Resource.reference);

app.listen(port, () => {
   console.log(`App running on port ${port}.`)
})
