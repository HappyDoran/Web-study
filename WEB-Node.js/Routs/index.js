var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html');
var compression = require('compression')
var template = require('../lib/template.js');
var router = express.Router();
var auth = require('../lib/auth');

//route, routing
//app.get('/', (req, res) => res.send('Hello World!'))


router.get('/', function (request, response) {
  console.log('/', request.user);
  /*{
 email: 'kirin2211@naver.com',
 password: 'tjehddnjs14',
 nickname: 'Tuna'
}*/
  var fmsg = request.flash();
  var feedback = '';
  if (fmsg.success) {
    feedback = fmsg.success[0];
  }
  else if(fmsg.error){
    feedback = fmsg.error[0];
  }

  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `
      <h2>${title}</h2>${description}
      <img src="/img/welcome.jpg" style="width:300px; display:block; margin-top:10px;">
      `,
    `<a href="/topic/create">create</a>`,
    auth.statusUI(request, response)
  );
  response.send(html);
});

module.exports = router;