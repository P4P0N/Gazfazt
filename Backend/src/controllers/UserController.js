import bcrypt from "bcrypt";
import db from "../models/index.js";

const { User } = db;

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, { attributes: { exclude: ["password"] } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { nombre, correo, password, telefono, rolId } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      correo,
      password: hashed,
      telefono,
      rolId,
    });

    const { password: _p, ...rest } = user.toJSON();
    res.status(201).json(rest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, rolId } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar solo los campos permitidos
    if (nombre) user.nombre = nombre;
    if (telefono) user.telefono = telefono;
    if (rolId) user.rolId = rolId;

    await user.save();

    const { password: _p, ...rest } = user.toJSON();
    res.json({
      message: "Usuario actualizado exitosamente",
      user: rest
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "currentPassword y newPassword son requeridos" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar que la contraseña actual es correcta
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "La contraseña actual es incorrecta" });
    }

    // Hashear la nueva contraseña
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar contraseña" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();

    res.json({ 
      message: "Usuario eliminado exitosamente",
      deletedUserId: id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
