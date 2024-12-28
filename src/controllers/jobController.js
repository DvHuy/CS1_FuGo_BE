import multer from "multer";
import Job from "../models/Job.js";
import JobCV from "../models/JobCV.js";
import JobApplication from "../models/JobApplication.js";
import path from "path";
import { client } from "../db/init.redis.js";
import cloudinaryInstance from "cloudinary";
import { get } from "http";
const cloudinary = cloudinaryInstance.v2;

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
      username,
      gender,
      phone,
      email,
      language,
      education,
      bio,
    } = req.body;

    const newJobCV = new JobCV({
      jobId: jobId,
      accountId: accountId,
      fullName: username,
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
  // get all job
  getAllJob: async (req, res) => {
    try {
      const jobs = await Job.find();
      return res.status(200).json({ data: jobs });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // get single job
  getSingleJob: async (req, res) => {
    try {
      const id = req.params.id;
      const job = await Job.findById(id).populate("partnerId");
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

    // Xây dựng key cache dựa trên điều kiện tìm kiếm
    const cacheKey = `jobs-search:${title}-${country}-${minSalary}-${maxSalary}-${educationalLevel}-${profession}-${experience}`;

    const cachedJobs = await client.get(cacheKey);

    if (cachedJobs) {
      return res.status(200).json({
        success: true,
        message: "Search success",
        data: JSON.parse(cachedJobs),
      });
    }
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
      // Lưu kết quả vào cache
      client.set(cacheKey, JSON.stringify(jobs), {
        EX: 60 * 5,
      });
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

  /// Get all job by 
  getAllJobPage: async (req, res) => {
    const page = parseInt(req.query.page);
    try {
      const jobs = await Job.find({})
        .populate("partnerId")
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
  // Create new job
  insertJob: async (req, res) => {
    let fileData;
    try {
      fileData = req.file;
     

      const {
        title,
        description,
        requirements,
        country,
        location,
        company,
        experience,
        profession,
        educationalLevel,
        jobStatus,
        minSalary,
        maxSalary,
        partnerId,
      } = req.body;

      // Lưu đường dẫn ảnh nếu có file được upload
      const jobImage = fileData?.path;

      const jobData = {
        title,
        description,
        requirements,
        country,
        location,
        company,
        experience,
        profession,
        educationalLevel,
        jobStatus,
        minSalary,
        maxSalary,
        partnerId,
        image: jobImage,
      };

      // Tạo và lưu một Job mới
      const job = new Job(jobData);
      const savedJob = await job.save();

      return res.status(200).json({
        success: true,
        data: savedJob,
      });
    } catch (error) {
      console.error({
        success: false,
        data: error,
        message: "Error inserting job",
      });

      // Xóa ảnh khỏi Cloudinary nếu có lỗi xảy ra
      if (fileData && fileData.filename) {
        await cloudinary.uploader.destroy(fileData.filename);
      }

      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update job
  updateJob: async (req, res) => {
    let fileData;
    try {
      fileData = req.file;
      console.log(fileData);

      const {
        title,
        description,
        requirements,
        country,
        location,
        company,
        experience,
        profession,
        educationalLevel,
        jobStatus,
        minSalary,
        maxSalary,
        partnerId,
      } = req.body;

      // Tìm Job theo ID
      const job = await Job.findById(req.params._id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      // Cập nhật thông tin Job nếu có dữ liệu mới
      if (title !== undefined) job.title = title;
      if (description !== undefined) job.description = description;
      if (requirements !== undefined) job.requirements = requirements;
      if (country !== undefined) job.country = country;
      if (location !== undefined) job.location = location;
      if (company !== undefined) job.company = company;
      if (experience !== undefined) job.experience = experience;
      if (profession !== undefined) job.profession = profession;
      if (educationalLevel !== undefined)
        job.educationalLevel = educationalLevel;
      if (jobStatus !== undefined) job.jobStatus = jobStatus;
      if (minSalary !== undefined) job.minSalary = minSalary;
      if (maxSalary !== undefined) job.maxSalary = maxSalary;
      if (partnerId !== undefined) job.partnerId = partnerId;

      // Xử lý cập nhật ảnh
      if (fileData?.path) {
        // Xóa ảnh cũ trên Cloudinary nếu có
        if (job.image && job.image.includes("cloudinary")) {
          const oldImagePublicId = job.image.split("/").pop().split(".")[0]; // Lấy public ID từ URL
          await cloudinary.uploader.destroy(oldImagePublicId);
        }
        // Gán ảnh mới
        job.image = fileData.path;
      }

      // Lưu thông tin job đã cập nhật
      const updatedJob = await job.save();

      return res.status(200).json({
        success: true,
        data: updatedJob,
      });
    } catch (error) {
      // Xóa ảnh khỏi Cloudinary nếu có lỗi
      if (fileData && fileData.filename) {
        await cloudinary.uploader.destroy(fileData.filename);
      }
      return res.status(500).json({
        success: false,
        message: "Error updating job",
        error: error.message,
      });
    }
  },
};
