import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Job } from "../models/job.model.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
                status: "error"
            })
        }
        return res.status(200).json({
            company,
            success: true,
            status: "success"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            status: "error"
        });
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const companyId = req.params.id;

        // Find company and verify ownership
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // Check if user owns the company
        if (company.userId.toString() !== req.id) {
            return res.status(403).json({
                message: "Unauthorized: You don't own this company",
                success: false
            });
        }

        // Prepare update data
        const updateData = {
            name,
            description,
            website,
            location
        };

        // Handle file upload if file exists
        if (req.file) {
            try {
                const fileUri = getDataUri(req.file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                updateData.logo = cloudResponse.secure_url;
            } catch (uploadError) {
                return res.status(400).json({
                    message: "Error uploading logo",
                    success: false,
                    error: uploadError.message
                });
            }
        }

        // Update company
        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            updateData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: "Company information updated successfully.",
            success: true,
            company: updatedCompany
        });

    } catch (error) {
        console.error("Update company error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
}

// export const deleteCompany = async (req, res) => {
//     try {
//         const companyId = req.params.id;

//         // Find company and verify it exists
//         const company = await Company.findById(companyId);
//         if (!company) {
//             return res.status(404).json({
//                 message: "Company not found.",
//                 success: false,
//                 status: "error"
//             });
//         }

//         // Check if user owns the company
//         if (company.userId.toString() !== req.id) {
//             return res.status(403).json({
//                 message: "Unauthorized: You don't own this company",
//                 success: false,
//                 status: "error"
//             });
//         }

//         // Delete the company
//         await Company.findByIdAndDelete(companyId);

//         return res.status(200).json({
//             message: "Company deleted successfully.",
//             success: true,
//             status: "success"
//         });

//     } catch (error) {
//         console.error("Delete company error:", error);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false,
//             error: error.message,
//             status: "error"
//         });
//     }
// }


export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        // Find company and verify it exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
                status: "error"
            });
        }

        // Check if user owns the company
        if (company.userId.toString() !== req.id) {
            return res.status(403).json({
                message: "Unauthorized: You don't own this company",
                success: false,
                status: "error"
            });
        }

        // Delete all jobs associated with this company
        await Job.deleteMany({ company: companyId });

        // Delete the company
        await Company.findByIdAndDelete(companyId);

        return res.status(200).json({
            message: "Company and associated jobs deleted successfully.",
            success: true,
            status: "success"
        });

    } catch (error) {
        console.error("Delete company error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
            status: "error"
        });
    }
}