import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, updatePassword, deleteUser } from "../controllers/UserController.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.put("/:id/password", updatePassword);
router.delete("/:id", deleteUser);

export default router;
