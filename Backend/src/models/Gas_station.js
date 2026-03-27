export default (sequelize, DataTypes) => {
  const GasStation = sequelize.define('GasStation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'gas_stations',
    timestamps: true
  });

  return GasStation;
};
