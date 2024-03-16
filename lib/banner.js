const fs = require('fs'); // asynchronous operation

function readBanner(callback) {
    fs.readFile('./assets/banner.txt', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading banner file:", err);
            callback("");
        } else {
            callback(data);
        }
    });
}


module.exports = { readBanner };