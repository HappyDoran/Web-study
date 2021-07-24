var links = {
    setcolor : function (color) { 
        var alist = document.querySelectorAll('a');
        var i = 0;
        while (alist.length > i) {
            alist[i].style.color = color;
            i++;
        }
    }
}
var Body = {
    set_color: function (Bcolor, color) {
        document.querySelector('body').style.backgroundColor = Bcolor;
        document.querySelector('body').style.color = color;

    }
}
function handler(self) {
    var target = document.querySelector('body');
    if (self.value === 'white') {
        Body.set_color('black', 'white');
        links.setcolor('powderblue');
        self.value = 'black'
    }
    else {
        Body.set_color('white', 'black');
        links.setcolor('blue');
        self.value = 'white'
    }
}