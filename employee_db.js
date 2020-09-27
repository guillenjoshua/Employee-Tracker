const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "tawhid1954",
  database: "employee_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});




const employeeInfo = () => {

    inquirer.prompt([
    
        { //Main Menu
            type: "list",
            name: "choose",
            message:"Main Menu: What would you like to do?",
            choices: [
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role", 
                "Update Employee Manager"
            ]
        },
        
    ])
    .then(answer => {
        // based on their answer, either call the bid or the post functions
        if (answer.choose === "View all employees") {
          viewAll();
        }   else if(answer.choose === "View all employees by department") {
            viewDepartment();
          } else if(answer.choose === "View all employees by manager") {
            viewManager();
          } else if(answer.choose === "Add Employee") {
            addEmployee();
          } else if(answer.choose === "Remove Employee") {
            removeEmployee();
          } else if(answer.choose === "Update Employee Role") {
            upadateRole();
          } else if(answer.choose === "Update Employee Manager") {
            updateManager();
          } 
            else{
          connection.end();
        }
      });
  }

  const viewAll = () => {
    console.log("Viewing all Employees");
    connection.query("SELECT name FROM employeeTracker", (err, res) => {
      if (err) throw err;
   
      console.log(res);
      connection.end();
    viewAll();
  })
}


   const viewDepartment = () => {

    inquirer
    .prompt({
      type: "list",
      name: "department",
      message: "Choose a department",
      choices:  ["Sales", 
                "Engineering", 
                "Finance",
                "Legal"
                ]
        })
    .then(answer => {
    console.log("Viewing all employees by department");
    connection.query("SELECT name FROM employeeTracker WHERE department = ?",
    
    {
      department: answer.department
    },
    (err, res) => {
      if (err) throw err;

      console.log(res);
      connection.end();
    viewDepartment();
    })
  })
}


const viewManager = () => {

  inquirer
  .prompt({
    type: "list",
    name: "manager",
    message: "Choose a department",
    choices:  ["Sales", 
              "Engineering", 
              "Finance",
              "Legal"
              ]
      })
  .then(answer => {
  console.log("Viewing all employees by manager");
  connection.query("SELECT name FROM employeeTracker WHERE manager = ?",
  
  {
    manager: answer.manager
  },
  (err, res) => {
    if (err) throw err;

    console.log(res);
    connection.end();
  viewManager();
  })
})
}









