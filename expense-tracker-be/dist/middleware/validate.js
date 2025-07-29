"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegister = void 0;
const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ message: "Name Email & Password are required" });
        return;
    }
    if (typeof email !== "string" || !email.includes("@")) {
        res.status(400).json({ message: "Invalid email format" });
        return;
    }
    if (password.length < 6) {
        res
            .status(400)
            .json({ message: "Password must be at least 6 characters" });
        return;
    }
    next();
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Email & Password are required" });
        return;
    }
    if (typeof email !== "string" || !email.includes("@")) {
        res.status(400).json({ message: "Invalid email format" });
        return;
    }
    next();
};
exports.validateLogin = validateLogin;
//# sourceMappingURL=validate.js.map