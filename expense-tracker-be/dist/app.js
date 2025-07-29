"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const category_1 = __importDefault(require("./routes/category"));
const expense_1 = __importDefault(require("./routes/expense"));
const transaction_1 = __importDefault(require("./routes/transaction"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("/api/category", category_1.default);
app.use("/api/expense", expense_1.default);
app.use("/api/transactions", transaction_1.default);
app.get("/health", (req, res) => {
    res.send("Backend is live");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
//# sourceMappingURL=app.js.map