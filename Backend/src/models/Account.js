export default (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    saldo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'accounts',
    timestamps: true
  });

  Account.associate = (models) => {
    Account.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }

  return Account;
}
