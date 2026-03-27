import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    // El token viene en formato: Bearer <token>
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    const jwtSecret = process.env.JWT_SECRET || 'secret-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret);

    // Guardar la información del usuario en req.user para usar en las rutas
    req.user = decoded;
    next();
  } catch (error) {
    console.error('authMiddleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }

    return res.status(401).json({ message: 'Error en autenticación', error: error.message });
  }
};

export default authMiddleware;
