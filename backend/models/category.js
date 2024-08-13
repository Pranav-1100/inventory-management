module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: DataTypes.TEXT
    });
  
    Category.associate = (models) => {
      Category.hasMany(models.Product);
    };
  
    return Category;
  };