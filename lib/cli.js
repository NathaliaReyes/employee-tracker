const inquirer = require('inquirer');
const pool = require('./pool');
const e = require('express');

const questions = [
  'What would you like to do?',
  'What is the name of the department?',
  'What is the name of the role?',
  'What is the salary of the role?',
  'Which department does the role belong to?',
  `Which employee's role do you want to update?`,
  'Which role do you want to assign the selected employee?',
  `What is the employee's first name?`,
  `What is the employee's last name?`,
  `What is the employee's role?`,
  `Who is the employee's manager?`,
  'Which department do you want to delete? (Warning: This will also delete any associated roles and employees)',
  'Which role do you want to delete? (Warning: This will also delete any associated employees)',
  'Which employee do you want to delete?',
  `Which employee's manager do you want to update?`,
  'Which employee do you want to set as manager for the selected employee?',
  'Which department do you want to view?'
];

class CLI {
  constructor() {}

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
            console.table(res.rows);
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
        this.run();
      }
      catch(err) {
        throw err;
      }
    }

    async getEmployeesByManager() {
      const sql = `SELECT 
                  employees.id, 
                  employees.first_name, 
                  employees.last_name, 
                  roles.title, 
                  departments.nombre AS department
                  FROM employees 
                  LEFT JOIN roles ON employees.role_id = roles.id 
                  LEFT JOIN departments ON roles.department = departments.id 
                  WHERE manager_id = $1;`;
      
      pool.query(sql, (err, result) => {
        if(err) {
          console.error('Error fetching employees');
          return;
        }
        const employees = result.rows.map(row => {
          return { name: row.name, value: row.id };
        });
      })
    }

    async getEmployeesByDepartment() {
      const sqlDepartments = 'SELECT nombre, id FROM departments';
      let departments;
      pool.query(sqlDepartments, (err, result) => {
        if(err) {
          console.error('Error fetching departments');
          return;
        }
        departments = result.rows.map(row => {
          return { name: row.nombre, value: row.id };
        });
        inquirer.prompt([
          {
            type: 'list',
            name: 'department',
            message: questions[16],
            choices: departments
          }
        ])
        .then(res => {
          const sql = `SELECT 
                      employees.id, 
                      employees.first_name, 
                      employees.last_name, 
                      roles.title, 
                      departments.nombre AS department
                      FROM employees 
                      LEFT JOIN roles ON employees.role_id = roles.id 
                      LEFT JOIN departments ON roles.department = departments.id 
                      WHERE departments.id = $1;`;
          pool.query(sql, [res.department], (err, result) => {
            if(err) {
              console.error('Error fetching employees');
              return;
            }
            console.log('\n');
            console.table(result.rows);
            console.log('\n');
            this.run();
          });
        });
      });       
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

    async addRole() {
        inquirer.prompt([
          {
            type: 'input',
            name: 'nameRole',
            message: questions[2],
            validate: nameRole => {
              if(!isNaN(nameRole) || /[!@=°#$%^&*(),.?":{}|<>]/.test(nameRole)) {
                return 'Please enter a valid Role';
              }
              return true;
            }
          },
          {
            type: 'input',
            name: 'salaryRole',
            message: questions[3],
            validate: salaryRole => {
              if(isNaN(salaryRole) || /[!@=°#$%^&*(),?":{}|<>]/.test(salaryRole)) {
                return 'Please enter a valid Salary for the role';
              }
              return true;
            }
          }
        ])
        .then(res => {
          const params = [res.nameRole, res.salaryRole];
          let dept;
          // query to grab all departments
          const sqlRole = 'SELECT nombre, id FROM departments';

          pool.query(sqlRole, (err, result) => {
            if(err) throw err;
            dept = result.rows.map(row => {
              return { name: row.nombre, value: row.id};
            });

            inquirer.prompt([
              {
                type: 'list',
                name: 'departmentRole',
                message: questions[4],
                choices: dept,
              }
            ])
            .then(deptChoice => {
              const dep = deptChoice.departmentRole;
              params.push(dep);

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
              return 'Please enter a valid name';
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
                message: questions[9],
                choices: rol,
              },
              {
                type: 'list',
                name: 'managerEmployee',
                message: questions[10],
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

    async deleteDepartment() {
      const sqlDep = 'SELECT nombre, id FROM departments';
      let departments;
      pool.query(sqlDep, (err, result) => {
        if(err) {
          console.error('Error fetching departments');
          return;
        }
        departments = result.rows.map(row => {
          return { name: row.nombre, value: row.id };
        });
        inquirer.prompt([
          {
            type: 'list',
            name: 'department',
            message: questions[11],
            choices: departments
          }
        ])
        .then(res => {
          const sql = 'DELETE FROM departments WHERE id = $1';
          pool.query(sql, [res.department], (err, result) => {
            if(err) throw err;
              console.log('Department deleted from the database');
              console.log('\n');
              this.run();
          });
        });
      });
    }

    async deleteEmployee() {
      const sqlEmployees = "SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM employees";
      let employees;
      pool.query(sqlEmployees, (err, result) => {
        if(err) {
          console.error('Error fetching departments');
          return;
        }
        employees = result.rows.map(row => {
          return { name: row.name, value: row.id };
        });
        inquirer.prompt([
          {
            type: 'list',
            name: 'employees',
            message: questions[13],
            choices: employees
          }
        ])
        .then(res => {
          const sql = 'DELETE FROM employees WHERE id = $1';
          pool.query(sql, [res.employees], (err, result) => {
            if(err) throw err;
              console.log('Employee deleted from the database');
              console.log('\n');
              this.run();
          });
        });
      });
    }

    async deleteRole() {
      const sqlRoles = 'SELECT title, id FROM roles';
      let roles;
      pool.query(sqlRoles, (err, result) => {
        if(err) {
          console.error('Error fetching departments');
          return;
        }
        roles = result.rows.map(row => {
          return { name: row.title, value: row.id };
        });
        inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: questions[12],
            choices: roles
          }
        ])
        .then(res => {
          const sql = 'DELETE FROM roles WHERE id = $1';
          pool.query(sql, [res.role], (err, result) => {
            if(err) throw err;
              console.log('Role deleted from the database');
              console.log('\n');
              this.run();
          });
        });
      });
    }

    async getBudget() {
      const sql = `SELECT departments.nombre AS department, SUM(roles.salary) AS utilized_budget 
                  FROM employees 
                  LEFT JOIN roles ON employees.role_id = roles.id 
                  LEFT JOIN departments ON roles.department = departments.id 
                  GROUP BY departments.nombre ORDER BY utilized_budget ASC;`;
      const res = await pool.query(sql);
      console.log('\n');
      console.table(res.rows);
      console.log('\n');
      this.run();
    }

    async updateEmployeeManager() {
      const sqlEmployee = 'SELECT CONCAT(first_name, \' \',  last_name) AS name, id, manager_id FROM employees';
      let employees;
      
      pool.query(sqlEmployee, (err, result) => {
        if(err) {
          console.error('Error fetching employees');
          return;
        }
        employees = result.rows.map(row => {
          return { name: row.name, value: row.id };
        });
        inquirer.prompt([
          {
            type: 'list',
            name: 'listEmployees',
            message: questions[14],
            choices: employees,
          }
        ])
        .then(choice => {
          console.log(choice.listEmployees);
          let managers;
          const sqlEmployee = 'SELECT CONCAT(first_name, \' \',  last_name) AS name, id, manager_id FROM employees';
          pool.query(sqlEmployee, (err, res) => {
            if(err) {
              console.error('Error fetching employees');
              return;
            }
            managers = res.rows
              .filter(employee => employee.id !== choice.listEmployees)
              .map(employee => {
              return { name: employee.name, value: employee.id };
            });

            inquirer.prompt([
              {
                type: 'list',
                name: 'managerEmployees',
                message: questions[15],
                choices: managers,
              }
            ])
            .then(choices => {
              console.log(choices);
              console.log(choices.managerEmployees);
              const params = [choice.listEmployees, choices.managerEmployees];
              const sql = `UPDATE employees
              SET manager_id = $2
              WHERE id = $1;`
              pool.query(sql, params, (err, result) => {
                if(err) throw err;
                console.log(`Updated employee's manager`);
                this.run();
              })
            });
          });
        });
      })
    }
    
    async quit() {
      console.log('Bye.. Closing system!');
      process.exit();
    }
  run() {
    return inquirer
      .prompt([
        {
          type: 'list',
          message: questions[0],
          choices: ['View All Employees', 
                    'Add Employee', 
                    'Update Employee Role', 
                    'View All Roles', 
                    'Add Role', 
                    'View All Departments', 
                    'Add Department', 
                    'Delete Department', 
                    'Delete Role', 
                    'Delete Employee',
                    'View Total Utilized Budget of a Department',
                    'Update Employee Manager',
                    'View All Employees by Manager',
                    'View All Employees by Department',
                    'Quit'],
          name: 'todo'
        }
      ])
      .then(async (data) => {

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
          case 'Delete Department':
            await this.deleteDepartment();
            break;
          case 'Delete Role':
            await this.deleteRole();
            break;
          case 'Delete Employee':
            await this.deleteEmployee();
            break;
          case 'View Total Utilized Budget of a Department':
            await this.getBudget();
            break;
          case 'Update Employee Manager':
            await this.updateEmployeeManager();
            break;
          case 'View All Employees by Manager':
            await this.getEmployeesByManager();
            break;
          case 'View All Employees by Department':
            await this.getEmployeesByDepartment();
            break;
          default:
            this.quit();
        }
      });
  }
}

module.exports = CLI;