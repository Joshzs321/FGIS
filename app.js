var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejs = require('ejs');


var index = require('./routes/index');

var login = require('./routes/login');
var register = require('./routes/register');
// 用来测试的
var HtmlPage1 = require('./routes/HtmlPage1');
var home1 = require('./routes/home1');
var logout = require('./routes/logout');
var home2 = require('./routes/home2');
var projectList=require('./routes/projectList');
var DataTrans=require('./routes/DataTrans');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine','html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret : 'secret',
  cookie : {
    maxAge : 15 * 60 * 1000,
    secure : false
  },
  resave : false,
  saveUninitialized : false
}));

app.use('/', index);

app.use('/login', login);
app.use('/register', register);
app.use('/DataTrans',DataTrans);

//用来测试的
app.use('/HtmlPage1', HtmlPage1);

app.use('/logout', require('./routes/logout'));
app.use('/home1', home1);
app.use('/logout', logout);
app.use('/home2', home2);
app.use('/projectList',projectList);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;


module.exports = app;//这是 4.x 默认的配置，分离了 app 模块,将它注释即可，上线时可以重新改回来
