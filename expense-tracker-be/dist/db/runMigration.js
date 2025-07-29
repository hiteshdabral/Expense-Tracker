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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./index"));
function runMigrations() {
    return __awaiter(this, void 0, void 0, function* () {
        const migrationsDir = path_1.default.join(__dirname, '../../migrations');
        const files = fs_1.default.readdirSync(migrationsDir).sort();
        for (const file of files) {
            const filePath = path_1.default.join(migrationsDir, file);
            const sql = fs_1.default.readFileSync(filePath, 'utf8');
            try {
                console.log(`Running migration: ${file}`);
                yield index_1.default.query(sql);
            }
            catch (error) {
                console.error(`Error in migration ${file}:`, error);
                process.exit(1);
            }
        }
        console.log('✅ All migrations executed');
        yield index_1.default.end();
    });
}
runMigrations();
//# sourceMappingURL=runMigration.js.map