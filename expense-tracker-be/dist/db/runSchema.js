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
const index_1 = __importDefault(require("./index"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function runSchema() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const schemaPath = path_1.default.join(__dirname, '../../src/db/schema.sql');
            const schema = fs_1.default.readFileSync(schemaPath, 'utf-8');
            yield index_1.default.query(schema);
            console.log('Schema has been created successfully!');
        }
        catch (error) {
            console.error('Error running schema:', error);
        }
        finally {
            yield index_1.default.end();
        }
    });
}
runSchema();
//# sourceMappingURL=runSchema.js.map