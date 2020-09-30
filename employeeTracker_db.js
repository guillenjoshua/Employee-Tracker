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
              "View All Employees by Role",
              "Add Employee",
              "Remove Employee",
              "Update Employee Title", 
              "Update Employee Manager", 
              "Combined Salary Total"
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
        } else if(answer.choose === "View All Employees by Role") {
          viewRoles();
        }else if(answer.choose === "Combined Salary Total") {
          combinedSalaries();
        }
          else{
        connection.end();
      }
      
    });
   
}
    

// View All Employees 
let viewAll = () => {
  console.log("Viewing all Employees");
  connection.query("SELECT first_name, last_name, title, department, salary, manager_id FROM employee JOIN employeeRole ON employee.role_id=employeeRole.id Join department ON employeeRole.department_id=department.id", (err, res) => {
    if (err) throw err;
 
    console.table(res)
    employeeInfo();
  })
}

//View Employee by Department
let viewDepartment = () => {
connection.query("SELECT * FROM department", function (err, results)  {
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
        connection.query( "SELECT first_name, last_name, title, department, salary FROM employee JOIN employeeRole ON employee.role_id=employeeRole.id Join department ON employeeRole.department_id=department.id WHERE ?",

      {
        department: answer.department
      },
       (err, res) => {
      if (err) throw err; 
      console.table(res)
      employeeInfo(); 
        }
      )
       
      })
  })
}


//View All Roles
let viewRoles = () => {
  connection.query("SELECT * FROM employeeRole", function (err, results)  {
  if (err) throw err;
  
  inquirer
  .prompt({
    type: "list",
    name: "title",
    message: "Choose a department",
    choices:  function () {
    let departmentArray = [];
     for (let i=0; i<results.length; i++){
       departmentArray.push(results[i].title)
          }
          return departmentArray; 
        }
      })
          .then(answer => {
          connection.query( "SELECT first_name, last_name, title, department, salary FROM employee JOIN employeeRole ON employee.role_id=employeeRole.id Join department ON employeeRole.department_id=department.id WHERE ?",
  
        {
          title: answer.title
        },
         (err, res) => {
        if (err) throw err; 
        console.table(res)
        employeeInfo(); 
          }
        )
         
        })
    })
  }
  

//View Employee by Manager
let viewManager = () => {
connection.query('SELECT first_name FROM employee WHERE manager_id IS NULL', function (err, results)  {
if (err) throw err;

function employeeManager() {
  let managerArray = [];
   for (let i=0; i<results.length; i++){
     managerArray.push(results[i].first_name)
        }
        return managerArray; 
      }

inquirer
.prompt({
  type: "list",
  name: "manager",
  message: "What is the managers name?",
  choices:  employeeManager() 

    })
        .then(answer => {
        let employeeByManager = employeeManager().indexOf(answer.manager)+1
        connection.query( "SELECT first_name, last_name, title, department, salary FROM employee JOIN employeeRole ON employee.manager_id = employeeRole.id JOIN department ON employeeRole.department_id=department.id WHERE ?",

      {
        first_name: employeeByManager
      },
      
       (err, res) => {
      if (err) throw err; 
      console.table(res)
      employeeInfo(); 
        }
      )
       
      })
  })
}


//Add Employee Function 
let addEmployee = () => {

  

connection.query("SELECT title, first_name, role_id, manager_id  FROM employee JOIN employeeRole ON employeeRole.id = employee.id", (err, results) => {
  if (err) throw err;

  function title () {
    let titleArray = [];
     for (let i=0; i<results.length; i++){
       titleArray.push(results[i].title)
          }
          return titleArray; 
        }

  function manager () {
          let managerArray = [];
           for (let i=0; i<results.length; i++){
             managerArray.push(results[i].first_name)
                }
                return managerArray; 
              }


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
    type: "list",
    message: "What is the employees job title?",
    choices: title()
  },
  {
    name: "manager",
    type: "rawlist",
    message: "What is the employees manager?",
    choices: manager()
  }
  
])
  .then(answer => {
    let role_id = title().indexOf(answer.title)+1
    let manager_id = manager().indexOf(answer.manager)+1
    connection.query("INSERT INTO employee SET ?", 
          {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: role_id,
              manager_id: manager_id
          
          },
          (err) => {
            if (err) throw err;
            console.log("Employee Added!");
            viewAll();
            employeeInfo(); 
          }
    );

  })
})
}

//Remove Employee Function
let removeEmployee = () => {
connection.query("SELECT * FROM employee", (err, results) => {
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
  connection.query( "DELETE FROM employee WHERE ?",

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
let updateRole = () => {
connection.query("SELECT first_name, title FROM employee JOIN employeeRole ON employee.role_id = employeeRole.id", (err, results) => {
if (err) throw err;

function newTitle () {
  let titleArray = [];
   for (let i=0; i<results.length; i++){
     titleArray.push(results[i].title)
        }
        return titleArray; 
      }


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
      type: "list",
      name: "title",
      message: "What is the employee's new title?",
      choices: newTitle() 
    }
  ])
    .then(answer => {
      let employeeNewTitle =  newTitle().indexOf(answer.title)+1
      connection.query("UPDATE employee SET ? WHERE ?",
    [
    {
      role_id: employeeNewTitle
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
let managerUpdate = () => {
  connection.query("SELECT first_name FROM employee WHERE manager_id IS NULL")
  let managerUpdateArr = [];
   for (let i=0; i<results.length; i++){
     managerUpdateArr.push(results[i].first_name)
        }
        return managerUpdateArr; 
    }

let updateManager = () => {
  connection.query("SELECT first_name FROM employee JOIN employeeRole ON employee.role_id = employeeRole.id", (err, results) => {
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
        choices: managerUpdate()
      }
    ])
      .then(answer => {
        let updateManagerId = managerUpdate().forEach(answer.manger)+1
        connection.query("UPDATE employee SET ? WHERE ?",
      [
      {
        manager_id: updateManagerId
      },
      {
        first_name: answer.employeeManager
      }
      ],
      (err, res) => {
        if (err) throw err;
        viewAll();
      }
        )
      })

    })
  }


  //Combined Salaries

let combinedSalaries = () => {
console.log("Viewing all Salaries Combined");
connection.query("SELECT SUM(salary) AS total, salary FROM employeeRole", (err, res) => {
  if (err) throw err;

  console.table(res)
  employeeInfo();
})

  }





