var express = require('express');
var router = express.Router();
const News = require('../models/news');
const Contact = require('../models/contact');


router.get('/newsList', function(req, res, next) {
  let numArticles = parseInt(req.query.numArticles);
  if(numArticles){
    News.find({category: "normal"}).sort({'createdOn': -1}).limit(numArticles).exec(function(err,data) {
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

  router.post('/contactus', function(req, res, next) {
    const contactDao = new Contact(req.body);
    contactDao.save((err, status)=>{
      if(!err){
        res.json("We will contact you soon...");
      }
      else{
        res.json("Unable to send...");
      }
    })
   });

   router.get('/sports', function(req, res, next) {
    News.find({category: "sports"}, (err, newsData)=>{
      if(!err){
        res.status(200).json(newsData);
      }
      else{
        res.json(err);
      }
    }) 
    
  });

  module.exports = router;