import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "./badge"; // Import Badge component

export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10", className)}
    >
      {items.map((job, idx) => (
        <Link
          to={`/description/${job._id}`}
          key={job._id}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <div className="p-6 rounded-3xl shadow-md bg-white border border-gray-200 cursor-pointer transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
            {/* Company Info */}
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                {job?.company?.name}
              </h1>
              <p className="text-sm text-gray-500">📍 {job?.location || "India"}</p>
            </div>

            {/* Job Title & Description */}
            <div className="mt-3">
              <h2 className="text-lg font-bold text-gray-900">{job?.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
            </div>

            {/* Badges (Position, Type, Salary) */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Badge className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-md">
                {job?.position} Positions
              </Badge>
              <Badge className="bg-red-100 text-[#F83002] font-semibold px-3 py-1 rounded-md">
                {job?.jobType}
              </Badge>
              <Badge className="bg-purple-100 text-[#7209b7] font-semibold px-3 py-1 rounded-md">
                {job?.salary} LPA
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};