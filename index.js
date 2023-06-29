const inquirer = require("inquirer");
const sequelize = require("./config/connection");
const { Department, Role, Employee } = require("./models");
const { printTable } = require("console-table-printer");
const { Sequelize } = require("sequelize");
require("console.table");

awaitSync().then(() => {
  userOptions();
});

async function awaitSync() {
  const syncAwait = await sequelize.sync({ force: false });
}

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

  console.log("hi");
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
      return;
  }
}

async function viewEmployees() {
  const allEmployees = await Employee.findAll({
    raw: true,
    include: { model: Role, attributes:{exclude:["id"]}},
    attributes:{exclude:["role_id", "manager_id"],},
  });
  
  printTable(allEmployees);
  userOptions();
}

async function viewDepartments() {
  const departments = await Department.findAll({ raw: true });
  printTable(departments);
  userOptions();
}

async function viewRoles() {
  const allRoles = await Role.findAll({
    raw: true,
    include: { model: Department, attributes:{exclude:["id"]}},
    attributes: { exclude: ["department_id"] },
  });
  printTable(allRoles);
  userOptions();
}

async function addDepartment(){
  await inquirer.prompt([
    {
      type:"input",
      message:"Please input the name of the department",
      name: "depName"
    }
  ]).then((res)=>{
    console.log(res.depName);
    Department.create({
      name:res.depName
    });
  });
  
  userOptions();
}

async function addRole() {
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
  
  const departmentRow = await Department.findOne({ where: { name: department }, raw:true });
  const departmentID = departmentRow.id; 
  Role.create({
        title: roleName,
        salary:salary,
        department_id:departmentID
      });

  userOptions();
}

async function addEmployee() {
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
  console.log(firstName, lastName, role, manager);
  const roleRow = await Role.findOne({
    where: { title: role },
    raw: true,
  });
  console.log(roleRow);
  const roleID = roleRow.id;
  console.log(roleID);

  const managerFirst = manager.split(" ")[0];
  const managerLast = manager.split(" ")[1];
  const managerRow = await Employee.findOne({
    where: {first_name: managerFirst, last_name: managerLast}, 
    raw: true
  });
  const managerID = managerRow.id;
  
  Employee.create({
    first_name: firstName,
    last_name: lastName,
    role_id: roleID,
    manager_id: managerID
  });

  userOptions();
}

async function updateEmployee(){
  const employeeArray = await Employee.findAll({ raw: true , attributes:{exclude:["id","role_id", "manager_id"]}});
  const roleArray= await Role.findAll({raw:true, attributes:{exclude:["id","salary", "department_id"]}});
  console.log(roleArray);
  
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

  roleNames = [];
  for (let i = 0; i < roleArray.length; i++){
    roleNames.push(roleArray[i].title);
  }

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

  const first = employee.split(" ")[0];
  const last = employee.split(" ")[1];

  const roleIDObj = await Role.findOne({raw:true, where:{title:role}, attributes:{exclude:["title","salary","department_id"]}});
  console.log(roleIDObj);

  const roleID = roleIDObj.id;
  console.log(roleID);

  const updatedEmployee = await Employee.update(
    {role_id:roleID},
    {where:{first_name:first, last_name: last}}
  );
  
  userOptions();
}