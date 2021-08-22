var express = require('express');
var router = express.Router();
const Inventory = require('../models/inventory');
const User = require('../models/admin');
const LocalStorage = require('node-localstorage').LocalStorage;
const config = require('../config.js');
const jwt = require('jsonwebtoken');
localStorage = new LocalStorage('./scratch');


router.get('/', function (req, res, next) {
  const token = localStorage.getItem('authtoken');
  if (!token) {
    res.redirect('/');
  }
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      res.redirect('/')
    }
    User.findById(decoded.id, { password: 0 }, function (err, user) {
      if (err) { res.redirect('/') }
      if (!user) { res.redirect('/') }
      res.render('addInventory', { user, title: 'Add Inventory', msg: req.query.msg?req.query.msg:''})
    });
  });

});

router.post('/', function (req, res, next) {
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

      const inventoryDao = new Inventory(req.body);
      inventoryDao.save((err, status) => {
        if (!err) {
          //res.redirect("/inventoryList");
          const string = encodeURIComponent('Your Inventory was added in the Inventory list...');
          res.redirect('/inventoryList?msg=' + string);
        }
        else {
          //res.send("<h1>Unable to publish...</h1>");
          const string = encodeURIComponent('Unable to add...');
          res.redirect('/addInventory?msg=' + string);
        }
      })
    });

  });
});

module.exports = router;
