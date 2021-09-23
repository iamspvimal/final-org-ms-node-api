var express=require("express");
var app=express();
var parser=require('body-parser');
var path=require("path");

//var sendMessage = require('./queueservice/queueservice')

var uroutes=require("./routes/userroutes");
var products=require("./routes/productroutes");
var orders=require("./routes/orderroutes");
var messages =require("./routes/messageroutes");
var passport = require('passport');
var cors = require('cors');
//import ky from "ky-universal";



app.use(cors())

app.use(parser.json());

var mongoose = require('mongoose');
mongoose.set('debug', true);
//mongoose.connect('mongodb://localhost:27017/organic');
let uri = 'mongodb://mongodbfinal0921:ySoyDIm29tC3ksbqSHzKTuLTBGMeXvbDzlJDEyV7uthQUCgyEBrROwzDs6AqxG8jLzyiosOg47ViR7TUPeVdMg==@mongodbfinal0921.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@mongodbfinal0921@';
//{dbName: "organic"},
//{ useNewUrlParser: true },
mongoose.connect(uri, { useNewUrlParser: true, dbName: 'organic' }, (err, db) => {
  if(err)
    { return null; } 
 });

  //ENV test
  // console.log("AZURE_STORAGE_CONNECTION_STRING");
  // console.log(process.env.AZURE_STORAGE_CONNECTION_STRING);
  // sendMessage('mystoragequeue',"AZURE_STORAGE_CONNECTION_STRING");
  // console.log("Q-message sent..")

var db = mongoose.connection;
app.get("/images/:imagename",function(request,response){
   let imagename = request.params.imagename;     
   response.sendFile(path.join(__dirname,"static-files/"+ imagename))
})

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("mongo db connection is open");
  db.db.collection("products", function(err, collection)
  {
      // total product count..
      //const itemCount = collection.find({}).toArray();
      //console.log(collection.find({}).toArray());

      // //view json data..
      collection.find({}).toArray(function(err, data)
      {
          //console.log(data); // it will print your collection data
      })
  });

});



/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
  next();
});
*/

app.use(passport.initialize());
app.use("/users",uroutes);
app.use("/products",products);
app.use("/orders",orders);
app.use("/messages",messages);
app.listen(4500,function(){
    console.log("App is running in port number 4500 CFS final");

});