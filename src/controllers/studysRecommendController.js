import StudysRecommend from "../models/StudysRecommend.js";
import { redisServer } from '../services/redis.service.js'
import axios from "axios";

export const StudysRecommendController = {
    // Get job recommend by id 
    getStudysRecommend : async (req, res) => {
        try {
            const { account_id } = req.body;
            // Tạo key Redis sử dụng account_id
            const redisKey = `recommendStudy:${account_id}`;
            console.log("Redis Key:", redisKey);

            const studysRecommend = await redisServer.getPromise(redisKey);
            console.log("studys", studysRecommend);

            return res.status(200).json({
                success: true,
                data: studysRecommend
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    
    // Insert Jobs Recommend
    insertStudysRecommend : async (req, res) => {
        try {
            const { selected_studys, user_profile } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!selected_studys || !Array.isArray(selected_studys) || selected_studys.length === 0) {
                return res.status(400).json({ success: false, message: "Selected jobs data is missing or invalid" });
            }

            if (!user_profile || !Array.isArray(user_profile) || user_profile.length === 0) {
                return res.status(400).json({ success: false, message: "User profile data is missing or invalid" });
            }

            console.log("Selected studys:", selected_studys);
            console.log("User profile:", user_profile);

            // Gửi dữ liệu đến API khác
            const response = await axios.post('http://127.0.0.1:6000/api/recommend/studys', {
                selected_studys,
                user_profile
            });

            // Chờ API xử lý xong và trả về kết quả
            const recommendData = response.data;

            // Lấy account_id từ recommendData
            const extractedAccountId = recommendData.account_id;
            console.log("Extracted Account ID:", extractedAccountId);
            
            // Tạo key Redis sử dụng account_id
            const redisKey = `recommendStudy:${extractedAccountId}`;
            console.log("Redis Key:", redisKey);

            await redisServer.setPromise({
                key: redisKey,
                value : JSON.stringify(recommendData)
            });

            return res.status(200).json({
                success: true,
                data: recommendData
            });
        } catch (error) {
            console.error("Error occurred:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

}