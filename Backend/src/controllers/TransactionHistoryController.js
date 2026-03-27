import db from "../models/index.js";
import { Op } from "sequelize";

const { Transaction, User, Vehicle, Product, State } = db;

// Obtener todas las transacciones con paginación
export const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'marca', 'placa', 'color']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'description']
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'nombre']
        }
      ],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      perPage: parseInt(limit),
      transactions: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener transacciones" });
  }
};

// Obtener transacciones de un usuario específico
export const getTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, type } = req.query;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const offset = (page - 1) * limit;
    const where = { userId };
    
    if (type) {
      where.type = type;
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'marca', 'placa', 'color']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'description']
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      perPage: parseInt(limit),
      user: { id: user.id, nombre: user.nombre, correo: user.correo },
      transactions: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener transacciones del usuario" });
  }
};

// Obtener transacciones por rango de fechas
export const getTransactionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: "Los parámetros 'startDate' y 'endDate' son requeridos (formato: YYYY-MM-DD)" 
      });
    }

    const offset = (page - 1) * limit;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const { count, rows } = await Transaction.findAndCountAll({
      where: {
        createdAt: {
          [Op.between]: [start, end]
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'marca', 'placa', 'color']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'description']
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      perPage: parseInt(limit),
      dateRange: { startDate, endDate },
      transactions: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener transacciones por fecha" });
  }
};

// Obtener resumen de transacciones (ingresos, pagos, comisiones)
export const getTransactionSummary = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    let where = {};
    if (userId) {
      where.userId = userId;
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt = {
        [Op.between]: [start, end]
      };
    }

    // Obtener datos de la base de datos
    const transactions = await Transaction.findAll({
      where,
      raw: true
    });

    // Calcular totales
    const summary = {
      totalTransactions: transactions.length,
      totalAmount: 0,
      totalComision: 0
    };

    transactions.forEach(transaction => {
      summary.totalAmount += parseFloat(transaction.amount);
      summary.totalComision += parseFloat(transaction.comision);
    });

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener resumen de transacciones" });
  }
};

// Obtener transacciones recientes (últimas N)
export const getRecentTransactions = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const transactions = await Transaction.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'marca', 'placa', 'color']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'description']
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      count: transactions.length,
      limit: parseInt(limit),
      transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener transacciones recientes" });
  }
};

// Obtener transacciones por rango de monto
export const getTransactionsByAmountRange = async (req, res) => {
  try {
    const { minAmount, maxAmount, page = 1, limit = 10 } = req.query;

    if (!minAmount || !maxAmount) {
      return res.status(400).json({ 
        message: "Los parámetros 'minAmount' y 'maxAmount' son requeridos" 
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Transaction.findAndCountAll({
      where: {
        amount: {
          [Op.between]: [parseFloat(minAmount), parseFloat(maxAmount)]
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'marca', 'placa', 'color']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'description']
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'nombre']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      perPage: parseInt(limit),
      amountRange: { min: minAmount, max: maxAmount },
      transactions: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener transacciones por rango de monto" });
  }
};

// Obtener detalle de una transacción específica
export const getTransactionDetail = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findByPk(transactionId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'marca', 'placa', 'color']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'description']
        },
        {
          model: State,
          as: 'state',
          attributes: ['id', 'nombre']
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transacción no encontrada" });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener detalle de transacción" });
  }
};

// Obtener conteo de transacciones por tipo

