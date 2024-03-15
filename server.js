const express = require('express');
const CLI = require('./lib/cli.js');

const cli = new CLI();

const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

// Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to the database:
const pool = new Pool(
    {
      user: 'postgres',
      password: 'lacasadelarbolCODING23',
      host: 'localhost',
      database: 'tracker_db'
    },
    console.log(`Connected to the movie_db database.`)
)

pool.connect();

// app.get('/api/movies', (req, res) => {
//     pool.query('SELECT id, nombre AS title FROM movies', (err, { rows }) => {
//         if(err) {
//             throw err;
//             return;
//         } 
//         res.json({
//             message: 'success!!',
//             data: rows
//         });
//     });
// });


app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

cli.run();

module.exports = { pool };
