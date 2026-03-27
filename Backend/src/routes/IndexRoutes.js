import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import accountRoutes from './accountRoutes.js';
import rechargeGasRoutes from './rechargeGasRoutes.js';
import transactionHistoryRoutes from './transactionHistoryRoutes.js';

/**
 * Centraliza todas las rutas de la aplicación
 * Cada ruta se registra con su prefijo correspondiente
 */
export const registerRoutes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/accounts', accountRoutes);
  app.use('/api/recharge-gas', rechargeGasRoutes);
  app.use('/api/transactions', transactionHistoryRoutes);
  
  // Puedes agregar más rutas aquí conforme crezca tu app
  // Ejemplo:
  // app.use('/api/products', productRoutes);
};

export default registerRoutes;
