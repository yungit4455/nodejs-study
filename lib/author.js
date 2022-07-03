const template = require('./template');
const db = require('./db');

exports.home = function(request, response) {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) { 
            console.log(error);
            throw error;
        }
        db.query(`SELECT * FROM author`, (error2, authors) => {
            if (error2) { throw error2; }
            const title = 'Welcome';
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
                `,
                `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html); 
        });
    });
}
