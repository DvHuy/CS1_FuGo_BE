import User from "../models/User.js";
import { decrypt, encrypt } from "../security/encryption.js";


export const userController = {
    // Get user by id 
    getUserByAccountId : async (req, res) => {
        try {
            const user = await User.findOne(req.params.accountId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            // Decrypt the address field before sending the response
            const decryptedAddress = decrypt(user.address);
            const decryptedUserImage = decrypt(user.user_img);
            user.address = decryptedAddress;
            user.user_img = decryptedUserImage;

            return res.status(200).json({data : user});
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    
    // Get all user 
    getAllUser : async (req, res) => {
        try {
            const users = await User.find();
            if (!users || users.length === 0) {
                return res.status(404).json({ success: false, message: "No users found" });
            }
    
            // Decrypt the address field for each user
            const decryptedUsers = users.map(user => {
                user.address = decrypt(user.address);
                user.user_img = decrypt(user.user_img);
                return user;
            });
            
            return res.status(200).json({data : decryptedUsers});
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    // Delete user by account_id
    deleteUser : async (req, res) => {
        try {
            const user = await User.findOneAndDelete(req.params.account_id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            return res.status(200).json({ success: true, message: "Delete successfully!" });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // Insert User
    insertUser : async (req, res) => {
        try {
            const { accountId, username, birthday, gender, status_to_go, country, address, height, weight, user_img } = req.body;
    
            // creating a new User object
            const userData = {
                accountId, 
                username, 
                birthday, 
                gender, 
                status_to_go, 
                country, 
                address : encrypt(address), 
                height, 
                weight, 
                user_img : encrypt(user_img)
            }

            const user = new User(userData);
    
            // saving the new User
            const savedUser = await user.save();
    
            return res.status(200).json({
                success: true, data: savedUser
            });
        } catch (error) {
            console.error({ success: false, data: error });
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // Update user 
    updateUser : async (req, res) => {
        try {
            const { username, birthday, gender, status_to_go, country, address, height, weight } = req.body;
            // Find the user by ID
            const user = await User.findOne( req.params.accountId);
            if (!user) {
               return res.status(404).json({ success: false, message: "User not found" });
            }
            // Update the user's information
            user.username = username || user.username;
            user.birthday = birthday || user.birthday;
            user.gender = gender || user.gender;
            user.status_to_go = status_to_go || user.status_to_go;
            user.country = country || user.country;
            user.address = address ? encrypt(address) : user.address;  // Encrypting address if provided
            user.height = height || user.height;
            user.weight = weight || user.weight;
            // Save the updated user
            const updatedUser = await user.save();
            return res.status(200).json({
               success: true, data: updatedUser
            });
            
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}