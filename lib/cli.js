const inquirer = require('inquirer');
const pool = require('./pool');

const questions = [
  'What would you like to do?',
  'What is the name of the department?',
  'What is the name of the role?',
  'What is the salary of the role?',
  'Which department does the role belong to?',
  `Which employee's role do you want to update?`,
  'Which role do you want to assign the selected employee?',
  `What is the employee's first name?`,
  `What is the employee's last name?`
];

class CLI {
  constructor() {
    // this.options = [];
  }

    async getEmployees() {
        try {
            const sql = `SELECT 
                            employees.id, 
                            employees.first_name, 
                            employees.last_name, 
                            roles.title, 
                            departments.nombre AS department, 
                            roles.salary, 
                            CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                            FROM employees 
                            LEFT JOIN roles ON employees.role_id = roles.id 
                            LEFT JOIN departments ON roles.department = departments.id 
                            LEFT JOIN employees manager ON manager.id = employees.manager_id ORDER BY employees.id`;
            const res = await pool.query(sql);
            console.log('\n');
            console.log('Id\tFirst Name\tLast Name\tTitle\t\t\t\t\tDepartment\t\tSalary\t\tManager');
            console.log('--\t----------\t---------\t-----\t\t\t\t\t----------\t\t------\t\t-------');

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
            console.log('\n');
            this.run();
        } 
        catch(err) {
            throw err;
        }
        
    }

    async getRoles() {
      try {
        const sql = 'SELECT roles.id, roles.title, departments.nombre AS department, roles.salary FROM roles JOIN departments ON roles.department = departments.id';
        const res = await pool.query(sql);
        console.log('\n');
        console.table(res.rows);
        console.log('\n');
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
        console.log('\n');
        console.table(res.rows);
        console.log('\n');
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
            message: questions[1],
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
              console.table(`Added ${res.newDept} to the database`);
              this.run();
            }
          });
        })
      } catch(err) {
        throw err;
      }
    }

    async quit() {
      console.log('Bye!');
      process.exit();
    }

    async addRole() {
        inquirer.prompt([
          {
            type: 'input',
            name: 'nameRole',
            message: questions[2],
            // validate: nameRole => {
            //   if(nameRole) {
            //     return true;
            //   } else {
            //     console.log('Please enter the name of the role');
            //     return false;
            //   }
            // }
          },
          {
            type: 'input',
            name: 'salaryRole',
            message: questions[3],
            // validate: salaryRole => {
            //   if(salaryRole) {
            //     return true;
            //   } else {
            //     console.log('Please enter the salary of the role');
            //     return false;
            //   }
            // }
          }
        ])
        .then(res => {
          const params = [res.nameRole, res.salaryRole];
          let dept;
          // query to grab all departments
          const sqlRole = 'SELECT nombre, id FROM departments';

          // const sql = `INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3)`;
          pool.query(sqlRole, (err, result) => {
            if(err) throw err;
            // console.log(result.rows);
            dept = result.rows.map(row => {
              return { name: row.nombre, value: row.id};
            });
            // console.log(dept);
            inquirer.prompt([
              {
                type: 'list',
                name: 'departmentRole',
                message: questions[4],
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
              // console.log(typeof(dep));
              params.push(dep);
              // console.log(params);

              const sql = `INSERT INTO roles (title, salary, department) VALUES ($1, $2, $3)`;
              pool.query(sql, params, (err,result) => {
                if(err) throw err;
                  console.log(`Added ${res.nameRole} to roles!`);
                  this.run();
              })
            })
          
            
          });
      })
      .catch(err => {
        throw err;
      });
    }

    async addEmployee() {
      inquirer.prompt([
        {
          type: 'input',
          name: 'nameEmployee',
          message: questions[7],
          validate: nameEmployee => {
            if(!isNaN(nameEmployee) || /[!@=°#$%^&*(),.?":{}|<>]/.test(nameEmployee)) {
              return 'Please enter a valid last name';
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'lastNameEmployee',
          message: questions[8],
          validate: lastNameEmployee => {
            if(!isNaN(lastNameEmployee) || /[!@=°#$%^&*(),.?":{}|<>]/.test(lastNameEmployee)) {
              return 'Please enter a valid last name';
            }
            return true;
          }
        }
      ])
      .then(res => {
        const params = [res.nameEmployee, res.lastNameEmployee];
        let rol;
        let manager;
        // query to grab all departments
        const sqlRole = 'SELECT title, id FROM roles';
        const sqlManager = 'SELECT CONCAT(first_name, \' \',  last_name) AS name, id FROM employees';

        pool.query(sqlRole, (err, result) => {
          if(err) {
            console.error('Error fetching roles');
            return;
          }
          rol = result.rows.map(row => {
            return { name: row.title, value: row.id };
          });

          pool.query(sqlManager, (err, res) => {
        
            console.log('String: ', res);
            if(err) {
              console.error('Error fetching managers');
              return;
            }
            manager = res.rows.map(row => {
              return { name: row.name, value: row.id };
            });
            //Adding None to the manager list
            manager.unshift({ name: "None", value: null })
            inquirer.prompt([
              {
                type: 'list',
                name: 'roleEmployee',
                message: `What is the employee's role?`,
                choices: rol,
              },
              {
                type: 'list',
                name: 'managerEmployee',
                message: `Who is the employee's manager?`,
                choices: manager,
              }
            ])
            .then(empChoice => {
              const role = empChoice.roleEmployee;
              const manager = empChoice.managerEmployee;
              params.push(role);
              params.push(manager);
  
              const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
              pool.query(sql, params, (err,result) => {
                if(err) throw err;
                  console.log(`Added ${params[0]} ${params[1]} to the database`);
                  this.run();
              })
            })
          });
        });
    })
    .catch(err => {
      throw err;
    });
    }

    async updateEmployeeRole() {
      const sqlEmployee = 'SELECT CONCAT(first_name, \' \',  last_name) AS name, id FROM employees';
      const sqlRole = 'SELECT title, id FROM roles';

      let employees;
      let rol;
      pool.query(sqlEmployee, (err, result) => {
        if(err) {
          console.error('Error fetching employees');
          return;
        }
        employees = result.rows.map(row => {
          return { name: row.name, value: row.id };
        });

        pool.query(sqlRole, (err, res) => {
          if(err){
            console.error('Error fetching roles');
            return;
          }
          rol = res.rows.map(row => {
            return { name: row.title, value: row.id };
          });
        
          inquirer.prompt([
            {
              type: 'list',
              name: 'listEmployees',
              message: questions[5],
              choices: employees,

            },
            {
              type: 'list',
              name: 'roleEmployees',
              message: questions[6],
              choices: rol,
            }
          ])
          .then(choice => {
            const params = [choice.listEmployees, choice.roleEmployees];

            const sql = `UPDATE employees
            SET role_id = $2
            WHERE id = $1;`
            pool.query(sql, params, (err, result) => {
              if(err) throw err;
                console.log(`Updated employees's role`);
                this.run();
              
            })
            
          })
        })
      })
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
        // this.options = data;

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
          case 'Add Employee':
            await this.addEmployee();
            break;
          case 'Update Employee Role':
            await this.updateEmployeeRole();
            break;
          default:
            this.quit();
        }
      });
  }
}


module.exports = CLI;