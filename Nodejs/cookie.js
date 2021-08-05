const { listenerCount } = require('events');
var http = require('http');
var cookie = require('cookie');


http.createServer(function (request, response) {
    console.log(request.headers.cookie);
    var cookies = {};
    if (request.headers.cookie != undefined) {
        cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies.yummy_cookie);

    response.writeHead(200, {
        'set-Cookie': ['yummy_cookie = choco', 'tasty_cookie = strawberry']
    })

    response.end('cookie!!');
}).listen(3000);