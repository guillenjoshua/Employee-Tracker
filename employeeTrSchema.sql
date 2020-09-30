CREATE DATABASE employeeTrackerTwo_db;

USE employeeTracker_db;


CREATE TABLE department (
  id INT AUTO_INCREMENT,
  department VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE employeeRole (
  id INT AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL (10,2), 
  department_id INT, 
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT, 
  manager_id INT, 
  PRIMARY KEY (id)
);




INSERT INTO department (department)
VALUES ("Engineering"), ('Finance'), ('Legal'), ("Sales")

INSERT INTO employeeRole (title, salary, department_id)
VALUES ("Engineering Manager", 140000.00, 1),
("Senior Developer", 120000.00, 1 ), 
("Junior Developer", 90000.00, 1),
("Accountant", 80000.00, 2),
("Finance Controller", 110000.00, 2),
("Lead Attorney", 130000.00, 3), 
("Attorney", 100000.00, 3),
("Sales Manager", 120000.00, 4),
("Sales Person", 85000.00, 4); 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Don", "Julio", 1, null), 
("Josh", "Guillen", 2, 1),
("Jack", "Sparrow", 3, 1),
("Carlos", "Carlock", 4, 1), 
("Ross", "Davis", 5, 1),
("Matthew", "Montes", 6, null),
("Smokey", "Robinson", 7, 6), 
("Gilbert", "Godfrey", 8, null),
("Jim", "Beam", 9, 8);


