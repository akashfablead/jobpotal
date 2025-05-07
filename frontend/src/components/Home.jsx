import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ScrollBaseAnimation from "./ScrollingSection";
import { TwitterJobResponses } from "./TwitterJob";
import { BackgroundBoxesDemo } from "./Sortbg";
import { AnimatedTestimonialsDemo } from "./Teems";

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <div>
      <Navbar />
      <HeroSection />
      <ScrollBaseAnimation
        children={["You’re ", "Hiring? ", "We’re ", "Hiring? "]}
        clasname="text-gray-800 font-bold"
      />
      <LatestJobs />
      <AnimatedTestimonialsDemo />
      <TwitterJobResponses />
      <BackgroundBoxesDemo />
      <Footer />
    </div>
  );
};

export default Home;
