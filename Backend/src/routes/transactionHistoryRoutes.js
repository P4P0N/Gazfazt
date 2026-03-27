import express from 'express';
import {
  getAllTransactions,
  getTransactionsByUser,
  getTransactionsByDateRange,
  getTransactionSummary,
  getRecentTransactions,
  getTransactionsByAmountRange,
  getTransactionDetail
} from '../controllers/TransactionHistoryController.js';

const router = express.Router();

// Obtener todas las transacciones con paginación
router.get('/all', getAllTransactions);

// Obtener transacciones de un usuario específico
router.get('/user/:userId', getTransactionsByUser);

// Obtener transacciones por rango de fechas
router.get('/date-range', getTransactionsByDateRange);

// Obtener resumen de transacciones
router.get('/summary', getTransactionSummary);

// Obtener transacciones recientes
router.get('/recent', getRecentTransactions);

// Obtener transacciones por rango de monto
router.get('/amount-range', getTransactionsByAmountRange);

// Obtener detalle de una transacción específica (debe ir al final)
router.get('/:transactionId', getTransactionDetail);

export default router;
