import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { OAuth2Client } from "google-auth-library";
import { Subscription } from "../models/subscription.model.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// export const login = async (req, res) => {
//     try {
//         const { email, password, role } = req.body;

//         if (!email || !password || !role) {
//             return res.status(400).json({
//                 message: "Something is missing",
//                 success: false
//             });
//         };
//         let user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({
//                 message: "Incorrect email or password.",
//                 success: false,
//             })
//         }
//         const isPasswordMatch = await bcrypt.compare(password, user.password);
//         if (!isPasswordMatch) {
//             return res.status(400).json({
//                 message: "Incorrect email or password.",
//                 success: false,
//             })
//         };
//         // check role is correct or not
//         if (role !== user.role) {
//             return res.status(400).json({
//                 message: "Account doesn't exist with current role.",
//                 success: false
//             })
//         };

//         const tokenData = {
//             userId: user._id
//         }
//         const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

//         user = {
//             _id: user._id,
//             fullname: user.fullname,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             role: user.role,
//             profile: user.profile
//         }

//         return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
//             message: `Welcome back ${user.fullname}`,
//             user,
//             success: true
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

export const login = async (req, res) => {
    try {
        const { email, password, role, googleToken } = req.body;

        if (googleToken) {
            // Handle Google authentication
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const { name, email: googleEmail, picture } = ticket.getPayload();

            // Check if user already exists
            let user = await User.findOne({ email: googleEmail });
            if (!user) {
                // Create a new user if not found
                user = await User.create({
                    fullname: name,
                    email: googleEmail,
                    phoneNumber: null, // No phone number for Google users
                    password: null, // No password for Google users
                    role: "student", // Default role
                    profile: {
                        profilePhoto: picture, // Use Google profile picture
                    },
                });
            }

            // Generate JWT token
            const tokenData = { userId: user._id };
            const authToken = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

            return res.status(200).cookie("token", authToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }).json({
                message: "Google login successful",
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    profilePhoto: user.profile.profilePhoto,
                },
                token: authToken,
                success: true,
            });
        }

        // Handle regular login
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing in the request. Please provide email, password and role.",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check if role is correct
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false,
            });
        }

        const tokenData = {
            userId: user._id,
        };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
            token
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Login failed", success: false });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;
        // cloudinary ayega idhar
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);



        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if (fullname) user.fullname = fullname
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray

        // resume comes later here...
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// export const googleAuth = async (req, res) => {
//     try {
//         const { token } = req.body;

//         // Verify Google token
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: process.env.GOOGLE_CLIENT_ID,
//         });

//         const { name, email, picture } = ticket.getPayload();

//         // Check if user already exists
//         let user = await User.findOne({ email });
//         if (!user) {
//             // Create a new user if not found
//             user = await User.create({
//                 fullname: name,
//                 email,
//                 phoneNumber: null, // No phone number for Google users
//                 password: null, // No password for Google users
//                 role: "student", // Default role
//                 profile: {
//                     profilePhoto: picture, // Use Google profile picture
//                 },
//             });
//         }

//         // Generate JWT token
//         const tokenData = { userId: user._id };
//         const authToken = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

//         return res.status(200).cookie("token", authToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }).json({
//             message: "Google login successful",
//             user: {
//                 _id: user._id,
//                 fullname: user.fullname,
//                 email: user.email,
//                 profilePhoto: user.profile.profilePhoto,
//             },
//             success: true,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Google login failed", success: false });
//     }
// };

// export const googleAuth = async (req, res) => {
//     try {
//         const { token } = req.body;
//         const file = req.file; // Get the uploaded file

//         // Verify Google token
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: process.env.GOOGLE_CLIENT_ID,
//         });

//         const { name, email, picture } = ticket.getPayload();

//         // Check if user already exists
//         let user = await User.findOne({ email });
//         if (!user) {
//             let profilePhotoUrl = picture; // Default to Google profile picture

//             // If a file is uploaded, process it as binary and upload to Cloudinary
//             if (file) {
//                 try {
//                     const fileUri = getDataUri(file); // Convert file to data URI
//                     const binaryData = Buffer.from(fileUri.content, "base64"); // Convert to binary
//                     const cloudResponse = await cloudinary.uploader.upload_stream(
//                         { resource_type: "image" },
//                         (error, result) => {
//                             if (error) {
//                                 throw new Error("Cloudinary upload failed");
//                             }
//                             return result;
//                         }
//                     ).end(binaryData); // Upload binary data
//                     profilePhotoUrl = cloudResponse.secure_url; // Use the uploaded file's URL
//                 } catch (uploadError) {
//                     console.error("Error uploading file to Cloudinary:", uploadError);
//                     return res.status(500).json({
//                         message: "Failed to upload profile photo",
//                         success: false,
//                     });
//                 }
//             } else {
//                 profilePhotoUrl = "https://th.bing.com/th/id/OIP.tr7ifhDScWdY_1VY9G_z_QHaHa?w=222&h=220&c…"; // Set a default profile photo URL
//             }

//             // Create a new user if not found
//             user = await User.create({
//                 fullname: name,
//                 email,
//                 phoneNumber: null, // No phone number for Google users
//                 password: null, // No password for Google users
//                 role: "student", // Default role
//                 profile: {
//                     profilePhoto: profilePhotoUrl, // Use the uploaded or Google profile picture
//                 },
//             });
//         }

//         // Generate JWT token
//         const tokenData = { userId: user._id };
//         const authToken = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

//         return res.status(200).cookie("token", authToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }).json({
//             message: "Google login successful",
//             user: {
//                 _id: user._id,
//                 fullname: user.fullname,
//                 email: user.email,
//                 phoneNumber: user.phoneNumber,
//                 role: user.role,
//                 profile: user.profile,
//                 // Use the uploaded or Google profile picture
//                 profilePhoto: user.profile.profilePhoto,
//             },
//             success: true,
//         });
//     } catch (error) {
//         console.error("Error in Google authentication:", error);
//         return res.status(500).json({ message: "Google login failed", success: false });
//     }
// };

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const file = req.file; // Get the uploaded file, if any

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        // Check if user already exists
        let user = await User.findOne({ email });
        if (!user) {
            let profilePhotoUrl = picture; // Default to Google profile picture

            // If a file is uploaded, process it and upload to Cloudinary
            if (file) {
                try {
                    const fileUri = getDataUri(file); // Convert file to data URI
                    const cloudResponse = await cloudinary.uploader.upload(fileUri.content); // Upload to Cloudinary
                    profilePhotoUrl = cloudResponse.secure_url; // Use the uploaded file's URL
                } catch (uploadError) {
                    console.error("Error uploading file to Cloudinary:", uploadError);
                    return res.status(500).json({
                        message: "Failed to upload profile photo",
                        success: false,
                    });
                }
            }

            // Create a new user if not found
            user = await User.create({
                fullname: name,
                email,
                phoneNumber: null, // No phone number for Google users
                password: null, // No password for Google users
                role: "student", // Default role
                profile: {
                    profilePhoto: profilePhotoUrl, // Use the uploaded or Google profile picture
                },
            });
        }

        // Generate JWT token
        const tokenData = { userId: user._id };
        const authToken = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        return res.status(200).cookie("token", authToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }).json({
            message: "Google login successful",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile,
            },
            success: true,
        });
    } catch (error) {
        console.error("Error in Google authentication:", error);
        return res.status(500).json({ message: "Google login failed", success: false });
    }
};

export const checkSubscriptionStatus = async (req, res) => {
    try {
        const userId = req.params.userId || req.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const subscription = await Subscription.findOne({
            userId,
            status: { $in: [1, 2] },
            endDate: { $gt: new Date() }
        });

        return res.status(200).json({
            success: true,
            hasActiveSubscription: !!subscription,
            subscription: subscription ? {
                planType: subscription.planType,
                endDate: subscription.endDate,
                status: subscription.status
            } : null
        });
    } catch (error) {
        console.error("Error checking subscription status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to check subscription status"
        });
    }
};