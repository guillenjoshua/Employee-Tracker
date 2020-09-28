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
  database: "employeeTracker_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
  // run the start function after the connection is made to prompt the user
  employeeInfo();
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
      

  // function viewAll () 
    function viewAll () {
    console.log("Viewing all Employees");
    connection.query("SELECT * FROM employeeTracker", (err, res) => {
      if (err) throw err;
   
      console.table(res)
      connection.end();
    })
  }


   function viewDepartment () {

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
   connection.query("SELECT * FROM employeeTracker WHERE * = ?",
    {
      department: answer.department
    },
    
    (err, res) => {
      if (err) throw err;

      console.table(res);
      connection.end();
    })
  })
}


function viewManager () {
  connection.query("SELECT manager FROM employeeTracker", (err, results) =>{
  if (err) throw err;

  inquirer
  .prompt({
    type: "list",
    name: "manager",
    message: "What is the managers name?",
    choices:  function () {
    let managerArray = [];
     for (let i=0; i<results.length; i++){
       managerArray.push(results[i].manager)
          }
        }
      })
    })
      .then(answer => {
  console.log("Viewing all employees by manager");
  
  
  // {
  //   manager: answer.manager
  // },
  // (err, res) => {
    

  //   console.log(res);
  //   connection.end();
  
  })
 }


//Add Employee Function 
 function addEmployee () {

  inquirer
  .prompt([
    {
      name: "first_name",
      type: "input",
      message: "What is the employees first name?"
    },
    {
      name: "last_name",
      type: "input",
      message: "What is the employees last name?"
    },
    {
      name: "title",
      type: "input",
      message: "What is the employees job title?"
    },
    {
      name: "department",
      type: "list",
      message: "Which Department does the employee work in?",
      choices:  ["Sales", 
                "Engineering", 
                "Finance",
                "Legal"
                ]
    },
    {
      name: "salary",
      type: "input",
      message: "What is the employees salary?"
    },
    {
      name: "manager",
      type: "input",
      message: "Who is the employees manager?"
    },
  ])
    .then(answer => {
      connection.query("INSERT INTO employeeTracker SET ?", 
            {
                first_name: answer.first_name,
                last_name: answer.last_name, 
                title: answer.title,
                department: answer.department, 
                salary: answer.salary,
                manager: answer.manager
            },
            function(err) {
              if (err) throw err;
              console.log("Your auction was created successfully!");
              viewAll(); 
            }
      );

    })
    
 }

 //Remove Employee Function

 function removeEmployee() {
  connection.query("SELECT * FROM employeeTracker", function(err, results) {
    if (err) throw err;
  
  inquirer
  .prompt([
    {
      name: "employee",
      type: "rawlist",
      message: "Which employee would you like to remove?",
      choices: function() {
        let employeeArray = [];
        for (let i = 0; i < results.length; i++) {
          employeeArray.push(results[i].first_name);
        }
        return employeeArray;
      }
      
    },
  ])
  .then(answer => {
    connection.query( "DELETE FROM employeeTracker WHERE ?",

          {
            first_name: answer.employee

          },
          function(err, res) {
            if (err) throw err;
            console.log("Employee Removed");
            viewAll();
          }
        )
      })

  })

 }











