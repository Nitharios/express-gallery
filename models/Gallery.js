/* jshint esversion:6 */
module.exports = function(sequelize, DataTypes) {
  const Gallery = sequelize.define('gallery', {
    link : DataTypes.STRING, //ImageURL
    description : DataTypes.STRING
  }, {
    tableName : 'gallery'
  });

  Gallery.associate = function(models) {
    Gallery.belongsTo(models.author);
  };

  return Gallery;
};
