const testFolder = './';
const fs = require('fs');

fs.readdir(testFolder, (err, files) => {
    console.log(files);
    files.forEach(file => {
        console.log(file);
    });
});