export default (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'payment_methods',
    timestamps: false
  });

  PaymentMethod.associate = (models) => {
    PaymentMethod.hasMany(models.Recharge, { foreignKey: 'paymentMethodId', as: 'recharges' });
  };

  return PaymentMethod;
};
