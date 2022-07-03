const url = require('url');
const template = require('./template');
const db = require('./db');

// API 여러개를 제공할 때 exports 사용
exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) { 
            console.log(error);
            throw error; 
        }
        const title = 'Welcome';
        const description = 'Hello, Node.js';
        const list = template.list(topics);
        const html = template.HTML(title, list, 
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html); 
    });
}

exports.page = function(request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;

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

exports.create = function(request, response) {
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
}

exports.create_process = function(request, response) {
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
    });
}

exports.update = function(request, response) {
    const _url = request.url;
    const queryData = url.parse(_url, true).query;
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
}

exports.update_process = function(request, response) {
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
    });
}

exports.delete = function(request, response) {
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
    });
}