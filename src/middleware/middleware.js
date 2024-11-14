
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { verify } from "crypto";
import Admin from "../models/Admin.js";
dotenv.config();

export const middlewareController = {
    /// verify token
    verifyToken : (req, res, next) => {
        const token = req.headers.token;
        if(token){
            const accessToken = token.split(" ")[1];
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
  
}
