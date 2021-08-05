var o =  {
    v1:'v1',
    v2:'v2',
    f1 :function() {           //함수가 객체 안에서 사용됨
        console.log(this.v1);
    },
    f2 : function() {
        console.log(this.v2);
    }
    
}
o.f1();
o.f2(); 