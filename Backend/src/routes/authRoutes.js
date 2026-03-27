import { Router } from 'express';
import { 
  registerUser, 
  registerEmployee, 
  login, 
  getProfile, 
  getAvailableRoles 
} from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas públicas
router.post('/register/usuario', registerUser);
router.post('/register/empleado', registerEmployee);
router.post('/login', login);
router.get('/roles', getAvailableRoles);

// Rutas protegidas
router.get('/perfil', authMiddleware, getProfile);

export default router;
