const Department = require("./Department");
const Role = require("./Roles");
const Employee = require("./Employees");

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

Employee.hasOne(Employee, {
  as:"parent",
  foreignKey: "manager_id",
});

Employee.belongsTo(Employee, {
  as:"child",
  foreignKey:"manager_id",
});

module.exports = { Department, Role, Employee };
