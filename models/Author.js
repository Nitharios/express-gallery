/* jshint esversion:6 */
module.exports = function(sequelize, DataTypes) {
  const Author = sequelize.define('author', {
    author : DataTypes.STRING,
  }, {
    tableName : 'authors'
  });

  Author.associate = function(models) {
    Author.hasMany(models.gallery);
  };

  return Author;
};