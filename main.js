const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const DATA_DIR_PATH = './data';

const app = http.createServer(function(request,response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
        if(queryData.id === undefined) {
            fs.readdir(DATA_DIR_PATH, (err, files) => {
                const title = 'Welcome';
                const description = 'Hello, Node.js';
                const sanitizedTitle = sanitizeHtml(title);
                const sanitizedDscription = sanitizeHtml(description);
                const list = template.list(files);
                const html = template.HTML(sanitizedTitle, list, 
                    `<h2>${sanitizedTitle}</h2>${sanitizedDscription}`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);  
            });
        } else {
            fs.readdir(DATA_DIR_PATH, (err, files) => {
                const filteredId = path.parse(queryData.id).base;
                fs.readFile( `data/${filteredId}`, 'utf-8', ( err, description ) => {
                    const title = queryData.id;
                    const sanitizedTitle = sanitizeHtml(title);
                    const sanitizedDscription = sanitizeHtml(description);
                    const list = template.list(files);
                    const html = template.HTML(sanitizedTitle, list, 
                        `<h2>${sanitizedTitle}</h2>${sanitizedDscription}`,
                        `<a href="/create">create</a> 
                         <a href="/update?id=${sanitizedTitle}">update</a>
                         <form action="delete_process" method="post" onsubmit="Delete?">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="delete">
                         </form>`
                    );
                    response.writeHead(200);
                    response.end(html);  
                });
            });
        }
    } else if(pathname === '/create') {
        fs.readdir(DATA_DIR_PATH, (err, files) => {
            const title = 'WEB - create';
            const list = template.list(files);
            const html = template.HTML(title, list, `
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
            response.end(html);  
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
        fs.readdir(DATA_DIR_PATH, (err, files) => {
            const filteredId = path.parse(queryData.id).base;
            fs.readFile( `data/${filteredId}`, 'utf-8', ( err, description ) => {
                const title = queryData.id;
                const sanitizedTitle = sanitizeHtml(title);
                const sanitizedDscription = sanitizeHtml(description);
                const list = template.list(files);
                const html = template.HTML(sanitizedTitle, list, 
                    `<form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${sanitizedTitle}">
                        <p><input type="text" name="title" placeholder="title" value="${sanitizedTitle}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${sanitizedDscription}</textarea>
                        </p>
                        <p><input type="submit"></p>
                    </form>
                 `,
                    `<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a>`
                );
                response.writeHead(200);
                response.end(html);  
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
            const filteredId = path.parse(id).base;
            const description = post.description;
            const sanitizedDscription = sanitizeHtml(description);

            fs.rename(`data/${filteredId}`, `data/${filteredId}`, function(err) {
                fs.writeFile(`data/${filteredId}`, sanitizedDscription, 'utf-8', (err) => {
                    response.writeHead(302, {Location: `/?id=${filteredId}`});
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
            const filteredId = path.parse(id).base;

            fs.unlink(`data/${filteredId}`, function(err) {
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