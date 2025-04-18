import React from 'react';

const About = () => {
  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
      <p className="text-gray-700 mb-4">
        Welcome to Job Hunt! We are dedicated to connecting job seekers with top employers worldwide. 
        Our mission is to make the job search process seamless and efficient for everyone.
      </p>
      <p className="text-gray-700 mb-4">
        Whether you're looking for your dream job or the perfect candidate, Job Hunt is here to help. 
        With our advanced tools and resources, we aim to empower individuals and businesses to achieve their goals.
      </p>
      <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4">Our Vision</h2>
      <p className="text-gray-700">
        To be the leading platform for job seekers and employers, fostering meaningful connections and opportunities.
      </p>
      <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4">Our Values</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        <li>Integrity and transparency</li>
        <li>Empowering individuals and businesses</li>
        <li>Innovation and continuous improvement</li>
        <li>Commitment to excellence</li>
      </ul>
    </div>
  );
};

export default About;