// array, object

var f = function() {
    console.log(1+1);
    console.log(1+2);
}

console.log(f);
f();


var a = [f];
a[0]();      //배열의 원소로써 함수가 될 수 있음.

var o = {
    func:f
};
o.func();   

