const fs = require('fs'); 

function readBanner() {
    try {
        const data = fs.readFileSync('./assets/banner.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error("Error reading banner file:", err);
    }
}


module.exports = { readBanner };