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

//route, routing
//app.get('/', (req, res) => res.send('Hello World!'))
router.get('/', function (request, response) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `
      <h2>${title}</h2>${description}
      <img src="/img/welcome.jpg" style="width:300px; display:block; margin-top:10px;">
      `,
        `<a href="/topic/create">create</a>`
    );
    response.send(html);
});

module.exports = router;
