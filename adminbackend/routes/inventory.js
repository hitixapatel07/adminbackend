var express = require('express');
var router = express.Router();
const Inventory = require('../models/inventory');


router.get('/inventoryList', function(req, res, next) {
  let numInventory = parseInt(req.query.numInventory);
  if(numInventory){
    Inventory.find({category: "normal"}).sort({'createdOn': -1}).limit(numInventory).exec(function(err,data) {
      if(!err){
          res.status(200).json(data)
      } else {
          res.json(err)
          
      }
  });

  } else {
    Inventory.find({}).sort({'createdOn': -1}).exec((err, inventoryData)=>{
      if(!err){
        res.status(200).json(inventoryData);
      }
      else{
        res.json(err);
      }
    }) 
  }
    
  });

  module.exports = router;