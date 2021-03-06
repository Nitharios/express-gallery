/* jshint esversion:6 */
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('user', {
    username : { type: DataTypes.STRING, unique : true },
    password : DataTypes.STRING,
    role : { type : DataTypes.STRING, defaultValue : 'user' }
  }, {
    tableName : 'users'
  });

  User.associate = function(models) {
    User.hasMany(models.gallery);
  };

  return User;
};