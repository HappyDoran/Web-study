var testfolder = './nodejs';
var fs = require('fs');

fs.readdir(testfolder,function(error,filelist){
    console.log(filelist);
})