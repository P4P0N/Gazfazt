export default (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {    
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING, 
      allowNull: false
    },    
    price: {
      type: DataTypes.DECIMAL(10, 2), 
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT, 
      allowNull: true
    },
    cantidad: {
      type: DataTypes.INTEGER, 
      allowNull: false
    }
  }, {
    tableName: 'products',
    timestamps: false
  });
  
  Product.associate = (models) => {
    Product.hasMany(models.Transaction, { foreignKey: 'productId', as: 'transactions' });
  };
  
  return Product;
};