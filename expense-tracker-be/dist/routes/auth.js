"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const validate_1 = require("../middleware/validate");
const router = express_1.default.Router();
router.post("/register", validate_1.validateRegister, auth_1.register);
router.post("/login", validate_1.validateLogin, auth_1.login);
exports.default = router;
//# sourceMappingURL=auth.js.map