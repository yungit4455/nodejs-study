const express = require('express')
const app = express()
const template = require('./template')
const db = require('./db')
const sanitizeHtml = require('sanitize-html')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
// app.use(bodyParser.json())

// API 여러개를 제공할 때 exports 사용
exports.home = (req, res) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) { 
            console.log(error);
            throw error; 
        }
        const title = 'Welcome';
        const description = 'Hello, Node.js';
        const list = template.list(topics);
        const html = template.HTML(title, list, 
            `
            <h2>${title}</h2>${description}
            <img src="/img/hello.jpg" style="width:300px; display:block; margin-top:10px;">
            `,
            `<a href="/topics/create">create</a>`
        );
        res.writeHead(200);
        res.end(html); 
    });
}

exports.page = (req, res) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if(error) { throw error; }
        // [queryData.id] == queryData.id : 결과는 같지만 공격 의도가 있는 코드를 sanitize 해준다.
        // ? 위치로 자동으로 치환된다
        db.query(`SELECT * FROM topic JOIN author ON topic.author_id=author.id WHERE topic.id=?`, 
        [req.params.topicsId], (error2, topic) => {
            if(error2) { throw error2; }
            const title = topic[0].title;
            const description = topic[0].description;
            const list = template.list(topics);
            const html = template.HTML(sanitizeHtml(title), list, 
                `<h2>${sanitizeHtml(title)}</h2>
                ${sanitizeHtml(description)}
                <p>by ${sanitizeHtml(topic[0].name)}</p>
                `,
                `<a href="/topics/create">create</a> 
                 <a href="/topics/update/${req.params.topicsId}">update</a>
                 <form action="delete" method="post" onsubmit="Delete?">
                    <input type="hidden" name="id" value="${req.params.topicsId}">
                    <input type="submit" value="delete">
                 </form>`
            );
            res.writeHead(200);
            res.end(html); 
        });
    });
}

exports.create = (req, res) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) { throw error; }
        db.query(`SELECT * FROM author`, (error2, authors) => {
            if (error2) { throw error2; }
            const title = 'Create';
            const list = template.list(topics);
            const html = template.HTML(sanitizeHtml(title), list, 
                `
                <form action="/topics/create_process" method="post">
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
                `<a href="/topics/create">create</a>`
            );
            res.writeHead(201);
            res.end(html); 
        });
    });
}

exports.create_process = (req, res) => {
    const post = req.body;
    db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
    [sanitizeHtml(post.title), sanitizeHtml(post.description), sanitizeHtml(post.author)],
    (error, result) => {
        if(error) { throw error; }
        res.writeHead(302, {Location: `/topics/${result.insertId}`});
        res.end();
    });
}

exports.update = (req, res) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if(error) { throw error; }
        db.query(`SELECT * FROM topic WHERE id=?`, 
        [req.params.topicsId], (error2, topic) => {
            if(error2) { throw error2; }
            db.query(`SELECT * FROM author`, (error3, authors) => {
                if(error3) { throw error3; }
                const list = template.list(topics);
                const html = template.HTML(sanitizeHtml(topic[0].title), list, 
                    `<form action="/topics/update_process" method="post">
                        <input type="hidden" name="id" value="${topic[0].id}">
                        <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topic[0].title)}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
                        </p>
                        <p>
                            ${template.authorSelect(authors, topic[0].author_id)}
                        </p>
                        <p><input type="submit"></p>
                    </form>
                    `,
                    `<a href="/topics/create">create</a> <a href="/topics/update/${topic[0].id}">update</a>`
                );
                res.writeHead(200);
                res.end(html);  
            });
        });
    });
}

exports.update_process = (req, res) => {
    const post = req.body;
    db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, 
    [sanitizeHtml(post.title), sanitizeHtml(post.description), sanitizeHtml(post.author), post.id], 
    (error, result) => {
        if(error) { throw error; }
        res.writeHead(302, {Location: `/topics/${post.id}`});
        res.end();
    });

    /*
    let body = '';
    req.on('data', (data) => {
        body += data;
    });
    req.on('end', () => {
        const post = new URLSearchParams(body);
        db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, 
        [sanitizeHtml(post.get('title')), sanitizeHtml(post.get('description')), sanitizeHtml(post.get('author')), post.get('id')], 
        (error, result) => {
            if(error) { throw error; }
            res.writeHead(302, {Location: `/topics/${post.get('id')}`});
            res.end();
        });
    });
    */
}

exports.delete = (req, res) => {
    const post = req.body;
    db.query(`DELETE FROM topic WHERE id=?`, 
    [post.id], 
    (error, result) => { if(error) { throw error; }});
    /*
    let body = '';
    req.on('data', (data) => {
        body += data;
    });
    req.on('end', () => {
        const post = new URLSearchParams(body);
        db.query(`DELETE FROM topic WHERE id=?`, 
        [post.get('id')], 
        (error, result) => { if(error) { throw error; }});
    });
    */
}