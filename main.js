const http = require('http');
const url = require('url');
const template = require('./lib/template');
const db = require('./lib/db');
const topic = require('./lib/topic');

const app = http.createServer(function(request,response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
    const pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
        if(queryData.id === undefined) {
            topic.home(request, response);
         /* fs.readdir(DATA_DIR_PATH, (err, files) => {
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
            }); */
        } else {
            db.query(`SELECT * FROM topic`, function(error, topics) {
                if(error) { throw error; }
                // [queryData.id] == queryData.id : 결과는 같지만 공격 의도가 있는 코드를 sanitize 해준다.
                // ? 위치로 자동으로 치환된다
                db.query(`SELECT * FROM topic JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], (error2, topic) => {
                    if(error2) { throw error2; }
                    const title = topic[0].title;
                    const description = topic[0].description;
                    const list = template.list(topics);
                    const html = template.HTML(title, list, 
                        `<h2>${title}</h2>
                        ${description}
                        <p>by ${topic[0].name}</p>
                        `,
                        `<a href="/create">create</a> 
                         <a href="/update?id=${queryData.id}">update</a>
                         <form action="delete_process" method="post" onsubmit="Delete?">
                            <input type="hidden" name="id" value="${queryData.id}">
                            <input type="submit" value="delete">
                         </form>`
                    );
                    response.writeHead(200);
                    response.end(html); 
                });
            });
        }
            /* fs.readdir(DATA_DIR_PATH, (err, files) => {
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
            }); */
    } else if(pathname === '/create') {
        db.query(`SELECT * FROM topic`, function(error, topics) {
            if (error) { throw error; }
            db.query(`SELECT * FROM author`, (error2, authors) => {
                if (error2) { throw error2; }
                const title = 'Create';
                const list = template.list(topics);
                const html = template.HTML(title, list, 
                    `
                    <form action="/create_process" method="post">
                        <p><input type="text" name="title" placeholder="title"></p>
                        <p>
                            <textarea name="description" placeholder="description"></textarea>
                        </p>
                        <p>
                            ${template.authorSelect(authors)}
                        </p>
                        <p><input type="submit"></p>
                    </form>
                    `,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html); 
            });
        });
        /* fs.readdir(DATA_DIR_PATH, (err, files) => {
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
        }); */
    } else if(pathname === '/create_process') {
        let body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            const post = new URLSearchParams(body);
            db.query(`INSERT INTO topic (title, description, created, author_id) 
            VALUES(?, ?, NOW(), ?)`,
            [post.get('title'), post.get('description'), post.get('author')],
            (error, result) => {
                if(error) { throw error; }
                response.writeHead(302, {Location: `/?id=${result.insertId}`});
                response.end();
            });
            /* fs.writeFile(`data/${title}`, description, 'utf-8', (err) => {
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end('Success');
            }); */
        });
    } else if(pathname === '/update') {
        db.query(`SELECT * FROM topic`, (error, topics) => {
            if(error) { throw error; }
            db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (error2, topic) => {
                if(error2) { throw error2; }
                db.query(`SELECT * FROM author`, (error3, authors) => {
                    if(error3) { throw error3; }

                    const list = template.list(topics);
                    const html = template.HTML(topic[0].title, list, 
                        `<form action="/update_process" method="post">
                            <input type="hidden" name="id" value="${topic[0].id}">
                            <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                            <p>
                                <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                            </p>
                            <p>
                                ${template.authorSelect(authors, topic[0].author_id)}
                            </p>
                            <p><input type="submit"></p>
                        </form>
                        `,
                        `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                    );
                    response.writeHead(200);
                    response.end(html);  
                });
            });
        });

        /* fs.readdir(DATA_DIR_PATH, (err, files) => {
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
        }); */
    } else if(pathname === '/update_process') {
        let body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            const post = new URLSearchParams(body);
            db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [post.get('title'), post.get('description'), post.get('author'), post.get('id')], 
            (error, result) => {
                if(error) { throw error; }
                response.writeHead(302, {Location: `/?id=${post.get('id')}`});
                response.end();
            });
            /* fs.rename(`data/${filteredId}`, `data/${filteredId}`, function(err) {
                fs.writeFile(`data/${filteredId}`, sanitizedDscription, 'utf-8', (err) => {
                    response.writeHead(302, {Location: `/?id=${filteredId}`});
                    response.end('Success');
                });
            }); */
        });
    } else if(pathname === '/delete_process') {
        let body = '';
        request.on('data', function(data) {
            body += data;
        });
        request.on('end', function() {
            const post = new URLSearchParams(body);
            db.query(`DELETE FROM topic WHERE id=?`, [post.get('id')], (error, result) => {
                if(error) { throw error; }
                response.writeHead(302, {Location: `/`});
                response.end();
            });
            /* fs.unlink(`data/${filteredId}`, function(err) {
                response.writeHead(302, {Location: `/`});
                response.end();
            }); */
        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000);
// db.end();