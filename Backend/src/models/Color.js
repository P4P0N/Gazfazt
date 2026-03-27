export default (sequelize, DataTypes) => {
  const Color = sequelize.define('Color', {
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
    tableName: 'colors',
    timestamps: false
  });

  return Color;
};
