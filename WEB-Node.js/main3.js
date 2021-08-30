var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');
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
var authData = {                   //사용자의 정보를 담은 객체
  email: `kirin2211@naver.com`,
  password: `tjehddnjs14`,   //해쉬와 비밀번호 암호화 작업 필요
  nickname: `Tuna`
}

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  console.log('serializeUser', user);    //로그인 시 사용자의 정보 알려줌
  done(null, user.email);
});
/*
serializeUser {
  email: 'kirin2211@naver.com',
  password: 'tjehddnjs14',
  nickname: 'Tuna'
}
*/

passport.deserializeUser(function (id, done) {
  console.log('deserializeUser', id);    //페이지 방문시 사용자의 정보 출력
  return done(null, authData);
});
//deserializeUser kirin2211@naver.com


passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (username, password, done) {
    console.log(username, password);
    if (username === authData.email) {
      console.log(1);
      if (password === authData.password) {
        console.log(2);
        return done(null, authData, {
          message: 'Welcome.'
        });
      } else {
        console.log(3);
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
    } else {
      console.log(4);
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }
  }
));

app.post('/auth/login_process',
  // passport.authenticate('local', {
  //   successRedirect: '/',
  //   failureRedirect: '/auth/login'
  //   , function(request, response) {
  //     request.session.save(function () {
  //       response.redirect(`/`);
  //     })
  //   }
  // })
  passport.authenticate( 'local', {
    //successRedirect: '/', // 해당 코드를 주석으로 처리하면 아래의 fuction이 호출됨
    failureRedirect: '/auth/login',
     failureFlash:true,
     successFlash:true}
    ),
    function(request, response) { // 해당 function이 호출되고 나서 session을 save해주는 로직을 해주고 처리함.
    request.session.save(function(){  //세션 작업이 다 끝나고서 홈페이지로 들어가게끔 작동 시킴.
    response.redirect('/');
    });
    }
    
);


app.get('*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});

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
