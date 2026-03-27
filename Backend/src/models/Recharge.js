export default (sequelize, DataTypes) => {
  const Recharge = sequelize.define('Recharge', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentMethodId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'recharges',
    timestamps: true
  });

  Recharge.associate = (models) => {
    Recharge.belongsTo(models.Account, { foreignKey: 'accountId', as: 'account' });
    Recharge.belongsTo(models.PaymentMethod, { foreignKey: 'paymentMethodId', as: 'paymentMethod' });
  };

  return Recharge;
};
