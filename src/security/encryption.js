import crypto from 'crypto';

// Khóa bí mật cố định (cần đảm bảo đủ 32 bytes cho AES-256)
const secretKey = crypto.createHash('sha256').update('my_secret_key').digest();

// Hàm mã hóa (AES-256-ECB)
export const encrypt = (text) => {
    const cipher = crypto.createCipheriv('aes-256-ecb', secretKey, null); // ECB không dùng IV
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// Hàm giải mã (AES-256-ECB)
export const decrypt = (encryptedData) => {
    const decipher = crypto.createDecipheriv('aes-256-ecb', secretKey, null); // ECB không dùng IV
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};