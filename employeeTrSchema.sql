create database employee_db;

use employee_db;


CREATE TABLE employeeTracker(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  title VARCHAR(30) NOT NULL,
  department VARCHAR(45) NOT NULL,
  salary INT default 0,
  manager VARCHAR(20),
  PRIMARY KEY (id)
);
