// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     fullname: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     phoneNumber: {
//         type: Number
//         // required: true
//     },
//     password: {
//         type: String
//         // required: true,
//     },
//     role: {
//         type: String,
//         enum: ['student', 'recruiter'],
//         required: true
//     },
//     profile: {
//         bio: { type: String },
//         skills: [{ type: String }],
//         resume: { type: String }, // URL to resume file
//         resumeOriginalName: { type: String },
//         company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
//         profilePhoto: {
//             type: String,
//             default: ""
//         }
//     },
// }, { timestamps: true });
// export const User = mongoose.model('User', userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile_no: {
            type: String, // Changed to match the field name in the update function
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ['student', 'recruiter'],
            required: true,
        },
        user_type: {
            type: String,
            enum: ['student', 'recruiter'],
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        dob: {
            type: Date,
        },
        location: {
            type: String,
        },
        profile: {
            bio: { type: String },
            skills: [{ type: String }],
            resume_url: { type: String },
            resumeOriginalName: { type: String },
            profile_image: { type: String, default: "" },
            education: [
                {
                    degree: { type: String },
                    institution: { type: String },
                    year: { type: Number },
                },
            ],
            experience: [
                {
                    job_title: { type: String },
                    company: { type: String },
                    duration: { type: String },
                },
            ],
            linkedin_url: { type: String },
            portfolio_url: { type: String },
            about_me: { type: String },
            preferred_job_types: [{ type: String }],
            preferred_locations: [{ type: String }],
        },
        applied_jobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
            },
        ],
        saved_jobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
            },
        ],
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
