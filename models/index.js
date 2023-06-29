const Department = require("./Department");
const Role = require("./Roles");
const Employee = require("./Employees");

// creating foreign keys and connections
Department.hasOne(Role, {
  foreignKey: "department_id",
  onDelete: "CASCADE",
});

Role.belongsTo(Department, {
  foreignKey: "department_id",
});

Role.hasOne(Employee, {
  foreignKey: "role_id",
  onDelete: "CASCADE",
});

Employee.belongsTo(Role, {
  foreignKey: "role_id",
});

Employee.belongsTo(Employee,{
  foreignKey:"manager_id",
  as: "manager"
});


module.exports = { Department, Role, Employee };
