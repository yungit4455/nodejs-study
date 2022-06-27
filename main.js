const http = require('http');
const fs = require('fs');
const url = require('url');

const DATA_DIR_KEY = './data';

function templateHTML(title, list, body) {
    return `
    <!doctype html>
    <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB2</a></h1>
        ${list}
        ${body}
        </body>
    </html>
    `;
}

function templateList(files) {
    let list = `<ul>`;
    for(i in files) {
        list = list + `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
    }
    list = list + `</ul>`;

    return list;
}

const app = http.createServer(function(request,response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathName = url.parse(_url, true).pathname;

    if(pathName === '/') {
        if(queryData.id === undefined) {
            fs.readdir(DATA_DIR_KEY, (err, files) => {
                const title = 'Welcome';
                const description = 'Hello, Node.js';
                const list = templateList(files);
                const template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                response.writeHead(200);
                response.end(template);  
            });
        } else {
            fs.readdir(DATA_DIR_KEY, (err, files) => {
                fs.readFile( `data/${queryData.id}`, 'utf-8', ( err, description ) => {
                    const title = queryData.id;
                    const list = templateList(files);
                    const template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                    response.writeHead(200);
                    response.end(template);  
                });
            });
        }
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
} );

app.listen(3000);