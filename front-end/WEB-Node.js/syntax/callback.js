const { callbackify } = require("util");

/*
function a() {
    console.log('A');
}
a();
*/
var a = function() {
    console.log('A');
}
//자바스크립트에서는 함수가 값이다.


function slowfunc(callback) {
    callback();
}

slowfunc(a);


//slofunc -> callback함수 실행 -> a를 변수로 하는 함수 실행