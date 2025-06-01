import express from "express";
import { register, login } from "../controllers/auth"; // Ensure this matches the updated controller file
import {validateLogin,validateRegister} from "../middleware/validate"
const router = express.Router();

router.post("/register",validateRegister, register);
router.post("/login",validateLogin, login);

export default router;