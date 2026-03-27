import db from "../models/index.js";

const { Vehicle, Transaction, Product, User, State } = db;

// Buscar vehículo por placa y color
export const getVehicleByPlacaAndColor = async (req, res) => {
  try {
    const { placa, color } = req.body;

    if (!placa || !color) {
      return res.status(400).json({ 
        message: "Placa y color son requeridos" 
      });
    }

    const vehicle = await Vehicle.findOne({
      where: { placa, color },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo']
        }
      ]
    });

    if (!vehicle) {
      return res.status(404).json({ 
        message: "Vehículo no encontrado con esa placa y color" 
      });
    }

    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar vehículo" });
  }
};

// Obtener todos los tipos de gasolina (productos)
export const getGasolineTypes = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tipos de gasolina" });
  }
};

// Registrar recarga de gasolina y crear transacción
export const registerGasRecharge = async (req, res) => {
  try {
    const { vehicleId, productId, userId, amount, comision } = req.body;

    // Validar datos requeridos
    if (!vehicleId || !productId || !userId || !amount) {
      return res.status(400).json({ 
        message: "vehicleId, productId, userId y amount son requeridos" 
      });
    }

    // Verificar que el vehículo exista
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }

    // Verificar que el producto (gasolina) exista
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Tipo de gasolina no encontrado" });
    }

    // Verificar que el usuario exista
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtener el estado por defecto (completado)
    let state = await State.findOne({ where: { nombre: 'completada' } });
    if (!state) {
      state = await State.findOne({ where: { nombre: 'completed' } });
    }
    if (!state) {
      // Si no existe, crear un estado por defecto
      state = await State.create({ nombre: 'completada' });
    }

    // Crear la transacción
    const transaction = await Transaction.create({
      amount: parseFloat(amount),
      type: "Recarga de Gasolina",
      userId,
      vehicleId,
      productId: productId,
      comision: parseFloat(comision) || 0,
      stateId: state.id
    });

    // Obtener la transacción con todas sus relaciones
    const transactionWithDetails = await Transaction.findByPk(transaction.id, {
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
      ]
    });

    res.status(201).json({
      message: "Recarga de gasolina registrada exitosamente",
      transaction: transactionWithDetails
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar recarga de gasolina" });
  }
};

// Obtener todas las transacciones de recarga
export const getAllRechargeTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { type: "Recarga de Gasolina" },
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
      order: [['createdAt', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener transacciones" });
  }
};

// Obtener transacciones de recarga por vehículo
export const getRechargeTransactionsByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const transactions = await Transaction.findAll({
      where: { 
        vehicleId,
        type: "Recarga de Gasolina"
      },
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
      order: [['createdAt', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener transacciones del vehículo" });
  }
};

// Obtener detalle de una transacción
export const getTransactionDetail = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findByPk(transactionId, {
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
