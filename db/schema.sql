-- Drop the database if exists, this is a good practice --
DROP DATABASE IF EXISTS tracker_db;

-- Create the new database --
CREATE DATABASE tracker_db;

-- Connect to the database --
\c tracker_db;

-- Create table departments --
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL
);

-- Create table roles --
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    salary NUMERIC(8,2) NOT NULL,
    department INTEGER NOT NULL,
    FOREIGN KEY (department) REFERENCES departments(id) ON DELETE CASCADE
);

-- Create table employees --
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER DEFAULT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);