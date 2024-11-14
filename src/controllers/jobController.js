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

const upload = multer({ storage: storage });

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

    if (req.query.country) {
      searchConditions.country = new RegExp(req.query.country, "i");
    }
    if (req.query.minSalary && req.query.maxSalary) {
      searchConditions.salary = {
        $gte: parseInt(req.query.minSalary),
        $lte: parseInt(req.query.maxSalary),
      };
    }
    if (req.query.profession) {
      searchConditions.profession = new RegExp(req.query.profession, "i");
    }
    if (req.query.educationLevel) {
      searchConditions.educationLevel = new RegExp(
        req.query.educationLevel,
        "i"
      );
    }
    if (req.query.industry) {
      searchConditions.industry = new RegExp(req.query.industry, "i");
    }
    if (req.query.experience) {
      searchConditions.experience = new RegExp(req.query.experience, "i");
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
};
