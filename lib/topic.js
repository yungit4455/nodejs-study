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