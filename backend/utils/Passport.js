import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (!user) {
            // Create a new user if not found
            user = await User.create({
                fullname: displayName,
                email,
                password: null, // No password for Google users
                role: "student", // Default role
                profile: {
                    profilePhoto: profile.photos[0]?.value || "",
                },
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});