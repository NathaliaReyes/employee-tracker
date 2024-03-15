const { pool } = require('../server');

class EmployeeTracker {
    getEmployees = () => {
        const sql = 'SELECT * FROM employees';
        pool.query(sql, (err, result) => {
            if(err) {
                console.log('Error in the query', err);
                res.status(500).json({ error: 'An error occurred while retrieving the employees.'});
                return;
            } 
            const rows = result.rows;
            console.log(rows);
            res.json({
                message: 'success!!',
                data: rows
            });
        });
    }
}

module.exports = EmployeeTracker;
