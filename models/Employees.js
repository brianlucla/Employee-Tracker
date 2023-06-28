const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const Employees = require("./Roles");
const Departments = require("./Department");

class Roles extends Model{}

Roles.init(
  {
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    }
    first_name:{
      type:DataTypes.STRING(30),
      allowNull:false
    }
    last_name:{
      type:DataTypes.STRING(30),
      allowNull:false
    }
    role_id:{
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:"role",
        key:"id"
      }
    }
    manager_id:{
      type:DataTypes.INTEGER,
      references:{
        model: "employee",
        key: "id"
      }
    }
  }
  {
    sequelize,
    timestamps:false,
    freezeTableName:true,
    underscored:true,
    modelName:'employee'
  }
);

module.exports = Employees;