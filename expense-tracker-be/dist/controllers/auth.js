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
exports.login = exports.register = void 0;
const db_1 = __importDefault(require("../db"));
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existing = yield db_1.default.query("SELECT * FROM users WHERE email=$1", [email]);
        if (existing.rows.length > 0) {
            res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield (0, hash_1.hashPassword)(password);
        const result = yield db_1.default.query("INSERT INTO users (name,email,password) values ($1,$2,$3) RETURNING id,name,email", [name, email, hashedPassword]);
        const user = result.rows[0];
        const token = (0, jwt_1.generateToken)({ id: user.id });
        res.status(201).json({ user, token });
    }
    catch (err) {
        if (err.code) {
            res.status(409).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield db_1.default.query("SELECT * FROM users WHERE email=$1", [email]);
        const user = result.rows[0];
        if (!user) {
            res.status(404).json({ message: "User not found with this email" });
        }
        const match = yield (0, hash_1.comparePassword)(password, user.password);
        if (!match) {
            res.status(400).json({ message: "Invalid credentials" });
        }
        const token = yield (0, jwt_1.generateToken)({ id: user.id });
        res.json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
//# sourceMappingURL=auth.js.map