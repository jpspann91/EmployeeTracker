DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department_table(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    department_title VARCHAR(30) NOT NULL
);

CREATE TABLE role_table (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title: VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INTEGER, 
    -- FOREIGN KEY department_id REFERENCES role_table.department_id = department_table.id
    -- ON DELETE SET NULL
)

CREATE TABLE employee_table(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    -- FOREIGN KEY role_id REFERENCES role_table.id = employee_table.role_id
    -- ON DELETE SET NULL
)