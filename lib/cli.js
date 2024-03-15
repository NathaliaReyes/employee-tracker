const fs = require('fs');
const inquirer = require('inquirer');
const EmployeeTracker = require('./methods');

const employeeTracker = new EmployeeTracker();

const questions = [
  'What would you like to do?',
  'What is the name of the department?',
  'What would you like to do?',
  'What is the name of the role?',
  'What is the salary of the role?',
  'Which department does the role belong to?',
  ''
];

class CLI {
  constructor() {
    this.options = [];
  }

  readBanner(callback) {
    fs.readFile('./assets/banner.txt', 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading banner file:", err);
            callback("");
        } else {
            callback(data);
        }
    });
}

  run() {
    this.readBanner((banner) => {
        console.log(banner);
    
    return inquirer
      .prompt([
        {
          type: 'list',
          message: questions[0],
          choices: ['Viell All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit', 'View All Employees'],
          name: 'choices'
        }
        

      ])
      .then((data) => {
        this.options = data;
        if(data[0] === 'View All Employees') {
            console.log(employeeTracker.getEmployees());
        } else {
            console.log('Something went wrong!');
        }
        //   case 'Add Employee':
        //     break;
        //   case 'Update Employee Role':
        //     break;
        //   case 'View All Roles':
        //     break;
        //   case 'Add Role':
        //     break;
        //   case 'View All Departments':
        //     break;
        //   case 'Add Department':
        //     break;
        //   case 'Quit':
        //     break;
        //   case 'View All Employees':
        //     break;
          
        });
    
    })
  };
}



module.exports = CLI;