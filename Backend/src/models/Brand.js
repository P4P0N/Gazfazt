export default (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
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
    tableName: 'brands',
    timestamps: false
  });

  Brand.associate = (models) => {
    Brand.hasMany(models.VehicleModel, { foreignKey: 'brandId', as: 'vehicleModels' });
  };

  return Brand;
};
