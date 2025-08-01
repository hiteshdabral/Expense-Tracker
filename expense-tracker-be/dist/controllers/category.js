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
exports.getCategories = exports.createCategory = void 0;
const db_1 = __importDefault(require("../db"));
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, user_id } = req.body;
        const result = yield db_1.default.query("INSERT INTO categories (name,user_id) VALUES ($1,$2) RETURNING *", [name, user_id]);
        const category = result.rows[0];
        res.status(201).json({ message: "Category created successfully", category });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createCategory = createCategory;
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (!userId || isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }
        const result = yield db_1.default.query("SELECT * FROM categories WHERE user_id=$1", [userId]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCategories = getCategories;
//# sourceMappingURL=category.js.map