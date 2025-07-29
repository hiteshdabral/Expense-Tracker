"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactions_1 = require("../controllers/transactions");
const router = express_1.default.Router();
router.get("/", transactions_1.getTransactions);
router.post("/", transactions_1.addTransaction);
exports.default = router;
//# sourceMappingURL=transaction.js.map