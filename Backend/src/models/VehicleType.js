export default (sequelize, DataTypes) => {
  const VehicleType = sequelize.define('VehicleType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'vehicle_types',
    timestamps: false
  });

  VehicleType.associate = (models) => {
    VehicleType.hasMany(models.Vehicle, { foreignKey: 'vehicleTypeId', as: 'vehicles' });
  };

  return VehicleType;
};
