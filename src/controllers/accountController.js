import Account from "../models/Account.js";

export const accountController = {
    // Get all account 
    getAllAccount : async (req, res) => {
        try {
            const account = await Account.find();
            return res.status(200).json({data : account});
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    // Delete account
    deleteAccount : async (req, res) => {
        try {
            const account = await Account.findByIdAndDelete(req.params.id);
            return res.status(200).json("Delete successfully!");
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}
