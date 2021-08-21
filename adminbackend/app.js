var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const authRouter = require('./routes/auth');
//const userRoutes = require('./routes/users');


var newsListRouter = require('./routes/newsList');
var addNewsRouter = require('./routes/addNews')
var newsRouter =require('./routes/news')

const port = 3000;
var http = require('http').createServer(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  
  }
});

var cors = require('cors')

app.use(cors())


// Middleware used to parse the request data
const bodyParser = require('body-parser');
// Middleware for application/json
app.use(bodyParser.json());

const session = require('express-session')
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for application/json
app.use(bodyParser.json());

// Middleware for URL encoded
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);

//app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/newsList', newsListRouter);
app.use('/addNews', addNewsRouter);
app.use('/api', newsRouter);

let sess;

app.get('/', (req, res) => {
  sess = req.session;
  sess.email = " ";
  res.render('index', {
    error: req.query.valid ? req.query.valid : '',
    msg: req.query.msg ? req.query.msg : ''
  });
});

app.get('/register', (req, res) => {
  sess = req.session;
  sess.email = " ";
  res.render('register',
    {
      error: req.query.valid ? req.query.valid : '',
      msg: req.query.msg ? req.query.msg : ''
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



http.listen(port, "127.0.0.1", () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

io.on('connection', (socket) =>{
  //console.log('a user connected');
  socket.on('message', (msg) => {
    console.log(msg);
    socket.broadcast.emit('message-broadcast', msg);
  });
});




module.exports = app;
