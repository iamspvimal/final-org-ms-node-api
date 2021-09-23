var express = require('express');
var path =require ('path');
var router = express.Router();
var  products = require("../mongodb/schemas/products");
const axios = require('axios');
//var fs = require("fs");
const multer  = require('multer')
//var upload = multer({ dest: path.join(__dirname,"../static-files")})

// , inMemoryStorage = multer.memoryStorage()
// , uploadStrategy = multer({ storage: inMemoryStorage }).single('imagename')

// , azureStorage = require('azure-storage')
// //, getStream = require('into-stream')
// , containerName = 'image-container'
// , config = require('../config/config')
// , blobService = azureStorage.createBlobService(config.getStorageAccountName);
// //const getStream = require('stream');



//const { api_helper } = require('../azurefunction/apifunservice');
//var request_api = require('request');
//const https = require('https');


// //const module = require('module');
// module.Module._extensions['.js'] = function(module, filename) {
//   const content = fs.readFileSync(filename, 'utf8');
//   module._compile(content, filename);
// };


// const getBlobName = originalName => {
//    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
//    return `${identifier}-${originalName}`;
// };

// const handleError = (err, res) => {
//    res.status(500);
//    res.render('error', { error: err });
// };

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,"../static-files"))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname )
    }
  })
   
var upload = multer({ storage: storage })

router.get("/all",function(request,response){
    products.find({},{_id:0},function(err,data){
        if(err)
           response.status(500);
        else
           response.json(data);
    })
})


router.get("/all/:pattern",function(request,response){
    let pattern=request.params.pattern;
    products.find({type:pattern},{_id:0},function(err,data){
        if(err)
           response.sendStatus(500);
        else
           response.json(data);
     });
 })

 router.post("/all",function(request,response){
    console.log(request.body)
    //sendHttpTriggrtfun()

    products.insertMany(request.body,function(err,data){
        if(err)
           response.sendStatus(500);
        else{
            console.log(data)
           response.json({status:"Success"});
        }
     });
 })

 //uploadStrategy
 //router.post('/add', upload.single('imagename'), function (req, res, next)
 router.post('/add', upload.single('imagename'), function (req, res, next) {
  // req.file is tupdahe `avatar` file
  // req.body will hold the text fields, if there were any
  //var funUrl = "https://org-product-funapp.azurewebsites.net/api/ProductHttpTrigger?code=Enq51acwSWFbbJHS6MZ/BQ4dWxnD0HHf5PnVWdTiGCHVBufgkGdI7g==";
  console.log(req.file)
  
//   const
//    blobName = getBlobName(req.file.originalname)
//    , stream = getStream(req.file.buffer)
//    , streamLength = req.file.buffer.length;

//    blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, err => {
//       if(err) {
//           handleError(err);
//           return;
//       }

//       res.render('success', { 
//           message: 'File uploaded to Azure Blob storage.' 
//       });
//   });

  try{
         let obj ={id: Math.random()*10000, name: req.body.name, 
               type:req.body.type,description:req.body.description,
               qty:req.body.qty,image:req.file.originalname,price:req.body.price}   
            
            //image:req.file.originalname
            //call azure http-trigger function to insert product data into mongo db
            // axios.post(funUrl, obj)
            //    .then((res1) => {
            //       console.log('Status:',res1.status);
            //       console.log('Body: ', res1.data);
            //       res.json({status:"Success"});
            //    }).catch((err) => {
            //       console.error(err);
            //       res.sendStatus(500);
            // });
        
         // api_helper.make_API_call(funUrl,obj).then(response => {
         //    res.json(response)
         // }).catch(error => {
         //    res.send(error)
         // })

            products.insertMany(obj,function(err,data){
                if(err)
                   res.sendStatus(500);
                else{
                    console.log(data)
                   res.json({status:"Success"});
                }
             });
      
     }
     catch(e){
          console.log(e)
         res.status(500)
     }
})


router.post('/update', upload.single('imagename'), function (req, res, next) {
   // req.file is the `avatar` file
   // req.body will hold the text fields, if there were any
   console.log(req.file)
      try{
         let obj ={ name: req.body.name, 
             type:req.body.type,description:req.body.description,
             qty:req.body.qty,price:req.body.price}  
             console.log(req.file)
             console.log(obj)
             console.log(req.body.id)
             console.log(obj.id)
             if(req.file!=undefined)
             obj={...obj,image: req.file.originalname}
             console.log(obj)
             products.updateMany({id:req.body.id},obj,function(err,data){
                 if(err)
                    res.sendStatus(500);
                 else{
                     console.log(data)
                    res.json({status:"Success"});
                 }
              });
       
      }
      catch(e){
           console.log(e)
          res.status(500)
      }
 })

 router.delete('/remove/:id', function (req, res, next) {
   // req.file is the `avatar` file
   // req.body will hold the text fields, if there were any
  
      try{
             console.log({id:req.params.id})
             products.deleteOne({id:req.params.id},function(err,data){
                 if(err)
                    res.sendStatus(500);
                 else{
                     console.log(data)
                    res.json({status:"Success"});
                 }
              });
       
      }
      catch(e){
           console.log(e)
          res.status(500)
      }
 })
 

module.exports =router;

