const express = require('express');
const router = express.Router();

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

const app = express();

const bodyParser = require('body-parser'); // For parsing form
const jwt = require('jsonwebtoken'); // For generating token
const bcrypt = require('bcryptjs'); // For encrypting Password
const config = require('../config/config.js'); // For Secert Token

// For the Schema 
const User = require('../models/admin');
const Newslist = require('../models/news')

const session = require('express-session');

router.use(session({ secret: 'newsSecretKey', resave: false, saveUninitialized: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', './views');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Register User
router.post('/register', function (req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) {
            const hashedPassword = bcrypt.hashSync(req.body.password, 8); //add new user
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            },
            function (err, user) {
                if (err) return res.status(500).send("There was a problem registering the user.")
                    // create a token
                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                const string = encodeURIComponent('Success Fully Registered. Please Login');
                res.redirect('/?msg=' + string);
            });
        } else { //duplicate
            const string = encodeURIComponent('Email is already registered, please login or register using different email.');
            res.redirect('/register?valid=' + string);
        }
    });
});

// Login User
router.post('/login', function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) {
            const string = encodeURIComponent('Invalid authentication credentials! Try again');
            res.redirect('/?valid=' + string);
        }else {
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                const string = encodeURIComponent('Invalid authentication credentials! Try again');
                res.redirect('/?valid=' + string);
            }else {
                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                localStorage.setItem('authtoken', token);
                res.redirect(`/newsList`);
            }
        }
    });
});


router.get('/logout', (req, res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/');
});

module.exports = router