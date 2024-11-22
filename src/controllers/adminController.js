import Admin from "../models/Admin.js";

export const adminController = {
    // Get user by id 
    getAdminByAccountId : async (req, res) => {
        try {
            const admin = await Admin.findOne(req.params.accountId);
            if (!admin) {
                return res.status(404).json({ success: false, message: "Admin not found" });
            }
            return res.status(200).json({data : admin});
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    
    // Delete admin by account_id
    deleteAdmin : async (req, res) => {
        try {
            const admin = await Admin.findOneAndDelete(req.params.account_id);
            if (!admin) {
                return res.status(404).json({ success: false, message: "Admin not found" });
            }
            return res.status(200).json({ success: true, message: "Delete successfully!" });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // Create Admin
    createAdmin : async (req, res) => {
        try {
            const { accountId, full_name, status, last_login } = req.body;
    
            // creating a new admin object
            const adminData = {
                accountId, 
                full_name, 
                status, 
                last_login
            }

            const admin = new Admin(adminData);
    
            // saving the new News
            const savedAdmin = await admin.save();
    
            return res.status(200).json({
                success: true, data: savedAdmin
            });
        } catch (error) {
            console.error({ success: false, data: error });
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // Update admin 
    updateAdmin : async (req, res) => {
        try {
            const { accountId, full_name, status, last_login } = req.body;
            // Find the admin by ID
            const admin = await Admin.findOne(req.params.accountId);
            if (!admin) {
               return res.status(404).json({ success: false, message: "Admin not found" });
            }
            // Update the admin's information
            admin.full_name = full_name || admin.full_name;
            admin.status = status || admin.status;
            admin.last_login = last_login || admin.last_login;
            
            // Save the updated user
            const updatedAdmin = await admin.save();
            return res.status(200).json({
               success: true, data: updatedAdmin
            });
            
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}