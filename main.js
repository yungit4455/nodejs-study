const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const DATA_DIR_KEY = './data';

function templateHTML(title, list, body, control) {
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
        ${control}
        ${body}
        </body>
    </html>
    `;
}

function templateList(files) {
    let list = `<ul>`;
    for(i in files) {
        list += `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
    }
    list += `</ul>`;

    return list;
}

const app = http.createServer(function(request,response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
        if(queryData.id === undefined) {
            fs.readdir(DATA_DIR_KEY, (err, files) => {
                const title = 'Welcome';
                const description = 'Hello, Node.js';
                const list = templateList(files);
                const template = templateHTML(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(template);  
            });
        } else {
            fs.readdir(DATA_DIR_KEY, (err, files) => {
                fs.readFile( `data/${queryData.id}`, 'utf-8', ( err, description ) => {
                    const title = queryData.id;
                    const list = templateList(files);
                    const template = templateHTML(title, list, 
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a> 
                         <a href="/update?id=${title}">update</a>
                         <form action="delete_process" method="post" onsubmit="Delete?">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                         </form>`
                    );
                    response.writeHead(200);
                    response.end(template);  
                });
            });
        }
    } else if(pathname === '/create') {
        fs.readdir(DATA_DIR_KEY, (err, files) => {
            const title = 'WEB - create';
            const list = templateList(files);
            const template = templateHTML(title, list, `
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p><input type="submit"></p>
             </form>
            `, 
            ``
            );
            response.writeHead(200);
            response.end(template);  
        });
    } else if(pathname === '/create_process') {
        let body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            const post = qs.parse(body);
            const title = post.title;
            const description = post.description;

            fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end('Success');
            });
        });
    } else if(pathname === '/update') {
        fs.readdir(DATA_DIR_KEY, (err, files) => {
            fs.readFile( `data/${queryData.id}`, 'utf-8', ( err, description ) => {
                const title = queryData.id;
                const list = templateList(files);
                const template = templateHTML(title, list, 
                    `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p><input type="submit"></p>
                    </form>
                 `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                );
                response.writeHead(200);
                response.end(template);  
            });
        });
    } else if(pathname === '/update_process') {
        let body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            const post = qs.parse(body);
            const id = post.id;
            const title = post.title;
            const description = post.description;

            fs.rename(`data/${id}`, `data/${title}`, function(err) {
                fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end('Success');
                });
            });
        });
    } else if(pathname === '/delete_process') {
        let body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            const post = qs.parse(body);
            const id = post.id;

            fs.unlink(`data/${id}`, function(err) {
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);