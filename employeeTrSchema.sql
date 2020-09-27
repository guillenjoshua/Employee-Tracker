CREATE DATABASE employeeTracker_db;

USE employee_db;


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


INSERT INTO employeeTracker (first_name, last_name, title, department, salary, manager)
VALUES ("Josh", "Guillen", "Junior Developer", "Engineering", 80000, "Helmick")

INSERT INTO employeeTracker (first_name, last_name, title, department, salary)
VALUES ("Loraine", "Ramos", "Engineering Manager", "Engineering", 130000);

INSERT INTO employeeTracker (first_name, last_name, title, department, salary)
VALUES ("Matthew", "Montes", "Lead Attorney ", "Legal", 120000);