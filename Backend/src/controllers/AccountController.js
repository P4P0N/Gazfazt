import db from "../models/index.js";

const { Account, User } = db;

/**
 * Obtener todas las cuentas con paginación
 */
export const getAllAccounts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Account.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
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
      accounts: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener cuentas" });
  }
};

/**
 * Obtener cuenta por ID
 */
export const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        }
      ]
    });

    if (!account) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener cuenta" });
  }
};

/**
 * Obtener cuenta por ID de usuario
 */
export const getAccountByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const account = await Account.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        }
      ]
    });

    if (!account) {
      return res.status(404).json({ message: "Cuenta no encontrada para este usuario" });
    }

    res.json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener cuenta del usuario" });
  }
};

/**
 * Crear nueva cuenta para un usuario
 */
export const createAccount = async (req, res) => {
  try {
    const { userId, saldo = 0 } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId es requerido" });
    }

    // Verificar que el usuario exista
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el usuario ya tiene una cuenta
    const existingAccount = await Account.findOne({ where: { userId } });
    if (existingAccount) {
      return res.status(409).json({ message: "El usuario ya tiene una cuenta" });
    }

    // Crear la cuenta
    const account = await Account.create({
      userId,
      saldo: parseFloat(saldo)
    });

    // Obtener la cuenta con relaciones
    const accountWithUser = await Account.findByPk(account.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        }
      ]
    });

    res.status(201).json({
      message: "Cuenta creada exitosamente",
      account: accountWithUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear cuenta", error: error.message });
  }
};

/**
 * Actualizar saldo de una cuenta
 */
export const updateAccountBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { saldo } = req.body;

    if (saldo === undefined || saldo === null) {
      return res.status(400).json({ message: "El campo 'saldo' es requerido" });
    }

    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    await account.update({ saldo: parseFloat(saldo) });

    const updatedAccount = await Account.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        }
      ]
    });

    res.json({
      message: "Saldo actualizado exitosamente",
      account: updatedAccount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar saldo", error: error.message });
  }
};

/**
 * Incrementar saldo de una cuenta (cargar saldo)
 */
export const addBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "El monto debe ser mayor a 0" });
    }

    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    const newBalance = parseFloat(account.saldo) + parseFloat(amount);
    await account.update({ saldo: newBalance });

    const updatedAccount = await Account.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        }
      ]
    });

    res.json({
      message: "Saldo incrementado exitosamente",
      amountAdded: parseFloat(amount),
      previousBalance: parseFloat(account.saldo),
      newBalance,
      account: updatedAccount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al incrementar saldo", error: error.message });
  }
};

/**
 * Restar saldo de una cuenta
 */
export const subtractBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "El monto debe ser mayor a 0" });
    }

    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    const currentBalance = parseFloat(account.saldo);
    if (currentBalance < parseFloat(amount)) {
      return res.status(400).json({ 
        message: "Saldo insuficiente",
        currentBalance,
        requestedAmount: parseFloat(amount)
      });
    }

    const newBalance = currentBalance - parseFloat(amount);
    await account.update({ saldo: newBalance });

    const updatedAccount = await Account.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nombre', 'correo', 'telefono']
        }
      ]
    });

    res.json({
      message: "Saldo reducido exitosamente",
      amountSubtracted: parseFloat(amount),
      previousBalance: currentBalance,
      newBalance,
      account: updatedAccount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al restar saldo", error: error.message });
  }
};

/**
 * Eliminar una cuenta
 */
export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await Account.findByPk(id);
    if (!account) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    await account.destroy();

    res.json({
      message: "Cuenta eliminada exitosamente",
      deletedAccountId: id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar cuenta", error: error.message });
  }
};
