module.exports = {
    HTML: (title, list, body, control) => {
        return `
        <!doctype html>
        <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            <body>
            <h1><a href="/">WEB</a></h1>
            <a href="/author">Author</a>
            ${list}
            ${control}
            ${body}
            </body>
        </html>
        `;
    },

    list: (topics) => {
        let list = `<ul>`;
        for(i in topics) {
            list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
        }
        list += `</ul>`;
    
        return list;
    },

    authorSelect: (authors) => {
        let tag = ``;
        for(i in authors) {
            tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
        }

        return `
            <select name="author">
            ${tag}
            </select>
        `;
    },

    authorSelect: (authors, currentId) => {
        let tag = ``;
        for(i in authors) {
            if(authors[i].id === currentId)
                tag += `<option value="${authors[i].id}" selected>${authors[i].name}</option>`;
            else
                tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
        }

        return `
            <select name="author">
            ${tag}
            </select>
        `;
    },

    authorTable: (authors) => {
        let tag = `<table>`;
        for(i in authors) {
            tag += `
                <tr>
                    <td>${authors[i].name}</td>
                    <td>${authors[i].profile}</td>
                    <td><a href="/author/update?id=${authors[i].id}">update</a></td>
                    <td>
                        <form action="/author/delete_process" method="post">
                            <input type="hidden" name="id" value="${authors[i].id}">
                            <input type="submit" value="delete">
                        </form>
                    </td>
                </tr>
            `
        }
        tag += `</table>`;

        return tag;
    },
}