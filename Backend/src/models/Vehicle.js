export default (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    placa: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    vehicleTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    colorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'vehicles',
    timestamps: false
  });

  Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Vehicle.belongsTo(models.VehicleModel, { foreignKey: 'modelId', as: 'model' });
    Vehicle.belongsTo(models.VehicleType, { foreignKey: 'vehicleTypeId', as: 'vehicleType' });
    Vehicle.belongsTo(models.Color, { foreignKey: 'colorId', as: 'color' });
  };

  return Vehicle;
};