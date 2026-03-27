export default (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
        allowNull: false,
        unique: true
    
    } 
  }, {
    tableName: 'states',
    timestamps: false
  });

  State.associate = (models) => {
    State.hasMany(models.Transaction, { foreignKey: 'stateId', as: 'transactions' });
  };

  return State;
};  