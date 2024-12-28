
import StudyAbroad from "../models/StudyAbroad.js";


// create new study
export const createStudy = async (req,res)=>{

    const newStudy = new StudyAbroad(req.body);

    try {
        const savedStudy = await newStudy.save();

        res.status(200)
        .json({
            success: true,
            message: "Successfully created",
            data: savedStudy,
        });
    } catch (err) {
        res
        .status(500)
        .json({ success: false, message: err.message});
        
    }
};

// update study
export const updateStudy = async (req,res) => {
    
    const id = req.params.id
    
    try {
        
        const updateStudy = await StudyAbroad.findByIdAndUpdate(id, {
            $set: req.body
        }, {new:true})

        res.status(200)
        .json({
            success: true,
            message: "Successfully update",
            data: updateStudy,
        });
    } catch (error) {
        res.status(500 )
        .json({
            success: false,
            message: "Failed to update",
        });
    }
};

// delete study
export const deleteStudy = async (req,res) => {
    const id = req.params.id
    
    try {
        
        const deletedStudy = await StudyAbroad.findByIdAndDelete(id);

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

// getSingle study
export const getSingleStudy = async (req,res) => {
    const id = req.params.id
    try {
        const study = await StudyAbroad.findById(id);
        res.status(200)
        .json({
            success: true,
            message: "Successfully get",
            data: study,
        });
    } catch (error) {
        res.status(404)
        .json({
            success: false,
            message: "Not found",
        });
    }
};

export const getAllStudy = async (req, res) => {
    // for pagination
    const page = parseInt(req.query.page);

    try {
        const studies = await StudyAbroad.find({}).skip(page * 8).limit(8);
        // console.log("StudyAbroad: ", studies);
        const studyCount = await StudyAbroad.estimatedDocumentCount();

        res.status(200).json({
            success: true,
            count: studies.length,
            message: "Successful",
            data: studies,
            studyCount: studyCount
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "Not found",
        });
    }
};

// getAll study
export const getAllStudyPage = async (req,res) => {
    // for pagination
    const page = parseInt(req.query.page);

    try {
        const studies = await StudyAbroad.find({})
        .skip(page * 8)
        .limit(8);

        const studyCount = await StudyAbroad.estimatedDocumentCount();

        res.status(200).json({
            success:true, 
            count:studies.length,
            studycount: studyCount,
            message: "Successfull",
            data: studies,
            studyCount: studyCount
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "Not found",
        });
    }
}