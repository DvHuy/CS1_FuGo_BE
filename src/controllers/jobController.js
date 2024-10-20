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

export const createJobs = async (req,res)=>{

  const newJobs = new Job(req.body);

  try {
      const savedJobs = await newJobs.save();

      res.status(200)
      .json({
          success: true,
          message: "Successfully created",
          data: savedJobs,
      });
  } catch (err) {
      res
      .status(500)
      .json({ success: false, message: err.message});
      
  }
};

// update tour
export const updateJobs = async (req,res) => {
  
  const id = req.params.id
  
  try {
      
      const updatedJobs = await Job.findByIdAndUpdate(id, {
          $set: req.body
      }, {new:true})

      res.status(200)
      .json({
          success: true,
          message: "Successfully update",
          data: updatedJobs,
      });
  } catch (error) {
      res.status(500 )
      .json({
          success: false,
          message: "Failed to update",
      });
  }
};

// delete tour
export const deleteJobs = async (req,res) => {
  const id = req.params.id
  
  try {
      
      const deletedJobs = await Job.findByIdAndDelete(id);

      res.status(200)
      .json({
          success: true,
          message: "Successfully deleted",
      });
  } catch (error) {
      res.status(500 )
      .json({
          success: false,
          message: "Failed to delete",
      });
  }
};

// getSingle job
export const getSingleJob = async (req,res) => {
  const id = req.params.id
  try {
      const job = await Job.findById(id);
      res.status(200)
      .json({
          success: true,
          message: "Successfully get",
          data: job,
      });
  } catch (error) {
      res.status(404)
      .json({
          success: false,
          message: "Not found",
      });
  }
};

// getAll job
export const getAllJobs = async (req,res) => {
  // for pagination
  const page = parseInt(req.query.page);

  try {
      const jobs = await Job.find({})
      .skip(page * 8)
      .limit(8);

      res.status(200).json({
          success:true, 
          count:jobs.length,
          message: "Successfull",
          data: jobs,
      });

  } catch (error) {
      res.status(404).json({
          success:false,
          message:"Not found",
      });
  }
};