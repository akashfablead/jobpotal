import React from "react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const Resources = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Resources</h1>
        <p className="text-gray-700 mb-4">
          Welcome to the Resources page! Here, you'll find helpful guides, tips,
          and tools to assist you in your job search or hiring process.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            <a href="/resume-tips" className="text-blue-600 hover:underline">
              Resume Writing Tips
            </a>
          </li>
          <li>
            <a href="/interview-prep" className="text-blue-600 hover:underline">
              Interview Preparation
            </a>
          </li>
          <li>
            <a
              href="/job-market-trends"
              className="text-blue-600 hover:underline"
            >
              Job Market Trends
            </a>
          </li>
          <li>
            <a
              href="/employer-guides"
              className="text-blue-600 hover:underline"
            >
              Employer Guides
            </a>
          </li>
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default Resources;
