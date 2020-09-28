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



//Main Menu
const employeeInfo = () => {

    inquirer.prompt([
    
        { //Main Menu
            type: "list",
            name: "choose",
            message:"Main Menu: What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "View All Employees by Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Title", 
                "Update Employee Manager",
                "View All Roles"
            ]
        },
        
    ])
    .then(answer => {
        // based on their answer, either call the bid or the post functions
        if (answer.choose === "View All Employees") {
          viewAll();
        }   else if(answer.choose === "View All Employees by Department") {
            viewDepartment();
          } else if(answer.choose === "View All Employees by Manager") {
            viewManager();
          } else if(answer.choose === "Add Employee") {
            addEmployee();
          } else if(answer.choose === "Remove Employee") {
            removeEmployee();
          } else if(answer.choose === "Update Employee Title") {
            updateRole();
          } else if(answer.choose === "Update Employee Manager") {
            updateManager();
          } else if(answer.choose === "View All Roles") {
            viewRoles();
          }
            else{
          connection.end();
        }
        
      });
     
  }
      

  // View All Employees 
    function viewAll () {
    console.log("Viewing all Employees");
    connection.query("SELECT * FROM employeeTracker", (err, res) => {
      if (err) throw err;
   
      console.table(res)
      employeeInfo();
    })
  }

//View Employee by Department
function viewDepartment () {
  connection.query("SELECT * FROM employeeTracker", function (err, results)  {
  if (err) throw err;

  inquirer
  .prompt({
    type: "list",
    name: "department",
    message: "Choose a department",
    choices:  function () {
    let departmentArray = [];
     for (let i=0; i<results.length; i++){
       departmentArray.push(results[i].department)
          }
          return departmentArray; 
        }
      })
          .then(answer => {
          connection.query( "Select * FROM employeeTracker WHERE ?",

        {
          department: answer.department
        },
        function (err, res) {
        if (err) throw err; 
        console.table(res)
        employeeInfo(); 
          }
        )
         
        })
    })
 }

//View Employee by Manager
function viewManager () {
  connection.query("SELECT * FROM employeeTracker", function (err, results)  {
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
          return managerArray; 
        }
      })
          .then(answer => {
          connection.query( "Select * FROM employeeTracker WHERE ?",

        {
          manager: answer.manager
        },
        function (err, res) {
        if (err) throw err; 
        console.table(res)
        employeeInfo(); 
          }
        )
         
        })
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
              console.log("Employee Added!");
              viewAll();
              employeeInfo(); 
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
      type: "list",
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
            employeeInfo(); 
          }
        )
      })

  })
 }

 //Update Employee Role
 function updateRole () {
  connection.query("SELECT * FROM employeeTracker", function (err, results) {
  if (err) throw err;

  inquirer
  .prompt([
    {
    type: "list",
    name: "employeeName",
    message: "Which employee would you like to update?",
    choices:  function () {
    let employeeUpdateArray = [];
     for (let i=0; i<results.length; i++){
       employeeUpdateArray.push(results[i].first_name)
          }
          return employeeUpdateArray; 
      }
    },
      {
        type: "input",
        name: "title",
        message: "What is the employee's new title?",
      }
    ])
      .then(answer => {
        connection.query("UPDATE employeeTracker SET ? WHERE ?",
      [
      {
        title: answer.title
      },
      {
        first_name: answer.employeeName
      }
      ],
      function(err, res) {
        if (err) throw err;
        viewAll();
      }
        )
      })

    })
  }


  //Update Employee Manager

  function updateManager () {
    connection.query("SELECT * FROM employeeTracker", function (err, results) {
    if (err) throw err;
  
    inquirer
    .prompt([
      {
      type: "list",
      name: "employeeManager",
      message: "Which employee would you like to update?",
      choices:  function () {
      let managerUpdateArray = [];
       for (let i=0; i<results.length; i++){
         managerUpdateArray.push(results[i].first_name)
            }
            return managerUpdateArray; 
        }
      },
        {
          type: "input",
          name: "manager",
          message: "What is the name of the new manager?",
        }
      ])
        .then(answer => {
          connection.query("UPDATE employeeTracker SET ? WHERE ?",
        [
        {
          manager: answer.manager
        },
        {
          first_name: answer.employeeManager
        }
        ],
        function(err, res) {
          if (err) throw err;
          viewAll();
        }
          )
        })
  
      })
    }

    //View All Roles
    function viewRoles () {
      console.log("Viewing all Roles");
      connection.query("SELECT title FROM employeeTracker", (err, res) => {
        if (err) throw err;
     
        console.table(res)
        employeeInfo();
      })
    }













