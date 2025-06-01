import { Request, Response, NextFunction } from "express";
import pool from "../db";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { User } from "../types/user";

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (existing.rows.length > 0) {
      res.status(400).json({ message: "User already exists" });
      return
    }
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      "INSERT INTO users (name,email,password) values ($1,$2,$3) RETURNING id,name,email",
      [name, email, hashedPassword]
    );
    const user = result.rows[0];
    const token = generateToken({ id: user.id });
    res.status(201).json({ user, token });
    return
  } catch (err: any) {
    if (err.code===409) {
      res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user: User = result.rows[0];
    if (!user) {
      res.status(404).json({ message: "User not found with this email" });
      return
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const token = await generateToken({ id: user.id });
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
    return;
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { register, login };