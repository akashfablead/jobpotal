// import React from "react";
// import { Badge } from "./ui/badge";
// import { useNavigate } from "react-router-dom";


// const LatestJobCards = ({ job }) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       onClick={() => navigate(`/description/${job._id}`)}
//       className="p-6 rounded-lg shadow-md bg-white border border-gray-200 cursor-pointer transition-transform duration-200 hover:shadow-lg hover:-translate-y-1"
//     >
//       {/* Company Info */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-xl font-semibold text-gray-800">
//           {job?.company?.name}
//         </h1>
//         <p className="text-sm text-gray-500">📍 India</p>
//       </div>

//       {/* Job Title & Description */}
//       <div className="mt-3">
//         <h2 className="text-lg font-bold text-gray-900">{job?.title}</h2>
//         <p className="text-sm text-gray-600 line-clamp-2">{job?.description}</p>
//       </div>

//       {/* Badges (Position, Type, Salary) */}
//       <div className="flex flex-wrap items-center gap-2 mt-4">
//         <Badge className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-md">
//           {job?.position} Positions
//         </Badge>
//         <Badge className="bg-red-100 text-[#F83002] font-semibold px-3 py-1 rounded-md">
//           {job?.jobType}
//         </Badge>
//         <Badge className="bg-purple-100 text-[#7209b7] font-semibold px-3 py-1 rounded-md">
//           {job?.salary} LPA
//         </Badge>
//       </div>
//     </div>
//   );
// };

// export default LatestJobCards;

import React from "react";
import { HoverEffect } from "./ui/card-hover-effect";

export function LatestJobCards({ jobs }) {
  return (
    <div className=" mx-auto px-8">
      <HoverEffect items={jobs} />
    </div>
  );
}

export default LatestJobCards;