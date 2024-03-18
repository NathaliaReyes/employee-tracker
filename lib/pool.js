const { Pool } = require('pg');

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

module.exports = pool;