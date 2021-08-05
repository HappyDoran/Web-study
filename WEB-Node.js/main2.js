var express = require('express')
var app = express()
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var indexRouter = require('./Routs/index.js')
var topicRouter = require('./Routs/topic.js');
var helmet = require('helmet');

app.use(helmet());
app.use(express.static('public'));           //정적인 파일 서비스
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get('*'/* * = 들어오는 모든 요청*/, function (request, response, next) {
  //fs.readdir('./data', function(error, filelist)를 줄임.
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});
//route, routing
//app.get('/', (req, res) => res.send('Hello World!'))
app.use('/', indexRouter)
app.use('/topic', topicRouter);
// /topic으로 시작하는 주소를 가진 웹페이지들에게 topicRouter라고 하는 미들웨어를 적용하겠다.



app.use(function (req, res, next) {             //404 Not Found
  res.status(404).send('404 Not Found');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

/*
response.writeHead(302, {Location: `/?id=${title}`});
response.send();
*/
//response.redirect('/?id = ${title}');

//다른사람이 만든 소프트웨어를 이용해서 나만의 프로그램을 만든다.
