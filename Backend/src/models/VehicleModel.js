export default (sequelize, DataTypes) => {
  const VehicleModel = sequelize.define('VehicleModel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'vehicle_models',
    timestamps: false
  });

  VehicleModel.associate = (models) => {
    VehicleModel.belongsTo(models.Brand, { foreignKey: 'brandId', as: 'brand' });
  };

  return VehicleModel;
};
