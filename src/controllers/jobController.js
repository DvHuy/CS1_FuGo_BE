import multer from "multer";
import Job from "../models/Job.js";
import JobCV from "../models/JobCV.js";
import JobApplication from "../models/JobApplication.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploadCV");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

export const applyJobCV = async (req, res) => {
  try {
    const { jobId, certificate, major, gpa, description } = req.body;
    const userId = req.user._id;
    const newJobCV = new JobCV({
      job_id: jobId,
      certificate,
      major,
      gpa,
      user_id: userId,
      cv_img: req.file ? req.file.filename : "",
      description,
    });
    const savedJobCV = await newJobCV.save();

    const newJobApplication = new JobApplication({
      job_id: jobId,
      job_cv_id: savedJobCV._id,
      status: "Pending",
    });
    await newJobApplication.save();

    return res.status(200).json({
      success: true,
      message: "Job application submitted successfully!",
      data: savedJobCV,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const jobController = {
  getSingleJob: async (req, res) => {
    try {
      const id = req.params.id;
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
      }
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
    try {
      const jobs = await Job.find({});
      res.status(200).json({
        success: true,
        count: jobs.length,
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
