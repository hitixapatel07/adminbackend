var express = require('express');
var router = express.Router();
const News = require('../models/inventory');


router.get('/inventoryList', function(req, res, next) {
  let numInventory = parseInt(req.query.numInventory);
  if(numInventory){
    News.find({category: "normal"}).sort({'createdOn': -1}).limit(numInventory).exec(function(err,data) {
      if(!err){
          res.status(200).json(data)
      } else {
          res.json(err)
          
      }
  });

  } else {
    News.find({}).sort({'createdOn': -1}).exec((err, newsData)=>{
      if(!err){
        res.status(200).json(newsData);
      }
      else{
        res.json(err);
      }
    }) 
  }
    
  });

  module.exports = router;