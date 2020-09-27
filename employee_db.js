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

    
  }












    
    // .then(firstAnswer => {
    //             const {answer} = firstAnswer;
    
    //         switch(answer) {
    
    //             //Switch for Add Employee
    //             case "Add Employee":
    //                 updateEmployee(answer, "addEmployee", "What is employee's first name?", firstAnswer);
    //             break;

    //             case "Add Employee":
    //                 updateEmployee(answer, "addEmployee", "What is employee's last name?", firstAnswer);
    //             break;

    //             case "Add Employee":
    //                 updateEmployee(answer, "addEmployee", "What is employee's role?", firstAnswer);
    //             break;

    //             case "Add Employee":
    //                 updateEmployee(answer, "addEmployee", "Who is employee's managers?", firstAnswer);
    //             break;
    
    //             //Switch for Employee Update  Role
    //             case "Update Employee Role":
    //                 updateEmployee(answer, "updateEmployee", "What is the Engineer's Github profile username?", firstAnswer);
    //             break;
    
    //             //Switch for Employee Mnager Update
    //             case "Update Employee Manager":
    //                 updateEmployee(answer, "updateManager", "What is the name of the employee?", firstAnswer);
    //             break;
    //         }
    //     });
    // }

    // const roleSpecific = (update, inputType, message, answerOne) => {
    //     inquirer.prompt ([
    //             {
    //                 type: "input",
    //                 name: inputType,
    //                 message: message
    //             }
    //         ])



    employeeInfo();