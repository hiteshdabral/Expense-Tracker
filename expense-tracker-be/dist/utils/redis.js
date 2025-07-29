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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheDelete = exports.cacheSet = exports.cacheGet = void 0;
const ioredis_1 = require("ioredis");
const redisClient = new ioredis_1.Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});
redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});
const cacheGet = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }
    catch (error) {
        console.error('Redis Get Error:', error);
        return null;
    }
});
exports.cacheGet = cacheGet;
const cacheSet = (key_1, value_1, ...args_1) => __awaiter(void 0, [key_1, value_1, ...args_1], void 0, function* (key, value, expireInSeconds = 3600) {
    try {
        yield redisClient.setex(key, expireInSeconds, JSON.stringify(value));
        return true;
    }
    catch (error) {
        console.error('Redis Set Error:', error);
        return false;
    }
});
exports.cacheSet = cacheSet;
const cacheDelete = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.del(key);
        return true;
    }
    catch (error) {
        console.error('Redis Delete Error:', error);
        return false;
    }
});
exports.cacheDelete = cacheDelete;
exports.default = redisClient;
//# sourceMappingURL=redis.js.map