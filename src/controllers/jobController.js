import multer from "multer";
import Job from "../models/Job.js";
import JobCV from "../models/JobCV.js";
import JobApplication from "../models/JobApplication.js";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/uploadCV");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

export const applyJobCV = async (req, res) => {
  try {
    const {
      jobId,
      accountId,
      fullName,
      gender,
      phone,
      email,
      language,
      education,
      bio,
    } = req.body;
    console.log(req.body);


    const newJobCV = new JobCV({
      jobId: jobId,
      accountId: accountId,
      fullName: fullName,
      gender: gender,
      phone: phone,
      email: email,
      language: language,
      education: education,
      bio: bio,
      cv_img: req.file ? req.file.filename : "",
    });
    
    await newJobCV.save();
    
    const newJobApplication = new JobApplication({
      job_cv_id: newJobCV._id,
    });
    await newJobApplication.save();

    return res.status(200).json({
      success: true,
      message: "Job application submitted successfully!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const jobController = {
  getSingleJob: async (req, res) => {
    const id = req.params.id;
    try {
      const job = await Job.findById(id);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "No job found",
      });
    }
  },

  //Searching Job
  getJobBySearch: async (req, res) => {
    // Điều kiện tìm kiếm động, chỉ thêm nếu người dùng có nhập giá trị
    const searchConditions = {};
    const {
      title,
      country,
      minSalary,
      maxSalary,
      educationalLevel,
      profession,
      experience,
    } = req.body;
    if (title) {
      searchConditions.title = new RegExp(title, "i");
    }
    if (country) {
      searchConditions.country = new RegExp(country, "i");
    }
    if (minSalary) {
      searchConditions.minSalary = {
        $gte: parseInt(minSalary),
      };
    }
    if (maxSalary) {
      searchConditions.maxSalary = {
        $lte: parseInt(maxSalary),
      };
    }
    if (profession) {
      searchConditions.profession = new RegExp(profession, "i");
    }
    if (educationalLevel) {
      searchConditions.educationalLevel = new RegExp(educationalLevel, "i");
    }
    if (experience) {
      searchConditions.experience = {
        $eq: parseInt(experience),
      };
    }
    try {
      const jobs = await Job.find(searchConditions);

      res.status(200).json({
        success: true,
        message: "Search success",
        data: jobs,
      });
    } catch (err) {
      res.status(404).json({
        success: false,
        message: "No jobs found",
      });
    }
  },
  getAllJobs: async (req, res) => {
    const page = parseInt(req.query.page);
    try {
      const jobs = await Job.find({})
        .skip(page * 8)
        .limit(8);

      const jobCount = await Job.estimatedDocumentCount();
      res.status(200).json({
        success: true,
        count: jobs.length,
        jobCount: jobCount,
        message: "Successfull",
        data: jobs,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
  },
};
