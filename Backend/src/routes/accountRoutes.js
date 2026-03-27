import { Router } from "express";
import {
  getAllAccounts,
  getAccountById,
  getAccountByUserId,
  createAccount,
  updateAccountBalance,
  addBalance,
  subtractBalance,
  deleteAccount
} from "../controllers/AccountController.js";

const router = Router();

// Obtener todas las cuentas
router.get("/", getAllAccounts);

// Obtener cuenta por ID
router.get("/:id", getAccountById);

// Obtener cuenta por ID de usuario
router.get("/user/:userId", getAccountByUserId);

// Crear nueva cuenta
router.post("/", createAccount);

// Actualizar saldo (reemplazar)
router.put("/:id", updateAccountBalance);

// Agregar saldo (cargar dinero)
router.post("/:id/add-balance", addBalance);

// Restar saldo (usar dinero)
router.post("/:id/subtract-balance", subtractBalance);

// Eliminar cuenta
router.delete("/:id", deleteAccount);

export default router;
