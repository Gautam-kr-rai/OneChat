import express from "express";
import { login, register } from "../controllers/authcontroller.js";
// import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;