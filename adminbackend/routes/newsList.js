var express = require('express');
var router = express.Router();
const News = require('../models/news');
const User = require('../models/admin');
const LocalStorage = require('node-localstorage').LocalStorage;
const config = require('../config.js');
const jwt = require('jsonwebtoken');
localStorage = new LocalStorage('./scratch');

/* GET home page. */

router.get('/', function(req, res, next) {
  var token = localStorage.getItem('authtoken')
    if (!token) {
        res.redirect('/')
    }
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) {
            res.redirect('/')
        }
        User.findById(decoded.id, { password: 0 }, function (err, user) {
            if (err) { res.redirect('/') }
            if (!user) { res.redirect('/') }
            
            News.find({}, (err, newsData)=>{
              if(!err){
                res.status(200).render('newsList', { title: 'News List', newsData: newsData, user,
                                                      msg: req.query.msg?req.query.msg:''});
              }
              else{
                res.json(err);
              }
            }) 
        });
    });
 
});

router.post('/editNews', function(req, res, next) {

  const token = localStorage.getItem('authtoken');
  if (!token) {
    res.redirect('/');
  }
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      res.redirect('/')
    }
    User.findById(decoded.id, { password: 0 }, (err, user) => {
      if (err) { res.redirect('/') }
      if (!user) { res.redirect('/') }

      News.findOneAndUpdate({_id: req.body._id }, 
        {productName: req.body.productName,
          productCategory: req.body.productCategory,
          manufacturer: req.body.manufacturer,
          productImage: req.body.productImage,
          stock: req.body.stock,
          unitCost: req.body.unitCost,
          dimension: req.body.dimension,
          purchaseOrders: req.body.purchaseOrders,
          nextPurchase: req.body.nextPurchase,
          createdBy: req.body.createdBy},{new: true}, (err, doc) =>{
        if (!err){
          //res.redirect("/newsList");
          const string = encodeURIComponent('News has been Edited');
          res.redirect('/newsList/?msg=' + string);
        }
        else{
          //res.send("<h1>Unable to edit...</h1>");
          const string = encodeURIComponent('Error occured updating news');
          res.redirect('/newsList/?msg=' + string);
        }
      })
    });

  });

 });

 router.post('/deleteNews', function(req, res, next) {
 News.findOneAndDelete({_id: req.body._id }, function (err, docs) {
  if (err){
      res.send("<h1>Unable to delete...</h1>");
  }
  else{
      //res.redirect("/newsList");
      const string = encodeURIComponent('News has been Deleted');
      res.redirect('/newsList/?msg=' + string);
  }
})
});

module.exports = router;