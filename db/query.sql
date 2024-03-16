SELECT employees.id, employees.first_name, employees.last_name, roles.title, 
departments.nombre AS department, roles.salary, CONCAT(employees.first_name, ' ', employees.last_name)  AS manager 
FROM employees 
JOIN roles ON employees.role_id = roles.id 
JOIN departments ON roles.department = departments.id 
ORDER BY employees.id