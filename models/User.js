/* jshint esversion:6 */
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    user : DataTypes.STRING,
  }, {
    tableName : 'users'
  });

  User.associate = function(models) {
    User.hasMany(models.gallery);
  };

  return User;
};