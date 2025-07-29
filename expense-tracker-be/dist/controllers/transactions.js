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
exports.addTransaction = exports.getTransactions = void 0;
const db_1 = __importDefault(require("../db"));
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        const result = yield db_1.default.query("SELECT * FROM transactions where user_id=$1 ORDER BY date DESC", [userId]);
        res.json(result.rows);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});
exports.getTransactions = getTransactions;
const addTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, amount, type, date, category_id, user_id } = req.body;
        const result = yield db_1.default.query("INSERT INTO transactions (title, amount,type,date,category_id,user_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *", [title, amount, type, date, category_id, user_id]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});
exports.addTransaction = addTransaction;
//# sourceMappingURL=transactions.js.map