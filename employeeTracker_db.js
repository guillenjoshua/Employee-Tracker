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
              "View All Roles",
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
        } else if(answer.choose === "View All Roles") {
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
  connection.query("SELECT first_name, last_name, title, department, salary FROM employee JOIN employeeRole ON employee.role_id=employeeRole.id Join department ON employeeRole.department_id=department.id", (err, res) => {
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

//View Employee by Manager
let viewManager = () => {
connection.query('SELECT first_name FROM employee WHERE manager_id IS NULL', function (err, results)  {
if (err) throw err;

inquirer
.prompt({
  type: "list",
  name: "manager",
  message: "What is the managers name?",
  choices:  function () {
  let managerArray = [];
   for (let i=0; i<results.length; i++){
     managerArray.push(results[i].first_name)
        }
        return managerArray; 
      }
    })
        .then(answer => {
        connection.query( "SELECT first_name, last_name, title, department, salary FROM employee LEFT JOIN employeeRole ON employee.manager_id = employeeRole.id RIGHT JOIN department ON employeeRole.department_id=department.id WHERE ?",

      {
        first_name: answer.manager
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

connection.query("SELECT title, first_name  FROM employee JOIN employeeRole ON employeeRole.id = employee.id", (err, results) => {
  if (err) throw err;
  
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
    choices: function () {
      let titleArray = [];
       for (let i=0; i<results.length; i++){
         titleArray.push(results[i].title)
            }
            return titleArray; 
          }
  },
  
  {
    name: "salary",
    type: "input",
    message: "What is the employees salary?"
  },
  
])
  .then(answer => {
    
    connection.query("INSERT INTO employee FROM employee JOIN employeeRole ON employee.role_id = employeeRole.id WHERE = ?", 
          {
              first_name: answer.first_name,
              last_name: answer.last_name, 
              title: answer.title,
              salary: answer.salary, 
              
             
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
connection.query("SELECT * FROM employeeTracker", (err, results) => {
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
let updateRole = () => {
connection.query("SELECT * FROM employeeTracker", (err, results) => {
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

let updateManager = () => {
  connection.query("SELECT * FROM employeeTracker", (err, results) => {
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
      (err, res) => {
        if (err) throw err;
        viewAll();
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

  //Combined Salaries

let combinedSalaries = () => {
console.log("Viewing all Salaries Combined");
connection.query("SELECT id, SUM(salary) AS total, salary FROM employeeTracker", (err, res) => {
  if (err) throw err;

  console.table(res)
  employeeInfo();
})

  }




  // Manager
  // SELECT first_name, last_name, title, department, salary FROM employee JOIN employeeRole ON employee.role_id=employeeRole.id Join department ON employeeRole.department_id=department.id WHERE ?

  //Add Employee
  // INSERT INTO employee (first_name, last_name, role_id, manager_id) SELECT first_name, last_name, role_id, manager_id FROM employee JOIN employeeRole WHERE = ?


