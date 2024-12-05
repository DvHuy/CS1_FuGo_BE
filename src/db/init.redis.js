import { createClient } from 'redis';

export const client = createClient({
    url: process.env.REDIS_URI
});

// Hàm khởi tạo kết nối Redis
const initRedis = async () => {
    try {
        await client.connect();
        console.log(await client.ping()); // Kiểm tra kết nối với Redis
        console.log("Redis client connected URI");
    } catch (error) {
        console.error("Redis connection error:", error);
    }
};

// Xử lý sự kiện lỗi
client.on("error", (error) => {
    console.error("Redis client error:", error);
});

// Khởi tạo kết nối Redis
initRedis();
