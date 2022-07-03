const url = require('url');
const template = require('./template');
const db = require('./db');

exports.home = (request, response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) { 
            console.log(error);
            throw error;
        }
        db.query(`SELECT * FROM author`, (error2, authors) => {
            if (error2) { throw error2; }
            const title = 'Author';
            const list = template.list(topics);
            const html = template.HTML(title, list, 
                `
                ${template.authorTable(authors)}
                <style>
                    table {
                        border-collapse: collapse;
                    }
                    td {
                        border: 1px solid black;
                    }
                </style>
                <form action="/author/create_process" method="post">
                    <p><input type="text" name="name" placeholder="Write the author's name you want."></p>
                    <p>
                        <textarea name="profile" placeholder="Write the author's description"></textarea>
                    </p>
                    <p><input type="submit" value="Create"></p>
                </form>
                `,
                ``
            );
            response.writeHead(200);
            response.end(html); 
        });
    });
}

exports.create_process = (request, response) => {
    let body = '';
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        const post = new URLSearchParams(body);
        db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`,
        [post.get('name'), post.get('profile')],
        (error, result) => {
            if(error) { throw error; }
            response.writeHead(302, {Location: `/author`});
            response.end();
        });
    });
}

exports.update = function(request, response) {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) { 
            console.log(error);
            throw error;
        }
        db.query(`SELECT * FROM author`, (error2, authors) => {
            if (error2) { throw error2; }
            const _url = request.url;
            const queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], (error3, author) => {
                const title = 'Author';
                const list = template.list(topics);
                const html = template.HTML(title, list, 
                    `
                    ${template.authorTable(authors)}
                    <style>
                        table {
                            border-collapse: collapse;
                        }
                        td {
                            border: 1px solid black;
                        }
                    </style>
                    <form action="/author/update_process" method="post">
                    <p><input type="hidden" name="id" value="${queryData.id}"></p>
                        <p><input type="text" name="name" value="${author[0].name}" placeholder="Write the author's name you want."></p>
                        <p>
                            <textarea name="profile" placeholder="Write the author's description">${author[0].profile}</textarea>
                        </p>
                        <p><input type="submit" value="Update"></p>
                    </form>
                    `,
                    ``
                );
                response.writeHead(200);
                response.end(html); 
            });
        });
    });
}

exports.update_process = function(request, response) {
    let body = '';
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        const post = new URLSearchParams(body);
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
        [post.get('name'), post.get('profile'), post.get('id')],
        (error, result) => {
            if(error) { throw error; }
            response.writeHead(302, {Location: `/author`});
            response.end();
        });
    });
}

exports.delete_process = function(request, response) {
    let body = '';
    request.on('data', (data) => {
        body += data;
    });
    request.on('end', () => {
        const post = new URLSearchParams(body);
        db.query(
            `DELETE FROM topic WHERE author_id=?`, 
            [post.get('id')], 
            (error1, result1) => {
            if (error1) { throw error1; }
            db.query(
                `DELETE FROM author WHERE id=?`,
                [post.get('id')],
                (error2, result2) => {
                    if(error2) { throw error2; }
                    response.writeHead(302, {Location: `/author`});
                    response.end();
            });
        });
    });
}