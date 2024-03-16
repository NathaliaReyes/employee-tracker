const inquirer = require('inquirer');
const pool = require('./pool');
const { readBanner } = require('./banner')



const questions = [
  'What would you like to do?',
  'What is the name of the department?',
  'What would you like to do?',
  'What is the name of the role?',
  'What is the salary of the role?',
  'Which department does the role belong to?'
];

class CLI {
  constructor() {
    this.options = [];
  }

    async getEmployees() {
        try {
            const sql = 'SELECT * FROM employees';
            const res = await pool.query(sql);
            console.log(res);
            console.table(res.rows);
            return res;
        } 
        catch(err) {
            throw err;
        }
        
    }

  run() {
    readBanner((banner) => {
        console.log(banner);

    return inquirer
      .prompt([
        {
          type: 'list',
          message: questions[0],
          choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
          name: 'todo'
        }
      ])
      .then(async (data) => {
        this.options = data;
        console.log(data.todo);
        if(data.todo === 'View All Employees') {
            console.log('Here!');
            await this.getEmployees();
        } else {
            console.log('Something went wrong!');
        }
        });
    
    })
    }
}


module.exports = CLI;