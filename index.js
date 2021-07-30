var express = require('express');
var router = express.Router();
var template = require('../lib/template');


router.get('/', function(request, response) { 
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <h2>${title}</h2>${description}
      <img src="/img/hello.jpg" style="width:100px; display:block; margin-top:10px;">
      `,
      `<a href="/topic/create">create</a>`
      //정적인 파일 서비스
    );
    response.send(html);
  });
/*
app.get('/', function(req,res){
  return res.send('Hello world!');
});
*/
module.exports = router;