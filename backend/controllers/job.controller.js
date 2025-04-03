import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false,
                status: "error"

            })
        };
        return res.status(200).json({
            job,
            success: true,
            status: "success"
        });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// export const editJob = async (req, res) => {
//     try {
//         const jobId = req.params.id;
//         const userId = req.id;
//         const {
//             title,
//             description,
//             requirements,
//             salary,
//             location,
//             jobType,
//             experience,
//             position,
//             companyId
//         } = req.body;

//         // Check if companyId is provided
//         if (!companyId) {
//             return res.status(400).json({
//                 message: "Company ID is required",
//                 success: false,
//                 status: "error"
//             });
//         }

//         // Find job and check if it exists
//         const job = await Job.findById(jobId);
//         if (!job) {
//             return res.status(404).json({
//                 message: "Job not found",
//                 success: false,
//                 status: "error"
//             });
//         }

//         if (job.created_by.toString() !== userId) {
//             return res.status(403).json({
//                 message: "You are not authorized to edit this job",
//                 success: false,
//                 status: "error"
//             });
//         }

//         // Update job with required companyId
//         const updatedJob = await Job.findByIdAndUpdate(
//             jobId,
//             {
//                 title: title || job.title,
//                 description: description || job.description,
//                 requirements: requirements ? requirements.split(",") : job.requirements,
//                 salary: Number(salary) || job.salary,
//                 location: location || job.location,
//                 jobType: jobType || job.jobType,
//                 experienceLevel: experience || job.experienceLevel,
//                 position: position || job.position,
//                 company: companyId
//             },
//             { new: true }
//         );

//         return res.status(200).json({
//             message: "Job updated successfully",
//             job: updatedJob,
//             success: true,
//             status: "success"
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false,
//             status: "error"
//         });
//     }
// }

export const editJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId
        } = req.body;

        // Find job and check if it exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                status: "error",
                message: "Job not found"
            });
        }

        // Update job
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            {
                title,
                description,
                requirements: requirements.split(",").map(req => req.trim()),
                salary: Number(salary),
                location,
                jobType,
                experienceLevel: Number(experience),
                position: Number(position),
                company: companyId || job.company
            },
            { new: true }
        );

        return res.status(200).json({
            status: "success",
            message: "Job updated successfully",
            job: updatedJob
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        // Find job and check if it exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
                status: "error"
            });
        }

        // Check if user is authorized to delete the job
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to delete this job",
                success: false,
                status: "error"
            });
        }

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job deleted successfully",
            success: true,
            status: "success"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            status: "error"
        });
    }
}