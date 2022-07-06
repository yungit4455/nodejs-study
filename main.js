const express = require('express')
const app = express()
const port = 3000
const topic = require('./lib/topic');
const author = require('./lib/author');

app.get('/', (req, res) => {
    topic.home(req, res)
})

app.get('/topics/create', (req, res) => {
    topic.create(req, res);
})

app.post('/topics/create_process', (req, res) => {
    topic.create_process(req, res)
}) 

app.get('/topics/update/:topicsId', (req, res) => {
    topic.update(req, res)
})

app.post('/topics/update_process', (req, res) => {
    topic.update_process(req, res)
})

app.post('/topics/delete', (req, res) => {
    topic.delete(req, res)
})

app.get('/topics/:topicsId', (req, res) => {
    topic.page(req, res);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// const http = require('http');
// const url = require('url');
// const topic = require('./lib/topic');
// const author = require('./lib/author');

// const app = http.createServer(function(request,response) {
//     const _url = request.url;
//     const queryData = url.parse(_url, true).query;
//     const pathname = url.parse(_url, true).pathname;

//     if(pathname === '/') {
//         if(queryData.id === undefined) {
//             topic.home(request, response);
//          /* fs.readdir(DATA_DIR_PATH, (err, files) => {
//                 const title = 'Welcome';
//                 const description = 'Hello, Node.js';
//                 const sanitizedTitle = sanitizeHtml(title);
//                 const sanitizedDscription = sanitizeHtml(description);
//                 const list = template.list(files);
//                 const html = template.HTML(sanitizedTitle, list, 
//                     `<h2>${sanitizedTitle}</h2>${sanitizedDscription}`,
//                     `<a href="/create">create</a>`
//                 );
//                 response.writeHead(200);
//                 response.end(html);  
//             }); */
//         } else {
//             topic.page(request, response);
//         }
//             /* fs.readdir(DATA_DIR_PATH, (err, files) => {
//                 const filteredId = path.parse(queryData.id).base;
//                 fs.readFile( `data/${filteredId}`, 'utf-8', ( err, description ) => {
//                     const title = queryData.id;
//                     const sanitizedTitle = sanitizeHtml(title);
//                     const sanitizedDscription = sanitizeHtml(description);
//                     const list = template.list(files);
//                     const html = template.HTML(sanitizedTitle, list, 
//                         `<h2>${sanitizedTitle}</h2>${sanitizedDscription}`,
//                         `<a href="/create">create</a> 
//                          <a href="/update?id=${sanitizedTitle}">update</a>
//                          <form action="delete_process" method="post" onsubmit="Delete?">
//                             <input type="hidden" name="id" value="${sanitizedTitle}">
//                             <input type="submit" value="delete">
//                          </form>`
//                     );
//                     response.writeHead(200);
//                     response.end(html);  
//                 });
//             }); */
//     } else if(pathname === '/create') {
//         topic.create(request, response);
//         /* fs.readdir(DATA_DIR_PATH, (err, files) => {
//             const title = 'WEB - create';
//             const list = template.list(files);
//             const html = template.HTML(title, list, `
//             <form action="/create_process" method="post">
//                 <p><input type="text" name="title" placeholder="title"></p>
//                 <p>
//                     <textarea name="description" placeholder="description"></textarea>
//                 </p>
//                 <p><input type="submit"></p>
//              </form>
//             `, 
//             ``
//             );
//             response.writeHead(200);
//             response.end(html);  
//         }); */
//     } else if(pathname === '/create_process') {
//         topic.create_process(request, response);
//             /* fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
//                 response.writeHead(302, {Location: `/?id=${title}`});
//                 response.end('Success');
//             }); */
//     } else if(pathname === '/update') {
//         topic.update(request, response);
//         /* fs.readdir(DATA_DIR_PATH, (err, files) => {
//             const filteredId = path.parse(queryData.id).base;
//             fs.readFile( `data/${filteredId}`, 'utf-8', ( err, description ) => {
//                 const title = queryData.id;
//                 const sanitizedTitle = sanitizeHtml(title);
//                 const sanitizedDscription = sanitizeHtml(description);
//                 const list = template.list(files);
//                 const html = template.HTML(sanitizedTitle, list, 
//                     `<form action="/update_process" method="post">
//                         <input type="hidden" name="id" value="${sanitizedTitle}">
//                         <p><input type="text" name="title" placeholder="title" value="${sanitizedTitle}"></p>
//                         <p>
//                             <textarea name="description" placeholder="description">${sanitizedDscription}</textarea>
//                         </p>
//                         <p><input type="submit"></p>
//                     </form>
//                  `,
//                     `<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a>`
//                 );
//                 response.writeHead(200);
//                 response.end(html);  
//             });
//         }); */
//     } else if(pathname === '/update_process') {
//         topic.update_process(request, response);
//         /* fs.rename(`data/${filteredId}`, `data/${filteredId}`, function(err) {
//             fs.writeFile(`data/${filteredId}`, sanitizedDscription, 'utf-8', (err) => {
//                 response.writeHead(302, {Location: `/?id=${filteredId}`});
//                 response.end('Success');
//             });
//         }); */
//     } else if(pathname === '/delete_process') {
//         topic.delete(request, response);
//         /* fs.unlink(`data/${filteredId}`, function(err) {
//             response.writeHead(302, {Location: `/`});
//             response.end();
//         }); */
//     } else if(pathname === '/author') {
//         author.home(request, response);
//     } else if(pathname === '/author/create_process') {
//         author.create_process(request, response);
//     } else if(pathname === '/author/update') {
//         author.update(request, response);
//     } else if(pathname === '/author/update_process') {
//         author.update_process(request, response);
//     } else if(pathname === '/author/delete_process') {
//         author.delete_process(request, response);
//     } else {
//         response.writeHead(404);
//         response.end('Not found');
//     }
// });

// app.listen(3000);
// // db.end();