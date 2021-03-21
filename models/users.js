'use strict';
const { MethodNotAllowed } = require('http-errors');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  users.init({
    UserId: {
      type: DataTypes.INTEGER,
      autoIncrement: true, 
      primaryKey: true,
      allowNull: false
    },
    FirstName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    Username: {
      type: DataTypes.STRING,
      unique: true
    },
    Password: DataTypes.STRING,
    Email: {
      type: DataTypes.STRING,
      unique: true
    },
    Admin: {
      type: DataTypes.BOOLEAN,
      default: false 
    },
    createdAt: DataTypes.DATEONLY,
    updatedAt: DataTypes.DATEONLY,
    Deleted: {
      type: DataTypes.BOOLEAN,
      defalutValue: false
    }
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};