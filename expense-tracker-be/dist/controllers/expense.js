"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpenses = exports.createExpense = void 0;
const db_1 = __importDefault(require("../db"));
const redis_1 = require("../utils/redis");
const createExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, description, user_id, category_id, date } = req.body;
        const result = yield db_1.default.query("SELECT id, name FROM categories WHERE id = $1", [category_id]);
        const category = result.rows[0];
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        const data = yield db_1.default.query("INSERT INTO expenses (amount,description,user_id,category_id,date) VALUES ($1,$2,$3,$4,$5) RETURNING *", [amount, description, user_id, category_id, date]);
        const expense = data.rows[0];
        yield (0, redis_1.cacheDelete)(`user_expenses:${user_id}`);
        res.status(201).json({ message: "Expense created successfully", expense });
    }
    catch (error) {
        res.status(500).json("Internal server error");
    }
});
exports.createExpense = createExpense;
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const cachedExpenses = yield (0, redis_1.cacheGet)(`user_expenses:${userId}`);
        if (cachedExpenses) {
            console.log("Returning expenses from cache");
            res.status(200).json(cachedExpenses);
            return;
        }
        const result = yield db_1.default.query("SELECT * FROM expenses WHERE user_id=$1", [
            userId,
        ]);
        yield (0, redis_1.cacheSet)(`user_expenses:${userId}`, result.rows, 3600);
        console.log("Expenses cached and returning from database");
        res.status(200).json(result.rows);
        return;
    }
    catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json("Internal server error");
        return;
    }
});
exports.getExpenses = getExpenses;
//# sourceMappingURL=expense.js.map