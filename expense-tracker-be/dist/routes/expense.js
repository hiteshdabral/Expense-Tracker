"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expense_1 = require("../controllers/expense");
const router = express_1.default.Router();
router.post("/", expense_1.createExpense);
router.get("/:userId", expense_1.getExpenses);
exports.default = router;
//# sourceMappingURL=expense.js.map