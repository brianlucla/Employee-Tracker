const sequelize = require('../config/connection.js');

const Departments  = require('../models/Department.js');
const Roles = require('../models/Roles.js');
const Employees = require('../models/Employees.js');

const departmentSeedData = require('./departmentSeedData.json');
const roleSeedData = require('./roleSeedData.json');
const employeeSeedData = require('./employeeSeedData.json');

const seedDatabase = async () =>{
  await sequelize.sync({force:true});

  await Departments.bulkCreate(departmentSeedData);

  await Roles.bulkCreate(roleSeedData);

  await Employees.bulkCreate(employeeSeedData);

  process.exit(0);
}

seedDatabase();