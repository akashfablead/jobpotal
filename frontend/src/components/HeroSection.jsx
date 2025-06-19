// import React, { useState } from 'react'
// import { Button } from './ui/button'
// import { Search } from 'lucide-react'
// import { useDispatch } from 'react-redux';
// import { setSearchedQuery } from '@/redux/jobSlice';
// import { useNavigate } from 'react-router-dom';

// const HeroSection = () => {
//     const [query, setQuery] = useState("");
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const searchJobHandler = () => {
//         dispatch(setSearchedQuery(query));
//         navigate("/browse");
//     }

//     return (
//         <div className='text-center'>
//             <div className='flex flex-col gap-5 my-10'>
//                 <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 WorkVista Website</span>
//                 <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
//                 <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid aspernatur temporibus nihil tempora dolor!</p>
//                 <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
//                     <input
//                         type="text"
//                         placeholder='Find your dream jobs'
//                         onChange={(e) => setQuery(e.target.value)}
//                         className='outline-none border-none w-full'

//                     />
//                     <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2]">
//                         <Search className='h-5 w-5' />
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default HeroSection

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import CategoryCarousel from "./CategoryCarousel";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-8">
          {/* Badge */}
          <div className="animate-bounce mt-12">
            <span className="inline-block px-6 py-3 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm shadow-sm">
              No. 1 WorkVista Website
            </span>
          </div>

          {/* Hero Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Search, Apply & Get Your{" "}
              <span className="text-purple-600 relative">
                Dream Jobs
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 6c25-4 75-4 100 0"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect role from thousands of opportunities and take
              your career to the next level.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto w-full">
            <div className="flex items-center bg-white shadow-xl rounded-full p-2">
              <input
                type="text"
                placeholder="Search for job titles or keywords..."
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-6 py-4 text-lg text-gray-700 placeholder-gray-400 bg-transparent outline-none"
              />
              <Button
                onClick={searchJobHandler}
                className="px-8 py-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center gap-2 text-lg font-medium transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </Button>
            </div>
          </div>

          {/* <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">
                Popular Searches:
              </span>
              <div className="h-px w-16 bg-gray-200"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { title: "Frontend Developer", icon: "💻" },
                { title: "Backend Developer", icon: "📊" },
                { title: "Data Science", icon: "📈" },
                { title: "Graphic Designer", icon: "🎨" },
                { title: "FullStack Developer", icon: "🎨" },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => {
                    setQuery(item.title);
                    searchJobHandler();
                  }}
                  className="group px-4 py-2 bg-white rounded-full border border-gray-100 
                   shadow-sm hover:shadow-md hover:border-purple-200 hover:bg-purple-50 
                   transition-all duration-300 flex items-center gap-2"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-gray-600 group-hover:text-purple-600">
                    {item.title}
                  </span>
                </button>
              ))}
             
            </div>
          </div> */}
          <CategoryCarousel />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
