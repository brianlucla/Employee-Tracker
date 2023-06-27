const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Employees extends Model{}

Employees.init(
  {
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    }
    title:{
      type:"varchar(30)",
      allowNull:false
    }
    salary:{
      type:DataTypes.DECIMAL
    }
    department_id:{
      type:DataTypes.INTEGER,
      // how to set foreign key here?
    }
  }
);

module.exports=Employees;