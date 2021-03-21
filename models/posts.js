'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  posts.init({
    PostId: {
      autoIncrement: true,
      primaryKey: true, 
      allowNull: false,
      type:DataTypes.INTEGER,
    },
    PostTitle: DataTypes.STRING,
    PostBody: DataTypes.STRING,
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users', 
        key: 'UserId'
      }
    }, 
    createdAt: DataTypes.DATEONLY,
    updatedAt: DataTypes.DATEONLY, 
    Deleted: {
      type: DataTypes.BOOLEAN,
      defalutValue: false
    }

  }, {
    sequelize,
    modelName: 'posts',
  });
  return posts;
};