var array = ['a', 'b', 'c'];   //배열 괄호 []
console.log(array[1]);
var i = 0;

while (i < array.length) {
    console.log(array[i]);
    i++;
}

var object = {               //객체 괄호{}
    'A': 'a',
    'B': 'b',
    'C': 'c'
};

for (var i in object) {
    console.log('object =>', i, 'value =>', object[i]);
}
