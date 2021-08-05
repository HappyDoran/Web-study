var fs = require('fs'); //모듈 불러오기

/*readFileSync
console.log('A');
var result = fs.readFileSync('sample.txt', 'utf8');
console.log(result);
console.log('C');
*/


console.log('A');
fs.readFile('sample.txt', 'utf8', function(err, result){
    console.log(result);
    console.log('비동기적인 방식은 이 계산이 완료된 후 나중에 나옵니다');
});
console.log('C');