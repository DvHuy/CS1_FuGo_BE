import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendMail } from "../utils/mailer.js";
import dotenv from 'dotenv';
dotenv.config();

import { encrypt, decrypt } from '../security/encryption.js'; // Import các hàm mã hóa/giải mã
import Account from '../models/Account.js';

let refreshTokens = [];

export const authController = {
    registerAccount: async (req, res) => {
        try {
            const { email, phone, password, role } = req.body;


            // Kiểm tra nếu cả email và phone đều bị thiếu
            if (!email && !phone) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Either email or phone is required" 
                });
            }

            // Mã hóa email trước khi kiểm tra
            let encryptedEmail;
            if (email) {
                encryptedEmail = encrypt(email); // Mã hóa email
                const existingAccount = await Account.findOne({ email: encryptedEmail });
                if(existingAccount && isNaN(existingAccount.verify)){
                    return res.status(400).json({ 
                        success: false, 
                        message: "Email already exists. Please verify in email !!! " 
                    });
                }
                else if (existingAccount) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "Email already exists" 
                    });
                }
            }

            // Mã hóa phone trước khi kiểm tra
            let encryptedPhone;
            if (phone) {
                encryptedPhone = encrypt(phone); // Mã hóa phone
                const existingAccount = await Account.findOne({ phone: encryptedPhone });
                if (existingAccount) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "Phone number already exists" 
                    });
                }
            }

            // Hash mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Tạo một đối tượng Account mới với các giá trị không null
            const accountData = {
                password: hashedPassword,
                role: role
            };

            // Gán email và phone đã mã hóa vào tài khoản
            if (email) accountData.email = encryptedEmail;
            if (phone) accountData.phone = encryptedPhone;

            // Tạo một đối tượng Account mới
            const account = new Account(accountData);

            // Lưu tài khoản mới vào database
            const savedAccount = await account.save();

            console.log(`{process.env.APP_URL}/api/v1/auth/verify?email=${email}&token=${encryptedEmail}`);
            sendMail(email, "Verify Email", `<a href="${process.env.APP_URL}/api/v1/auth/verify?email=${email}&token=${encryptedEmail}"> Verify </a>`);

            return res.status(200).json({
                success: true, 
                data: savedAccount
            });
        } catch (error) {
            console.error({ success: false, data: error });
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    /// Verify
    verify: async (req, res) => {
        console.log("1");
        if(req.query.email === decrypt(req.query.token)){
            console.log("2");
            const account = await Account.findOne({ email: encrypt(req.query.email)});
            if(account){
                account.verify = new Date();
                // Save the updated user
                console.log("3");
                const updatedAccount = await account.save();
                return res.status(200).json({
                    success : true, 
                    data : updatedAccount
                });
            }else{
                return res.status(500).json("ERROR UPDATE VERIFY!!!");
            }
        }else{
            return res.status(404).json("VERIFY FAIL!!!");
        }
    },

    /// Generate access token 
    generateAccessToken : (account) => {
        return jwt.sign({
            id : account.id,
            role : account.role
            }, 
            process.env.JWT_ACCESS_KEY,
           {expiresIn : "600s"}
        );
    },

    /// Generate access token 
    generateRefreshToken : (account) => {
        return jwt.sign({
            id : account.id,
            role : account.role
            }, 
            process.env.JWT_REFRESH_KEY,
           {expiresIn : "365d"}
        );
    },

    // Login 
    loginAccount : async(req,res) => {
        try {
            const { email, phone, password, Role } = req.body;

            // Kiểm tra nếu cả email và phone đều bị thiếu
            if (!email && !phone) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Either email or phone is required" 
                });
            }


            /// email 
            let encryptedEmail;
            if(email){
                encryptedEmail = encrypt(email);
                const account = await Account.findOne({email : encryptedEmail}) 
                if(!account){
                    return res.status(404).json("wrong account");
                }
                const validPassword = await bcrypt.compare(
                    req.body.password,
                    account.password
                )
                if(!validPassword){
                    return res.status(404).json("wrong password or email")
                }

                if(account && validPassword){
                    // accessToken 
                    const accessToken = authController.generateAccessToken(account);

                    // refreshToken
                    const refreshToken = authController.generateRefreshToken(account);
                    refreshTokens.push(refreshToken);

                    const {password, ...others} = account._doc;
                    
                    // cookies
                    res.cookie("refreshToken", refreshToken, {
                       httpOnly : true,
                       secure : false,
                       path : "/",
                       sameSite : "strict",
                    })
                    /// ??
                    return res.status(200).json({data : others, accessToken: accessToken});
                }
            }

            /// phone 
            let encryptedPhone;
            if(phone){
                encryptedPhone = encrypt(phone);
                const account = await Account.findOne({phone : encryptedPhone}) 
                if(!account){
                    return res.status(404).json("wrong account");
                }
                const validPassword = await bcrypt.compare(
                    req.body.password,
                    account.password
                )

                if(!validPassword){
                    return res.status(404).json("wrong password or phone number")
                }

                if(account && validPassword){
                    const accessToken = authController.generateAccessToken(account);

                    // refreshToken
                    const refreshToken = authController.generateRefreshToken(account);
                    refreshTokens.push(refreshToken);

                    // cookies
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly : true,
                        secure : false,
                        path : "/",
                        sameSite : "strict",
                     })

                    const {password, ...others} = account._doc;
                    return res.status(200).json({data : others, accessToken: accessToken});
                }
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    //Refresh token 
    requestRefreshToken : async(req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json("You are not authenticated");
        }
        if(!refreshTokens.includes(refreshToken)){
            return res.status(403).json("Refresh token is not vaild");
        }else{
            jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (error, account) => {
               if(error){
                console.log(error);
               }
               refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
               // create new token 
               const newAccessToken = authController.generateAccessToken(account);
               const newRefreshToken = authController.generateRefreshToken(account);
               refreshTokens.push(refreshToken);
               // cookies
               res.cookie("refreshToken", newRefreshToken, {
                httpOnly : true,
                secure : false,
                path : "/",
                sameSite : "strict",
                });
                return res.status(200).json({accessToken : newAccessToken});
            });
        }
    },
    
    // LOG OUT
    logoutAccount : (req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
        return res.status(200).json("Logged out!");
    }
};
