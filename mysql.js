var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '64275000',
  database : 'nodejs',
});
 
db.connect();
 
db.query('SELECT * FROM author', (error, results) => {
  if (error) {
    console.log(error);
  }
  console.log(results);
});
 
db.end();