var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
var cookie = require('cookie');

var shortid = require('shortid');

var db = require('../lib/db');

var bcrypt = require('bcrypt');

module.exports = function (passport) {
  router.get('/login', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
  <div style="color:red;">${feedback}</div>
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p>
        <input type = "password" name = "password" placeholder = "password">
      </p>
      <p>
        <input type="submit" value = "login">
      </p>
    </form>
    `, '');
    response.send(html);
  });
  /*
  router.post('/login_process', function (request, response) {
      var post = request.body;
      var email = post.email;
      var password = post.password;
      if (email == authData.email && password == authData.password) {
          //success
          request.session.is_logined = true;
          request.session.nickname = authData.nickname;
          request.session.save(function(){
            response.redirect(`/`);
          });
      }
      else {
          response.send("who?");
      }
      //response.redirect(`/topic/${title}`);
    });
  */

  router.post('/login_process',
    // passport.authenticate('local', {
    //   successRedirect: '/',
    //   failureRedirect: '/auth/login'
    //   , function(request, response) {
    //     request.session.save(function () {
    //       response.redirect(`/`);
    //     })
    //   }
    // })
    passport.authenticate('local', {
      //successRedirect: '/', // 해당 코드를 주석으로 처리하면 아래의 fuction이 호출됨
      failureRedirect: '/auth/login',
      failureFlash: true,
      successFlash: true
    }
    )
    , function (request, response) { // 해당 function이 호출되고 나서 session을 save해주는 로직을 해주고 처리함.
      request.session.save(function () {  //세션 작업이 다 끝나고서 홈페이지로 들어가게끔 작동 시킴.
        response.redirect('/');
      });
    }
  );

  router.get('/register', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
        <div style="color:red;">${feedback}</div>
        <form action="/auth/register_process" method="post">
          <p><input type="text" name="email" placeholder="email" value="kirin2211@naver.com"></p>
          <p><input type="password" name="pwd" placeholder="password" value="tjehddnjs14"></p>
          <p><input type="password" name="pwd2" placeholder="password" value="tjehddnjs14"></p>
          <p><input type="text" name="displayName" placeholder="display name" value="Tuna_register"></p>
          <p>
            <input type="submit" value="register">
          </p>
        </form>
      `, '');
    response.send(html);
  });

  router.post('/register_process', function (request, response) {
    var post = request.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;
    if (pwd !== pwd2) {
      request.flash('error', 'Password must same!');
      response.redirect('/auth/register');
    } else {
      bcrypt.hash(pwd, 10, function (err, hash) {
        var user = {
          id: shortid.generate(),
          email: email,
          password: hash,
          displayName: displayName
        };
        db.get('users').push(user).write();
        request.login(user, function (err) {
          console.log('redirect');
          return response.redirect('/');
        })
      });
    }
  });


  router.get('/logout', function (request, response) {
    request.logout();
    request.session.save(function () {     //세션을 다 지운 다음 확인까지 다 끝난 후에 페이지로 돌아감. 
      response.redirect('/');
    });
  });
  /*
  router.get('/create', function (request, response) {
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
        <form action="/topic/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '');
    response.send(html);
  });
  router.post('/create_process', function (request, response) {
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      response.redirect(`/topic/${title}`);
    });
  });
  router.get('/update/:pageId', function (request, response) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      var title = request.params.pageId;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
          <form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
      );
      response.send(html);
    });
  });
  router.post('/update_process', function (request, response) {
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.redirect(`/topic/${title}`);
      })
    });
  });
  router.post('/delete_process', function (request, response) {
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function (error) {
      response.redirect('/');
    });
  });
  router.get('/:pageId', function (request, response, next) {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      if (err) {
        next(err);
      } else {
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags: ['h1']
        });
        var list = template.list(request.list);
        var html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` <a href="/topic/create">create</a>
              <a href="/topic/update/${sanitizedTitle}">update</a>
              <form action="/topic/delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`
        );
        response.send(html);
      }
    });
  });
  */
  return router;
}