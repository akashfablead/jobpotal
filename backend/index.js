import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import subscriptionRoute from "./routes/subscription.route.js";
import contactRoute from "./routes/contact.route.js";
// import passport from "passport";
// import session from "express-session";
// import "./utils/passport.js";

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
// Add session middleware
// app.use(session({
//     secret: process.env.SESSION_SECRET || "your_secret_key",
//     resave: false,
//     saveUninitialized: false,
// }));

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/subscription", subscriptionRoute);
app.use("/api/v1/contact", contactRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
})