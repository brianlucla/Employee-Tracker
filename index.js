const inquirer = require("inquirer");
const sequelize = require("./config/connection");
const { Department, Role, Employee } = require("./models");
const { printTable } = require("console-table-printer");
const { Sequelize } = require("sequelize");
require("console.table");

// promise function to connect to the database first and then run the inquirer prompts
awaitSync().then(() => {
  userOptions();
});

// connects to database
async function awaitSync() {
  const syncAwait = await sequelize.sync({ force: false });
}

// runs the main menu inquirer options
async function userOptions() {
  const { methodsList } = await inquirer.prompt([
    {
      type: "list",
      name: "methodsList",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
    },
  ]);

  // switch statements to run corresponding functions on user input
  switch (methodsList) {
    case "View All Employees":
      return viewEmployees();

    case "Add Employee":
      return addEmployee();

    case "Update Employee Role":
      return updateEmployee();
    case "View All Roles":
      return viewRoles();

    case "Add Role":
      return addRole();

    case "View All Departments":
      return viewDepartments();

    case "Add Department":
      return addDepartment();

    case "Quit":
      process.exit();
  }
}

// creates the table for all employees with all necessary information except for department names
// nesting the model within the includes didn't work for some reason
async function viewEmployees() {
  const allEmployees = await Employee.findAll({
    raw: true,
    include: [{ model: Role, attributes:{exclude:["id"]}}, {model:Employee, as: "manager", attributes:["first_name", "last_name"]}],
    attributes:{exclude:["role_id", "manager_id"],},
  });
  
  printTable(allEmployees);
  userOptions();
}

// creates the table for all departments
async function viewDepartments() {
  const departments = await Department.findAll({ raw: true });
  printTable(departments);
  userOptions();
}

// creates the table for viewing all roles and the necessary information
async function viewRoles() {
  const allRoles = await Role.findAll({
    raw: true,
    include: { model: Department, attributes:{exclude:["id"]}},
    attributes: { exclude: ["department_id"] },
  });
  printTable(allRoles);
  userOptions();
}

// adds a department to the department table based on user input
async function addDepartment(){
  // taking in user input
  await inquirer.prompt([
    {
      type:"input",
      message:"Please input the name of the department",
      name: "depName"
    }
  ]).then((res)=>{
    // then creating a department based on that input
    Department.create({
      name:res.depName
    });
  });
  
  userOptions();
}

// adds a role to the role table based on user input
async function addRole() {
  // taking in user input
  const { roleName, salary, department } = await inquirer.prompt([
    {
      type: "input",
      message: "Please input the name of the role",
      name: "roleName",
    },
    {
      type: "input",
      message: "Please input the salary for this role.",
      name: "salary",
    },
    {
      type: "input",
      message: "Please input the department for this role",
      name: "department",
    },
  ]);
  
  // extracting department ID from department table
  const departmentRow = await Department.findOne({ where: { name: department }, raw:true });
  const departmentID = departmentRow.id; 
  // create role with user input
  Role.create({
        title: roleName,
        salary:salary,
        department_id:departmentID
      });

  userOptions();
}

// adds an employee to the employee table based on user input
async function addEmployee() {
  // taking in user input
  const { firstName, lastName, role, manager } = await inquirer.prompt([
    {
      type: "input",
      message: "Please input the employee's first name",
      name: "firstName",
    },
    {
      type: "input",
      message: "Please input the employee's last name",
      name: "lastName",
    },
    {
      type: "input",
      message: "Please input the employee's role",
      name: "role",
    },
    {
      type: "input",
      message: "Please input the employee's manager",
      name: "manager",
    },
  ]);
  
  // find role id from table of rows by searching with title 
  const roleRow = await Role.findOne({
    where: { title: role },
    raw: true,
  });
  
  const roleID = roleRow.id;

  // finding manager id from manager name
  const managerFirst = manager.split(" ")[0];
  const managerLast = manager.split(" ")[1];
  const managerRow = await Employee.findOne({
    where: {first_name: managerFirst, last_name: managerLast}, 
    raw: true
  });
  const managerID = managerRow.id;
  
  // create employee with user input
  Employee.create({
    first_name: firstName,
    last_name: lastName,
    role_id: roleID,
    manager_id: managerID
  });

  userOptions();
}

// updates an employee based on user input
async function updateEmployee(){
  // create arrays of employees and roles to be manipulated for use in inquirer
  const employeeArray = await Employee.findAll({ raw: true , attributes:{exclude:["id","role_id", "manager_id"]}});
  const roleArray= await Role.findAll({raw:true, attributes:{exclude:["id","salary", "department_id"]}});
  
  // extract first and last names, concatenate them, and push them into a new array
  const employeeFirst = [];
  const employeeLast = [];
  for (let i = 0; i < employeeArray.length; i++){
    employeeFirst.push(employeeArray[i].first_name);
    employeeLast.push(employeeArray[i].last_name);
  }

  employeeNames = [];
  for(let i = 0; i < employeeArray.length; i++){
    employeeNames.push(employeeFirst[i] + " " + employeeLast[i]);
  }

  // create an array of roles
  roleNames = [];
  for (let i = 0; i < roleArray.length; i++){
    roleNames.push(roleArray[i].title);
  }

  // take user input
  const {employee, role} = await inquirer.prompt([
    {
      type:"list",
      message:"Please select the employee's name",
      name:"employee",
      choices:employeeNames
    },
    {
      type:"list",
      message:"Please select the employee's updated role",
      name:"role",
      choices: roleNames
    }
  ]);

  // extract employee name from user input
  const first = employee.split(" ")[0];
  const last = employee.split(" ")[1];

  // find role id by searching the role table
  const roleIDObj = await Role.findOne({raw:true, where:{title:role}, attributes:{exclude:["title","salary","department_id"]}});
  

  const roleID = roleIDObj.id;
  
  // update employee to have the updated role
  const updatedEmployee = await Employee.update(
    {role_id:roleID},
    {where:{first_name:first, last_name: last}}
  );
  
  userOptions();
}