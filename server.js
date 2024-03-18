// const express = require('express');
const CLI = require('./lib/cli.js');

const { readBanner } = require('./lib/banner.js');

const cli = new CLI();

// const PORT = process.env.PORT || 3001;
readBanner();
cli.run();




