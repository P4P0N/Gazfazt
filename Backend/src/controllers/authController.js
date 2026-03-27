import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../models/index.js';

const { User, Role } = models;

// Función auxiliar para validar contraseña
const validatePassword = (password) => {
  const errors = [];
  
  if (typeof password !== 'string' || password.trim().length === 0) {
    errors.push('La contraseña es requerida');
  } else {
    if (password.trim().length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial (!@#$%^&*)');
    }
  }
  
  return errors;
};

// Función auxiliar para validar email
const validateEmail = (correo) => {
  return typeof correo === 'string' && correo.includes('@');
};

/**
 * Registrar usuario con rol 'usuario'
 */
export const registerUser = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    // Validaciones básicas
    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'nombre, correo y password son requeridos' });
    }

    if (!validateEmail(correo)) {
      return res.status(400).json({ message: 'El correo no es válido' });
    }

    // Verificar usuario existente
    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está en uso' });
    }

    // Validar contraseña
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ message: passwordErrors.join('; ') });
    }

    // Buscar rol 'usuario'
    const role = await Role.findOne({ where: { nombre: 'usuario' } });
    if (!role) {
      return res.status(500).json({ message: "Rol 'usuario' no encontrado. Por favor crea los roles en la BD" });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      nombre,
      correo,
      password: hashedPassword,
      rolId: role.id
    });

    // Obtener usuario con rol incluido
    const userWithRole = await User.findOne({
      where: { id: newUser.id },
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['password'] }
    });

    // Generar token JWT
    const jwtSecret = process.env.JWT_SECRET || 'secret-key-change-in-production';
    const token = jwt.sign(
      { id: newUser.id, correo: newUser.correo, role: 'usuario' },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      user: userWithRole
    });
  } catch (error) {
    console.error('registerUser error:', error);
    return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

/**
 * Registrar empleado con rol 'empleado'
 */
export const registerEmployee = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    // Validaciones básicas
    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'nombre, correo y password son requeridos' });
    }

    if (!validateEmail(correo)) {
      return res.status(400).json({ message: 'El correo no es válido' });
    }

    // Verificar correo existente
    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está en uso' });
    }

    // Validar contraseña
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ message: passwordErrors.join('; ') });
    }

    // Buscar rol 'empleado'
    const role = await Role.findOne({ where: { nombre: 'empleado' } });
    if (!role) {
      return res.status(500).json({ message: "Rol 'empleado' no encontrado. Por favor crea los roles en la BD" });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear empleado
    const newEmployee = await User.create({
      nombre,
      correo,
      password: hashedPassword,
      rolId: role.id
    });

    // Obtener empleado con rol incluido
    const employeeWithRole = await User.findOne({
      where: { id: newEmployee.id },
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['password'] }
    });

    // Generar token JWT
    const jwtSecret = process.env.JWT_SECRET || 'secret-key-change-in-production';
    const token = jwt.sign(
      { id: newEmployee.id, correo: newEmployee.correo, role: 'empleado' },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Empleado registrado con éxito',
      token,
      user: employeeWithRole
    });
  } catch (error) {
    console.error('registerEmployee error:', error);
    return res.status(500).json({ message: 'Error al registrar empleado', error: error.message });
  }
};

/**
 * Login para ambos roles (usuario y empleado)
 */
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validaciones básicas
    if (!correo || !password) {
      return res.status(400).json({ message: 'correo y password son requeridos' });
    }

    // Buscar usuario por correo e incluir role
    const user = await User.findOne({
      where: { correo },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Preparar payload para el token
    const roleName = user.role ? user.role.nombre : null;
    const payload = { id: user.id, correo: user.correo, role: roleName };

    // Firmar JWT
    const jwtSecret = process.env.JWT_SECRET || 'secret-key-change-in-production';
    if (!process.env.JWT_SECRET) {
      console.warn('ADVERTENCIA: JWT_SECRET no está definido en .env, usando clave por defecto. NO usar en producción!');
    }
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

    // Preparar usuario seguro para respuesta (sin password)
    const userSafe = user.toJSON ? user.toJSON() : { ...user };
    delete userSafe.password;

    return res.json({
      message: 'Autenticado',
      token,
      user: userSafe
    });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({ message: 'Error en login', error: error.message });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({
      where: { id: userId },
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(user);
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

/**
 * Obtener todos los roles disponibles (endpoint público o protegido)
 */
export const getAvailableRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      order: [['id', 'ASC']],
      attributes: ['id', 'nombre']
    });
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error en getAvailableRoles:', error);
    res.status(500).json({ message: 'Error al obtener roles', error: error.message });
  }
};
