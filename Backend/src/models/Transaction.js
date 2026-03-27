export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Transacción'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comision: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'transactions',
    timestamps: true
  });   

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Transaction.belongsTo(models.Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });
    Transaction.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    Transaction.belongsTo(models.State, { foreignKey: 'stateId', as: 'state' });
  };

  return Transaction;
};
