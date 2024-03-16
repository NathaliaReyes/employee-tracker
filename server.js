// const express = require('express');
const CLI = require('./lib/cli.js');

const { readBanner } = require('./lib/banner.js');

const cli = new CLI();

// const PORT = process.env.PORT || 3001;
readBanner();
cli.run();




// app.use((req, res) => {
//     res.status(404).end();
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });



