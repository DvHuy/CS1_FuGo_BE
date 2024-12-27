import bcrypt from 'bcryptjs';
import { sendMail } from "../utils/mailer.js";
import dotenv from 'dotenv';
dotenv.config();

import { encrypt, decrypt } from '../security/encryption.js'; // Import các hàm mã hóa/giải mã
import Account from '../models/Account.js';

export const forgotPasswordController = {
    /// Gửi email thay đổi password
    sendResetLinkEmail : async (req, res) => {
        const {email} = req.body;
        if(!email) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields!!!"
            });
        }else{
            // Mã hóa email trước khi kiểm tra
            let encryptedEmail;
                encryptedEmail = encrypt(email); // Mã hóa email
                const existingAccount = await Account.findOne({ email: encryptedEmail });
                if (existingAccount) {
                    console.log(`http://localhost:5173/forgot-password-step2?email=${email}&token=${encryptedEmail}`);
                    sendMail(email, "Reset Password", `<a href="http://localhost:5173/forgot-password-step2?email=${email}&token=${encryptedEmail}"> Reset Password </a>`);
                    return res.status(200).json("Send email success");
                }
        }
    },

    /// Show from reset password 
    showFormResetPassword : (req, res) => {
        if(!req.query.email || !req.query.token){
            // Đường dẫn về lại trang nhập email
            return res.status(200).json("fail");
        }else{
            return res.status(200).json("success");
        }
    },

    /// Reset password
    resetPassword : async (req, res) => {
        const {email, token, password} = req.body;
        console.log(email , token, password);

        if(!email || !token || !password){
            return res.status(400).json({
                success: false,
                message: "Missing required fields!!!"
            });
        }else{
            if(email == decrypt(token)){
                console.log('compare : true');
                // Find the user by ID
                const account = await Account.findOne({email : token});
                if (!account) {
                    return res.status(404).json({ success: false, message: "User not found" });
                }

                // Hash mật khẩu
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Update the user's information
                account.password = hashedPassword || account.password;

                // Save the updated user
                const updatedAccount = await account.save();
                return res.status(200).json({
                    success: true, data: updatedAccount
                });
            }else{
                return res.status(401).json("Verify reset password fail !!!");
            }
        }
    }
} 