const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer(function(request,response){
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  let title = queryData.id;
  
  const template = `
  
  `;
  response.end(template);  
});
app.listen(3000);