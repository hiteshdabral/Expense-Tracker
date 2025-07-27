import { Request, Response, RequestHandler } from "express";
import pool from "../db";
import { cacheGet, cacheSet, cacheDelete } from "../utils/redis";

export const createExpense: RequestHandler = async (req, res, next) => {
  try {
    const { amount, description, user_id, category_id, date } = req.body;
    const result = await pool.query(
      "SELECT id, name FROM categories WHERE id = $1",
      [category_id]
    );
    const category = result.rows[0];

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    const data = await pool.query(
      "INSERT INTO expenses (amount,description,user_id,category_id,date) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [amount, description, user_id, category_id, date]
    );
    const expense = data.rows[0];

    // Invalidate user's expense cache when new expense is added
    await cacheDelete(`user_expenses:${user_id}`);

    res.status(201).json({ message: "Expense created successfully", expense });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // Try to get expenses from cache first
    const cachedExpenses = await cacheGet(`user_expenses:${userId}`);
    if (cachedExpenses) {
      console.log("Returning expenses from cache");
      res.status(200).json(cachedExpenses);
      return;
    }

    // If not in cache, get from database
    const result = await pool.query("SELECT * FROM expenses WHERE user_id=$1", [
      userId,
    ]);

    // Store in cache for 1 hour (3600 seconds)
    await cacheSet(`user_expenses:${userId}`, result.rows, 3600);
    console.log("Expenses cached and returning from database");

    res.status(200).json(result.rows);
    return;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json("Internal server error");
    return;
  }
};
