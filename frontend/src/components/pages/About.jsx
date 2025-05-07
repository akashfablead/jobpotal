// import React from 'react';
// import Navbar from '../shared/Navbar';
// import Footer from '../shared/Footer';

// const About = () => {
//   return (
//     <>
//     <Navbar />
//     <div className="max-w-screen-lg mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
//       <p className="text-gray-700 mb-4">
//         Welcome to Job Hunt! We are dedicated to connecting job seekers with top employers worldwide.
//         Our mission is to make the job search process seamless and efficient for everyone.
//       </p>
//       <p className="text-gray-700 mb-4">
//         Whether you're looking for your dream job or the perfect candidate, Job Hunt is here to help.
//         With our advanced tools and resources, we aim to empower individuals and businesses to achieve their goals.
//       </p>
//       <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4">Our Vision</h2>
//       <p className="text-gray-700">
//         To be the leading platform for job seekers and employers, fostering meaningful connections and opportunities.
//       </p>
//       <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-4">Our Values</h2>
//       <ul className="list-disc pl-5 space-y-2 text-gray-700">
//         <li>Integrity and transparency</li>
//         <li>Empowering individuals and businesses</li>
//         <li>Innovation and continuous improvement</li>
//         <li>Commitment to excellence</li>
//       </ul>
//     </div>
//     <Footer />
//     </>
//   );
// };

// export default About;

import React, { useEffect } from "react";

import {
  Users,
  Target,
  Award,
  TrendingUp,
  Briefcase,
  Globe,
  CheckCircle,
  Zap,
} from "lucide-react";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import about from "../../assets/images/about.jpg";
import Mission from "../../assets/images/mission.jpg";
const About = () => {
  // Stats count up animation
  useEffect(() => {
    const counters = document.querySelectorAll(".counter");

    const countUp = (el) => {
      const target = parseInt(el.getAttribute("data-target") || "0", 10);
      const count = parseInt(el.textContent || "0", 10);
      const increment = target / 100;

      if (count < target) {
        el.textContent = Math.ceil(count + increment).toString();
        setTimeout(() => countUp(el), 20);
      } else {
        el.textContent = target.toString();
      }
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetEl = entry.target;
          if (targetEl.classList.contains("counter")) {
            countUp(targetEl);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    counters.forEach((counter) => {
      observer.observe(counter);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
            alt="Tech background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-screen-xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center opacity-0 animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              About Job Hunt
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-200">
              Connecting talented professionals with their dream careers since
              2015.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="opacity-0 animate-fade-up-delay-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Welcome to Job Hunt! We are dedicated to connecting job seekers
              with top employers worldwide. Our mission is to make the job
              search process seamless and efficient for everyone.
            </p>
            <p className="text-lg text-gray-700">
              Whether you're looking for your dream job or the perfect
              candidate, Job Hunt is here to help. With our advanced tools and
              resources, we aim to empower individuals and businesses to achieve
              their goals.
            </p>
          </div>
          <div className="relative opacity-0 animate-fade-up-delay-2">
            <div className="absolute -top-4 -left-4 h-24 w-24 bg-purple-200 rounded-full animate-bounce-slow"></div>
            <div
              className="absolute -bottom-4 -right-4 h-12 w-12 bg-purple-200 rounded-full animate-bounce-slow"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <img
              src={Mission}
              alt="Woman using laptop"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 opacity-0 animate-fade-up">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div
              className="text-center opacity-0 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Briefcase className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                <div
                  className="counter text-3xl font-bold text-gray-900"
                  data-target="8000"
                >
                  0
                </div>
                <p className="text-gray-600 mt-2">Job Listings</p>
              </div>
            </div>
            <div
              className="text-center opacity-0 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Users className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                <div
                  className="counter text-3xl font-bold text-gray-900"
                  data-target="12000"
                >
                  0
                </div>
                <p className="text-gray-600 mt-2">Active Users</p>
              </div>
            </div>
            <div
              className="text-center opacity-0 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="bg-white p-6 rounded-xl shadow-md">
                <Globe className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                <div
                  className="counter text-3xl font-bold text-gray-900"
                  data-target="50"
                >
                  0
                </div>
                <p className="text-gray-600 mt-2">Countries</p>
              </div>
            </div>
            <div
              className="text-center opacity-0 animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="bg-white p-6 rounded-xl shadow-md">
                <CheckCircle className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                <div
                  className="counter text-3xl font-bold text-gray-900"
                  data-target="5400"
                >
                  0
                </div>
                <p className="text-gray-600 mt-2">Success Stories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0 animate-fade-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            To be the leading platform for job seekers and employers, fostering
            meaningful connections and opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 opacity-0 animate-fade-up-delay-1">
            <img
              src={about}
              alt="Aerial view of landscape"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          <div className="order-1 md:order-2 opacity-0 animate-fade-up-delay-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              What Sets Us Apart
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Zap className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">
                    Advanced Matching Technology
                  </h4>
                  <p className="text-gray-700">
                    Our proprietary algorithm connects candidates with ideal
                    positions based on skills, experience, and preferences.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <TrendingUp className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">
                    Career Growth Resources
                  </h4>
                  <p className="text-gray-700">
                    We provide tools and insights to help job seekers advance
                    their careers and employers build stellar teams.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Globe className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Global Reach</h4>
                  <p className="text-gray-700">
                    With opportunities across 50+ countries, we connect talent
                    and employers worldwide.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 opacity-0 animate-fade-up">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl opacity-0 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <Award className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-gray-300">
                We strive for excellence in every aspect of our service, setting
                high standards and continuously improving.
              </p>
            </div>
            <div
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl opacity-0 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <CheckCircle className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-gray-300">
                We operate with honesty and transparency, building trust with
                our users and partners.
              </p>
            </div>
            <div
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl opacity-0 animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Users className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Empowerment</h3>
              <p className="text-gray-300">
                We empower individuals and businesses to achieve their full
                potential through meaningful connections.
              </p>
            </div>
            <div
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl opacity-0 animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Target className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-300">
                We embrace change and continuously evolve our platform with
                cutting-edge solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12 opacity-0 animate-fade-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Leadership Team
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Meet the passionate individuals behind Job Hunt's mission to
            transform the hiring landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            className="text-center opacity-0 animate-scale-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="relative mx-auto w-40 h-40 mb-4 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1500673922987-e212871fec22"
                alt="CEO"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Sarah Johnson</h3>
            <p className="text-purple-600 font-medium">
              Chief Executive Officer
            </p>
          </div>
          <div
            className="text-center opacity-0 animate-scale-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative mx-auto w-40 h-40 mb-4 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
                alt="CTO"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Michael Chen</h3>
            <p className="text-purple-600 font-medium">
              Chief Technology Officer
            </p>
          </div>
          <div
            className="text-center opacity-0 animate-scale-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative mx-auto w-40 h-40 mb-4 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                alt="COO"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Rebecca Taylor</h3>
            <p className="text-purple-600 font-medium">
              Chief Operating Officer
            </p>
          </div>
          <div
            className="text-center opacity-0 animate-scale-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative mx-auto w-40 h-40 mb-4 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                alt="CMO"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900">David Wilson</h3>
            <p className="text-purple-600 font-medium">
              Chief Marketing Officer
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;
