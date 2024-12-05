import { client } from '../db/init.redis.js';

export const redisServer = {
    setPromise: async ({ key, value }) => {
        try {
            return await client.set(key, value); // Redis client trả về Promise
        } catch (error) {
            console.error("Redis set error:", error);
            throw error; // Để controller xử lý
        }
    },

    getPromise: async (key) => {
        try {
            return await client.get(key); // Redis client trả về Promise
        } catch (error) {
            console.error("Redis get error:", error);
            throw error; // Để controller xử lý
        }
    }
};
