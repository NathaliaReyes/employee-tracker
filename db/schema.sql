DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

\c tracker_db;

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    salary NUMERIC(8,2) NOT NULL,
    department INTEGER NOT NULL,
    FOREIGN KEY (department) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER DEFAULT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);