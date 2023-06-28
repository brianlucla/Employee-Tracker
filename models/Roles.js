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
      type:DataTypes.STRING(30),
      allowNull:false
    }
    salary:{
      type:DataTypes.DECIMAL,
      allowNull:false
    }
    department_id:{
      type:DataTypes.INTEGER,
      // how to set foreign key here?
      allowNull:false,
      references:{
        model:"department",
        key:"id"
      }
    }
  }
  {
    sequelize,
    timestamps:false,
    freezeTableName:true,
    underscored:true,
    modelName:'role'
  }
);

module.exports=Employees;