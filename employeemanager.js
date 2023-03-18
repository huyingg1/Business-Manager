const mysql = require("mysql2");
const inquirer = require("inquirer");
const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123srssenglI",
    database: "business_manager",
  },
  console.log(`Connected to the business_manager database.`)
);

db.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${db.threadId}\n`);
  promptUser();
});

function promptUser() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit(then press 'ctrl+C')",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit(then press 'ctrl+C')":
          break;
      }
    });
}

function viewDepartments() {
  db.query("SELECT id, name FROM departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}

function viewRoles() {
  const query =
    "SELECT r.id, r.title, r.salary, d.name as department FROM roles r JOIN departments d ON r.department_id = d.id";
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}

function viewEmployees() {
  const query = `SELECT e.id, e.first_name, e.last_name, r.title as job_title, d.name as department, r.salary, CONCAT(m.first_name, ' ', m.last_name) as manager
                 FROM employees e
                 JOIN roles r ON e.role_id = r.id
                 JOIN departments d ON r.department_id = d.id
                 LEFT JOIN employees m ON e.manager_id = m.id`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    promptUser();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      name: "departmentName",
      type: "input",
      message: "Enter the name of the department:",
    })
    .then((answer) => {
      db.query(
        "INSERT INTO departments (name) VALUES (?)",
        [answer.departmentName],
        (err) => {
          if (err) throw err;
          console.log("Department added successfully.");
          promptUser();
        }
      );
    });
}

function addRole() {
  db.query("SELECT * FROM departments", (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the role title:",
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the role salary:",
          validate: (value) =>
            !isNaN(value) ? true : "Please enter a valid number.",
        },
        {
          name: "department_id",
          type: "list",
          message: "Select the department:",
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answers) => {
        db.query("INSERT INTO roles SET ?", answers, (err) => {
          if (err) throw err;
          console.log("Role added successfully.");
          promptUser();
        });
      });
  });
}

function addEmployee() {
  db.query("SELECT * FROM roles", (err, roles) => {
    if (err) throw err;

    db.query("SELECT * FROM employees", (err, employees) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "Enter the employee first name:",
          },
          {
            name: "last_name",
            type: "input",
            message: "Enter the employee last name:",
          },
          {
            name: "role_id",
            type: "list",
            message: "Select the role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            name: "manager_name",
            type: "list",
            message:
              "Select the manager from the list (choose 'None' if no manager):",
            choices: employees
              .map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              }))
              .concat({ name: "None", value: null }),
          },
        ])
        .then((answers) => {
          if (answers.manager_name === null) {
            answers.manager_id = null;
          } else {
            answers.manager_id = answers.manager_name;
          }
          delete answers.manager_name;

          db.query("INSERT INTO employees SET ?", answers, (err) => {
            if (err) throw err;
            console.log("Employee added successfully.");
            promptUser();
          });
        });
    });
  });
}

function updateEmployeeRole() {
  db.query("SELECT * FROM employees", (err, employees) => {
    if (err) throw err;

    db.query("SELECT * FROM roles", (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "employee_id",
            type: "list",
            message: "Select the employee to update:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: "new_role_id",
            type: "list",
            message: "Select the new role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answers) => {
          db.query(
            "UPDATE employees SET role_id = ? WHERE id = ?",
            [answers.new_role_id, answers.employee_id],
            (err) => {
              if (err) throw err;
              console.log("Employee role updated successfully.");
              promptUser();
            }
          );
        });
    });
  });
}

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
