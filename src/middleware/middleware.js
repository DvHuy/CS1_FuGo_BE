import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { verify } from "crypto";
import Admin from "../models/Admin.js";
dotenv.config();

// Store request time by accountId
const requestTimestamps = new Map();

export const middlewareController = {
    verifyToken : (req, res, next) => {
        const token1 = req.headers.authorization;
        const token2 = req.headers.token;
        console.log("token1", token1);
        console.log("token2", token2);
        if(token1){
            const accessToken = token1.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, account) => {
                if(err){
                    return res.status(403).json("Token is not valid");
                }
                req.account = account;
                next();
            });
        }else if(token2){
            const accessToken = token2.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, account) => {
                if(err){
                    return res.status(403).json("Token is not valid");
                }
                req.account = account;
                next();
            });
        }
        else{
            return res.status(401).json("You 're not authenticated");
        }
    },

    // Verify token and allow only Admin or Partner to add jobs
    verifyTokenAndAllowJobCreation: (req, res, next) => {
        middlewareController.verifyToken(req, res, async () => {
            const { role } = req.account;

            if (role === "admin" || role === "partner") {
                return next(); 
            }

            return res.status(403).json("Only admins or partners are allowed to add jobs.");
        });
    },

    // Verify token and allow create, update, get user/partner only if admin or the logged-in user 
     verifyTokenAndCreateAndUpdateUserOrPartnerInfo: (req, res, next) => {
        middlewareController.verifyToken(req, res, async () => {
            const loggedInAccountId = req.account.accountId;

            if (req.account.role === "admin") {
                return next(); 
            }

            // If not admin, check if the user is trying to create themselves
            const { accountId } = req.body; // Get accountId from uploaded data
            if (loggedInAccountId === accountId) {
                return next(); 
            }

            return res.status(403).json("You are not allowed to create this user");
        });
    },
    
    // Verify token and admin authentication for get by ID, delete, and update actions for user, partner
    verifyTokenAndAdminAuth : (req, res, next) => {
      middlewareController.verifyToken(req, res, async () => {
         if (req.account.role === 'admin') {
            try {
                const admin = await Admin.findOne({ accountId: req.account.id });

                if (admin && admin.status === 'Activity') {
                    next();
                } else {
                    return res.status(403).json("Admin is inactive or not found");
                }
            } catch (error) {
                return res.status(500).json("Error checking admin status");
            }
        } else if (req.account.id === req.params.id) {
            next();
        } else {
            return res.status(403).json("You are not allowed");
        }
      });
    },

    // Verify token and admin authentication for get by id, deleting and updating admin records
    verifyTokenAndAdminAuth_GetAndDeleteAndUpdateAmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, async () => {
           if (req.account.role === 'admin' && req.account.id === req.params.id) {
              try {
                  const admin = await Admin.findOne({ accountId: req.account.id });
  
                  if (admin && admin.status === 'Activity') {
                      next();
                  } else {
                      return res.status(403).json("Admin is inactive or not found info");
                  }
              } catch (error) {
                  return res.status(500).json("Error checking admin status");
              }
          } else {
            return res.status(403).json("You are not allowed to delete others");
          }
        });
      },

    // verify token and admin auth 
    verifyTokenAndAdminAuth_JustAdmin : (req, res, next) => {
        middlewareController.verifyToken(req, res, async () => {  
            if (req.account.role === "admin") {
                return next(); 
            }
            return res.status(403).json("You are not allowed to create this user");
        });
    },

    // verify token, admin auth and insert info for admin 
    verifyTokenAndAdminAuth_InsertAdmin : (req, res, next) => {
        middlewareController.verifyToken(req, res, async () => {  
            const loggedInAccountId = req.account.accountId;
            const { accountId } = req.body; // Get accountId from the request body

            // Check if the logged-in user is an admin and the accountId matches
            if (req.account.role === "admin" && loggedInAccountId === accountId) {
               return next(); 
            }

            return res.status(403).json("You are not allowed to create this user");
        });
    },

    // Middleware verify token và giới hạn số lần request insert
    verifyTokenAndRateLimitInsert: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            const accountId = req.account.id; 


            // Nếu không có accountId, trả lỗi
            if (!accountId) {
                return res.status(400).json("Account ID is required.");
            }

            const currentTime = Date.now(); 

            // Kiểm tra nếu accountId đã tồn tại trong bộ nhớ
            if (requestTimestamps.has(accountId)) {
                const lastRequestTime = requestTimestamps.get(accountId);

                // Nếu thời gian từ lần request trước < 10 phút
                if (currentTime - lastRequestTime < 10) {
                    return res.status(429).json("You can only insert once every 10 minutes.");
                }
            }

            requestTimestamps.set(accountId, currentTime);
            next();
        });
    },
    
    // Verify token and allow only Admin or Partner to add jobs
    verifyTokenAndAllowJobCreation: (req, res, next) => {
        middlewareController.verifyToken(req, res, async () => {
            const { role } = req.account;

            if (role === "admin" || role === "partner") {
                return next(); 
            }

            return res.status(403).json("Only admins or partners are allowed to add jobs.");
        });
    },
     
  
}
