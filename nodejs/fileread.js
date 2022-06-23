const fs = require('fs');
fs.readFile( 'sample.txt', 'UTF-8', ( err, data ) => {
    if( err ) throw err;
    console.log( data );
 } );