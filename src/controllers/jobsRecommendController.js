import JobsRecommend from "../models/JobsRecommend.js";
import { redisServer } from '../services/redis.service.js'
import axios from "axios";

export const JobsRecommendController = {
    // Get partner by id 
    getJobsRecommend : async (req, res) => {
        try {
            const accountId = req.params.accountId;
            // Tạo key Redis sử dụng account_id
            const redisKey = `recommendJob:${accountId}`;
            console.log("Redis Key:", redisKey);

            const jobsRecommend = await redisServer.getPromise(redisKey);
            console.log("jos", jobsRecommend);

            return res.status(200).json({
                jobsRecommend
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    
    // Insert Partner
    insertJobsRecommend : async (req, res) => {
        try {
            const { selected_jobs, user_profile } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!selected_jobs || !Array.isArray(selected_jobs) || selected_jobs.length === 0) {
                return res.status(400).json({ success: false, message: "Selected jobs data is missing or invalid" });
            }

            if (!user_profile || !Array.isArray(user_profile) || user_profile.length === 0) {
                return res.status(400).json({ success: false, message: "User profile data is missing or invalid" });
            }

            console.log("Selected jobs:", selected_jobs);
            console.log("User profile:", user_profile);

            // Gửi dữ liệu đến API khác
            const response = await axios.post('http://127.0.0.1:5000/api/recommend/jobs', {
                selected_jobs,
                user_profile
            });

            // Chờ API xử lý xong và trả về kết quả
            const recommendData = response.data;

            // Lấy account_id từ recommendData
            const extractedAccountId = recommendData.accountId;
            console.log("Extracted Account ID:", extractedAccountId);
            
            // Tạo key Redis sử dụng account_id
            const redisKey = `recommendJob:${extractedAccountId}`;
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