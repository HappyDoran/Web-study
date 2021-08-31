var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');

var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require("connect-flash");


app.disable('x-powered-by');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  //store: new FileStore()
}))

app.use(flash()); //세션을 이용하여 동작하기때문에 세션 뒤에 와야함.
/*
app.get('/flash', function(request, response){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  request.flash('msg', 'Flash is back!!');  //request 객체에 flash 메소드를 추가해줌.
  response.send('flash');
});

app.get('/flash-display', function(request, response){
  // Get an array of flash messages by passing the key to req.flash()
  var fmsg =  request.flash();    //데이터를 사용하고 나면 지워짐
  console.log(fmsg); 
  response.send(fmsg);
});
*/

var passport = require('./lib/passport')(app); //passport.js 안의 함수의 parameter에 app이 들어감

app.get('*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
