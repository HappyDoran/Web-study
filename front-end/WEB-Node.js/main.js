//c언어에서 include 같은 역할을 하는 코드
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');


function templateHTML(title, list, body, control) {
  //웹사이트의 제목, 링크, 본문, 삭제, 수정부분을 불러오는 함수
  //링크, create, update, delete, 본문 구현
  return `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}           
          ${control}        
          ${body}           
        </body>
        </html>
        `;
}

function templateList(filelist) {
  //웹사이트에서 링크부분을 불러오는 함수
  var list = '<ul>';
  var i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list = list + '</ul>'
  return list;
}

var app = http.createServer(function (request, response) { //웹서버를 생성하는 코드. 익숙해 져야한다.

  var _url = request.url; // ?id=HTML
  var myURL = new URL('http://localhost:3000' + _url); // http://localhost......TML
  var queryData = myURL.searchParams.get('id'); // HTML
  var pathname = url.parse(_url, true).pathname;         //?id=HTML
  var title = queryData;
  if (pathname == '/') {
    if (queryData === null) {          // 아무것도 입력이 안된 메인페이지
      fs.readdir('./data', function (error, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        /*
        var list = templateList(filelist);
        var i = 0;
        var template = templateHTML(title, list, `<h2>${title}</h2>${description}`,
          `<a href = "/create">create </a>`);
        response.writeHead(200);
        response.end(template);
        */
        var list = template.List(filelist);
        var i = 0;
        var html = template.HTML(title, list, `<h2>${title}</h2>${description}`,
          `<a href = "/create">create </a>`);
        response.writeHead(200);
        response.end(html);
      })
    }
    else {                              //메인페이지를 제외한 다른 모든 페이지
      fs.readdir('./data', function (error, filelist) {             //data 디렉토리에서 파일의 리스트를 읽어온다              
        var filteredId= path.parse(queryData).base;                 //파일을 읽어올 때 비밀번호와 같은 보안을 처리하기 위한 코드, 걸러진 정보를 가져온다.
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {        //읽어온 파일 리스트를 통해 제목과 본문을 가져옴
          var title = filteredId;
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description);
          var list = template.List(filelist);
          var html = template.HTML(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href = "/create">create </a>
            <a href="/update?id=${sanitizedTitle}">update </a>
            <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <input type="submit" value="delete">
                </form>`
          );
          response.end(html);
        });
      });
    }
  }
  else if (pathname == '/create') {                      //링크를 생성하는 코드 구현, pathname이 /create일때 이 코드 실행
    fs.readdir('./data', function (error, filelist) {
      var title = 'Web-create';
      var list = template.List(filelist);
      var i = 0;
      var html = template.HTML(title, list, `
      <form action="/create_process" method="POST">
      <p><input type="text" name = "title" 
      placeholder = "title"></p>
      <p>
      <textarea name="description"
      placeholder = "description"></textarea></p>
      <p><input type="submit"></p>
  </form>`, '');
      response.writeHead(200);
      response.end(html);
    })
  }
  else if (pathname == '/create_process') {              //내가 만들 링크와 본문을 입력하고 sumit을 눌렀을때 pathname이 /create_process로 바뀌는 걸 form을 통해 만들고 이코드 실행
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      console.log(post);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {           //만들어진 링크와 본문을 data디랙토리 안에 생성.
        response.writeHead(302, { Location: `/?id = ${title}` });                   //만들어진 링크와 본문에 대한 pathname 생성.
        response.end();
      })
    });
  }
  else if (pathname == '/update') {                //링크를 수정하는 코드 구현. pathname이 /update일때 이 코드 실행.  
    //위의 create와 기능은 똑같지만 다른부분은 기존의 파일의 pathname과 제목, 본문을 입력한 form의 내용으로 수정함. 
    fs.readdir('./data', function (error, filelist) {
      var filteredId= path.parse(queryData).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = filteredId;
        var list = template.List(filelist);
        var html = template.HTML(title, list,
          `
          <form action="/update_process" method="POST">          
          <input type = "hidden" name = "id" value = "${title}">
      <p><input type="text" name = "title" 
      placeholder = "title" value = "${title}"></p>
      <p>
      <textarea name="description" 
      placeholder = "description" >${description}</textarea></p>
      <p><input type="submit"></p>
        </form>
        <h2>${title}</h2>${description}`, `<a href = "/create">create </a><a href="/update?id=${title}">update </a>`);
        response.end(html);
      });
    });
  }
  else if (pathname == '/update_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {                  //수정하는 기능의 코드
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
          response.writeHead(302, { Location: `/?id = ${title}` });
          response.end();
        })
        //console.log(post);
      });
    });
  }
  else if (pathname == '/delete_process') {          //링크를 삭제하는 코드 구현. pathname이 /delete_process일때 이 코드 실행.  
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      var filteredId= path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function (error) {        //삭제하는 기능의 코드
        response.writeHead(302, { Location: `/` });
        response.end();
        //console.log(post);
      })
    });
  }
  else {
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);


/*
이코드를 짜면서 의문이 드는 내용
`은 어디에 있는 것일까??
한국어 파일생성은 왜 매끄럽게 안되는 것일까??
*/
