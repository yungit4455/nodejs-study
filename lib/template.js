module.exports = {
    HTML: function(title, list, body, control) {
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
    list: function(files) {
        let list = `<ul>`;
        for(i in files) {
            list += `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
        }
        list += `</ul>`;
    
        return list;
    },
}