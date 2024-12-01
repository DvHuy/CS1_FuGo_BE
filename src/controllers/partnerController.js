
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import JobCV from "../models/JobCV.js";
import Partner from "../models/Partner.js";
import { encrypt, decrypt } from "../security/encryption.js";

export const partnerController = {
    // Get partner by id 
    getPartnerByAccountId : async (req, res) => {
        try {
            const partner = await Partner.findOne(req.params.accountId);
            if (!partner) {
                return res.status(404).json({ success: false, message: "Partner not found" });
            }
            // Decrypt the address field before sending the response
            const decryptedContactPhonePerson = decrypt(partner.contact_phone_person);
            partner.contact_phone_person = decryptedContactPhonePerson;

            return res.status(200).json({data : partner});
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    
    // Get all partner 
    getAllPartner : async (req, res) => {
        try {
            const partners = await Partner.find();
            if (!partners || partners.length === 0) {
                return res.status(404).json({ success: false, message: "No partners found" });
            }
    
            // Decrypt the address field for each user
            const decryptedPartners = partners.map(partner => {
                partner.contact_phone_person = decrypt(partner.contact_phone_person);
                return partner;
            });
            
            return res.status(200).json({data : decryptedPartners});
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    // Delete partner by account_id
    deletePartner : async (req, res) => {
        try {
            const partner = await Partner.findOneAndDelete(req.params.account_id);
            if (!partner) {
                return res.status(404).json({ success: false, message: "Partner not found" });
            }
            return res.status(200).json({ success: true, message: "Delete successfully!" });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // Insert Partner
    insertPartner : async (req, res) => {
        try {
            const { accountId, company_name, contact_person, contact_phone_person } = req.body;
    
            // creating a new partner object
            const partnerData = {
                accountId, 
                company_name, 
                contact_person, 
                contact_phone_person : encrypt(contact_phone_person)
            }

            const partner = new Partner(partnerData);
    
            // saving the new partner
            const savedPartner = await partner.save();
    
            return res.status(200).json({
                success: true, data: savedPartner
            });
        } catch (error) {
            console.error({ success: false, data: error });
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // Update partner
    updatePartner : async (req, res) => {
        try {
            const { company_name, contact_person, contact_phone_person } = req.body;
            // Find the partner by ID
            const partner = await Partner.findOne( req.params.accountId);
            if (!partner) {
               return res.status(404).json({ success: false, message: "Partner not found" });
            }
            // Update the partner's information
            partner.company_name = company_name || partner.company_name;
            partner.contact_person = contact_person || partner.contact_person;
            partner.contact_phone_person = contact_phone_person ? encrypt(contact_phone_person) : partner.contact_phone_person;
            
            // Save the updated partner
            const updatedPartner = await partner.save();

            return res.status(200).json({
               success: true, data: updatedPartner
            });
            
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    //Get the list of posted jobs
    getListPostedJobs: async(req, res) => {
        try { 
            const {partnerId} = req.body;
            const jobs = await Job.find({partnerId: partnerId}, {title: 1, _id: 1});
            return res.status(200).json({success: true, data: jobs});
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    ,
    getListJobCVs: async(req, res) => {        
        try {
            const {jobId} = req.body;
            const jobCVs = await JobCV.find({ jobId: jobId });            
            return res.status(200).json({success: true, data: jobCVs});
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    ,
    getJobDetailCV: async(req, res) => {
        try {
            const {cvId} = req.body;
            const jobCV = await JobCV.findOne({_id: cvId });
            return res.status(200).json({success: true, data: jobCV});
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}