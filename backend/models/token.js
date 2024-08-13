module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    Token.associate = (models) => {
      Token.belongsTo(models.User);
    };
  
    return Token;
  };