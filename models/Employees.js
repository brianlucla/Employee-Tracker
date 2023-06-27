const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const Employees = require("./Roles");

class Roles extends Model{}

Roles.init(
  {
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    }
    first_name:{
      type:"varchar(30)",
      allowNull:false
    }
    last_name:{
      type:"varchar(30)",
      allowNull:false
    }
    role_id:{
      type:DataTypes.INTEGER
    }
    manager_id:{
      type:DataTypes.INTEGER
    }
  }
);

module.exports = Employees;