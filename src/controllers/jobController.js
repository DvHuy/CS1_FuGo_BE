import Job from "../models/Job.js";

const getJobBySearch = async (req, res) => {
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
    searchConditions.educationLevel = new RegExp(req.query.educationLevel, "i");
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
};

export { getJobBySearch };
