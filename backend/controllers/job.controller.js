import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

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
                { location: { $regex: keyword, $options: "i" } },
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
        const job = await Job.findById(jobId)
            .populate({
                path: "applications"
            })
            .populate({
                path: "company",
                select: "name description website location logo" // Select the company fields you want
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

export const getSimilarJobs = async (req, res) => {
    try {
        const jobId = req.params.id;

        // First get the current job to match against
        const currentJob = await Job.findById(jobId);
        if (!currentJob) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
                status: "error"
            });
        }

        // Find similar jobs based on title, location, or job type
        const similarJobs = await Job.find({
            $and: [
                { _id: { $ne: jobId } }, // Exclude current job
                {
                    $or: [
                        { title: { $regex: currentJob.title, $options: 'i' } },
                        { location: currentJob.location },
                        { jobType: currentJob.jobType },
                    ]
                }
            ]
        })
            .populate({
                path: "company",
                select: "name logo location"
            })
            .limit(4)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            jobs: similarJobs,
            success: true,
            status: "success"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error finding similar jobs",
            success: false,
            status: "error"
        });
    }
};

export const saveJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { userId, status } = req.body;

        if (![0, 1].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value. Must be 0 or 1.",
                success: false,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid Job ID format",
                success: false,
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }

        const existingSavedJob = job.savedJobs.find(
            (item) => item.user?.toString() === userId
        );

        if (existingSavedJob) {
            await Job.updateOne(
                { _id: jobId, "savedJobs.user": userId },
                { $set: { "savedJobs.$.status": status } }
            );
        } else {
            await Job.updateOne(
                { _id: jobId },
                { $push: { savedJobs: { user: userId, status } } }
            );
        }

        const updatedJob = await Job.findById(jobId);
        return res.status(200).json({
            message: "Saved job status updated successfully.",
            success: true,
            job: updatedJob,
        });
    } catch (error) {
        console.error("Error updating saved job:", error);
        return res.status(500).json({
            message: "Server error while updating saved job.",
            success: false,
        });
    }
};



// export const saveJob = async (req, res) => {
//     try {
//         const jobId = req.params.id;
//         const userId = req.id;
//         const { status } = req.body; // 1 for active, 0 for inactive

//         // Find the job
//         const job = await Job.findById(jobId);
//         if (!job) {
//             return res.status(404).json({
//                 message: "Job not found",
//                 success: false,
//                 status: "error"
//             });
//         }

//         // Check if user has already saved this job
//         const existingSaveIndex = job.savedJobs.findIndex(
//             save => save.user.toString() === userId
//         );

//         if (existingSaveIndex !== -1) {
//             // Update existing save status
//             job.savedJobs[existingSaveIndex].status = status;
//         } else {
//             // Add new save
//             job.savedJobs.push({
//                 user: userId,
//                 status: status
//             });
//         }

//         await job.save();

//         return res.status(200).json({
//             message: status === 1 ? "Job saved successfully" : "Job unsaved successfully",
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
// };

export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;

        // Find all jobs where the user has saved with status 1 (active)
        const savedJobs = await Job.find({
            'savedJobs': {
                $elemMatch: {
                    'user': userId,
                    'status': 1
                }
            }
        }).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            jobs: savedJobs,
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
};

// export const unsaveJob = async (req, res) => {
//     try {
//         const jobId = req.params.id;
//         const userId = req.id;

//         const job = await Job.findById(jobId);
//         if (!job) {
//             return res.status(404).json({
//                 message: "Job not found",
//                 success: false,
//                 status: "error"
//             });
//         }

//         const originalLength = job.savedJobs.length;

//         // Remove the saved job entry for the current user
//         job.savedJobs = job.savedJobs.filter(
//             save => save.user.toString() !== userId
//         );

//         if (job.savedJobs.length === originalLength) {
//             return res.status(404).json({
//                 message: "Saved job not found for this user",
//                 success: false,
//                 status: "error"
//             });
//         }

//         await job.save();

//         return res.status(200).json({
//             message: "Job unsaved successfully",
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
// };


export const unsaveJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid job ID",
                success: false,
                status: "error",
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
                status: "error",
            });
        }

        if (!Array.isArray(job.savedJobs)) {
            return res.status(500).json({
                message: "Invalid savedJobs format",
                success: false,
                status: "error",
            });
        }

        const originalLength = job.savedJobs.length;

        // Check for missing `.user` fields
        job.savedJobs = job.savedJobs.filter(save => {
            if (!save.user) return true;
            return save.user.toString() !== userId;
        });

        if (job.savedJobs.length === originalLength) {
            return res.status(404).json({
                message: "Saved job not found for this user",
                success: false,
                status: "error",
            });
        }

        await job.save();

        return res.status(200).json({
            message: "Job unsaved successfully",
            success: true,
            status: "success",
        });
    } catch (error) {
        console.error("UnsaveJob Error:", error.message, error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            status: "error",
            error: error.message,
        });
    }
};
