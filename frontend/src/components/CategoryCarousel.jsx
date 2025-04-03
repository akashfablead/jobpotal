// import React from 'react';
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
// import { Button } from './ui/button';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setSearchedQuery } from '@/redux/jobSlice';

// const category = [
//     "Frontend Developer",
//     "Backend Developer",
//     "Data Science",
//     "Graphic Designer",
//     "FullStack Developer"
// ]

// const CategoryCarousel = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const searchJobHandler = (query) => {
//         dispatch(setSearchedQuery(query));
//         navigate("/browse");
//     }

//     return (
//         <div>
//             <Carousel className="w-full max-w-xl mx-auto my-20">
//                 <CarouselContent>
//                     {
//                         category.map((cat, index) => (
//                             <CarouselItem className="md:basis-1/2 lg-basis-1/3">
//                                 <Button onClick={()=>searchJobHandler(cat)} variant="outline" className="rounded-full">{cat}</Button>
//                             </CarouselItem>
//                         ))
//                     }
//                 </CarouselContent>
//                 <CarouselPrevious />
//                 <CarouselNext />
//             </Carousel>
//         </div>
//     )
// }

// export default CategoryCarousel

import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const categories = [
  { title: "Frontend Developer", icon: "💻" },
  { title: "Backend Developer", icon: "📊" },
  { title: "Data Scientist", icon: "📈" },
  { title: "Graphic Designer", icon: "🎨" },
  { title: "Full Stack Developer", icon: "⚡" },
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="flex flex-col items-center gap-4 ">
      <div className="flex items-center gap-2">
        <div className="h-px w-16 bg-gray-200"></div>
        <span className="text-gray-500 font-medium">Popular Searches:</span>
        <div className="h-px w-16 bg-gray-200"></div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((item) => (
          <button
            key={item.title}
            onClick={() => searchJobHandler(item.title)}
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
    </div>
  );
};

export default CategoryCarousel;
