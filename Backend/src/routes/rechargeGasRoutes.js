import express from 'express';
import {
  getVehicleByPlacaAndColor,
  getGasolineTypes,
  registerGasRecharge,
  getAllRechargeTransactions,
  getRechargeTransactionsByVehicle,
  getTransactionDetail
} from '../controllers/RechargeGasController.js';

const router = express.Router();

// Búsqueda de vehículo por placa y color
router.post('/search-vehicle', getVehicleByPlacaAndColor);

// Obtener tipos de gasolina disponibles
router.get('/gasoline-types', getGasolineTypes);

// Registrar nueva recarga de gasolina
router.post('/register', registerGasRecharge);

// Obtener todas las transacciones de recarga
router.get('/transactions', getAllRechargeTransactions);

// Obtener transacciones de recarga por vehículo específico
router.get('/transactions/vehicle/:vehicleId', getRechargeTransactionsByVehicle);

// Obtener detalle de una transacción específica
router.get('/transactions/:transactionId', getTransactionDetail);

export default router;
