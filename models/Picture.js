/* jshint esversion:6 */
module.exports = function(sequelize, DataTypes) {
  const Picture = sequelize.define('picture', {
    link : DataTypes.STRING, //ImageURL
    description : DataTypes.STRING
  }, {
    tableName : 'pictures'
  });

  Picture.associate = function(models) {
    Picture.belongsTo(models.author);
  }

  return Picture;
}
