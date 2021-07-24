module.exports = {                                     //객체를 이용해서 탬플릿 기능을 정리정돈함.
    HTML: function (title, list, body, control) {
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
    },
    List: function (filelist) {
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

}