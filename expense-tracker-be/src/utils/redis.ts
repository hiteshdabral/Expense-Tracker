import { Redis } from 'ioredis';

// const redisClient = new Redis({
//     host: process.env.REDIS_HOST || 'localhost',
//     port: Number(process.env.REDIS_PORT) || 6379,
//     password: process.env.REDIS_PASSWORD,
// });

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});

// Utility functions for caching
export const cacheGet = async (key: string) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis Get Error:', error);
        return null;
    }
};

export const cacheSet = async (key: string, value: any, expireInSeconds = 3600) => {
    try {
        await redisClient.setex(key, expireInSeconds, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Redis Set Error:', error);
        return false;
    }
};

export const cacheDelete = async (key: string) => {
    try {
        await redisClient.del(key);
        return true;
    } catch (error) {
        console.error('Redis Delete Error:', error);
        return false;
    }
};

export default redisClient;
