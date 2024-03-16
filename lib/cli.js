const inquirer = require('inquirer');
const pool = require('./pool');

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
            const sql = 'SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.nombre AS department, roles.salary, CONCAT(employees.first_name, \' \', employees.last_name)  AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department = departments.id ORDER BY employees.id';
            const res = await pool.query(sql);
            console.log('Id\tFirst Name\tLast Name\tTitle\t\t\t\t\t\tDepartment\t\tSalary\t\tManager');
            console.log('--\t----------\t---------\t-----\t\t\t\t\t\t----------\t\t------\t\t-------');

            const maxFirstNameLength = Math.max(...res.rows.map(employee => employee.first_name.length));
            const maxLastNameLength = Math.max(...res.rows.map(employee => employee.last_name.length));
            const maxTitleLength = Math.max(...res.rows.map(employee => employee.title.length));
            const maxDepartmentLength = Math.max(...res.rows.map(employee => employee.department.length));
            const maxSalaryLength = Math.max(...res.rows.map(employee => employee.salary.length));
            const maxManagerLength = Math.max(...res.rows.map(employee => employee.manager.length));

            res.rows.forEach(employee => {
              // Pad the end of each field with spaces to align the columns
              const paddedFirstName = employee.first_name.padEnd(maxFirstNameLength, ' ');
              const paddedLastName = employee.last_name.padEnd(maxLastNameLength, ' ');
              const paddedTitle = employee.title.padEnd(maxTitleLength, ' ');
              const paddedDepartment = String(employee.department).padEnd(maxDepartmentLength, ' ');
              const paddedSalary = String(employee.salary).padEnd(maxSalaryLength, ' ');
              const paddedManager = String(employee.manager).padEnd(maxManagerLength, ' ');

              console.log(`${employee.id}\t${paddedFirstName}\t${paddedLastName}\t${paddedTitle}\t${paddedDepartment}\t${paddedSalary}\t${paddedManager}`);
            });
            // pool.end();
            this.run();
            // return res;
        } 
        catch(err) {
            throw err;
        }
        
    }

    async getRoles() {
      try {
        const sql = 'SELECT roles.id, roles.title, departments.nombre AS department, roles.salary FROM roles JOIN departments ON roles.department = departments.id';
        const res = await pool.query(sql);
        console.table(res.rows);
        // pool.end();
        this.run();
      }
      catch(err) {
        throw err;
      }
    }

    async getDepartments() {
      try {
        const sql = 'SELECT id, nombre AS name FROM departments';
        const res = await pool.query(sql);
        console.table(res.rows);
        // pool.end();
        this.run();
      }
      catch(err) {
        throw err;
      }
    }

    async addDepartment() {
      try {
        inquirer.prompt([
          {
            type: 'input',
            name: 'newDept',
            message: 'What is the name of the department?',
            validate: newDept => {
              if(newDept) {
                return true;
              } else {
                console.log('Please enter the name of the department');
                return false;
              }
            }
          }
        ])
        .then(res => {
          const sql = `INSERT INTO departments (nombre) VALUES ($1)`;
          pool.query(sql, [res.newDept], (err, result) => {
            if(err){
              throw err;
            } else {
              console.table('Department added Successfully.');
              this.getDepartments();
              this.run();
            }
          });
        })
      } catch(err) {
        throw err;
      }
    }

    async addRole() {
        inquirer.prompt([
          {
            type: 'input',
            name: 'nameRole',
            message: 'What is the name of the role?',
            validate: nameRole => {
              if(nameRole) {
                return true;
              } else {
                console.log('Please enter the name of the role');
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'salaryRole',
            message: 'What is the salary of the role?',
            validate: salaryRole => {
              if(salaryRole) {
                return true;
              } else {
                console.log('Please enter the salary of the role');
                return false;
              }
            }
          }
        ])
        .then(res => {
          // console.log(typeof(res));
          // console.log(res);
          const params = [res.nameRole, res.salaryRole];
          console.log(typeof params);
          console.log(params);
          let dept;
          // query to grab all departments
          const sqlRole = 'SELECT nombre, id FROM departments';

          // const sql = `INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3)`;
          pool.query(sqlRole, (err, result) => {
            if(err) throw err;
            console.log(result.rows);
            dept = result.rows.map(row => {
              return { name: row.nombre, value: row.id};
            });
            console.log(dept);
            // res.map(({ nombre, id }) => ({ key: nombre, value: id}));
            // console.log(dept);
              // console.table(`Added ${newDept} to the database`);
              // this.getRoles();
              // this.run();
            inquirer.prompt([
              {
                type: 'list',
                name: 'departmentRole',
                message: 'Which department does the role belong to?',
                choices: dept,
                // validate: departmentRole => {
                //   if(departmentRole) {
                //     return true;
                //   } else {
                //     console.log('Please enter the department that the role belong to');
                //     return false;
                //   }
                // }
              }
            ])
            .then(deptChoice => {
              const dep = deptChoice.departmentRole;
              console.log(typeof(dep));
              params.push(dep);
              console.log(params);

              const sql = `INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3)`;
              pool.query(sql, params, (err,result) => {
                if(err) throw err;
                  console.log(`Added ${params[2]} to roles!`)
                  this.getRoles();
                
              })
            })
          
            
          });
      })
      .catch(err => {
        throw err;
      });
    }

  run() {
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

        switch (data.todo) {
          case 'View All Employees':
            await this.getEmployees();
            break;
          case 'View All Roles':
            await this.getRoles();
            break;
          case 'View All Departments':
            await this.getDepartments();
            break;
          case 'Add Department':
            await this.addDepartment();
            break;
          case 'Add Role':
            await this.addRole();
            break;
          default:
            console.log('Something went wrong!');
            break;
        }
        });
    
    }
    // }
}


module.exports = CLI;