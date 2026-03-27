export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rolId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true
    }   
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'rolId', as: 'role' });
    User.hasMany(models.Vehicle, { foreignKey: 'userId', as: 'vehicles' });
    User.hasOne(models.Account, { foreignKey: 'userId', as: 'account' });
  };

  return User;  
};