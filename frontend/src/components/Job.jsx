import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Bookmark, Eye } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    checkIfSaved();
  }, [user_id]);

  const checkIfSaved = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
        withCredentials: true,
      });

      if (res.data.status === "success") {
        const savedJobIds = res.data.jobs.map((j) => j._id);
        setIsSaved(savedJobIds.includes(job._id));
      }
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const handleSaveJob = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${JOB_API_END_POINT}/save/${job._id}`,
        {
          status: isSaved ? 0 : 1,
          userId: user_id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-xl shadow-xl bg-white border border-gray-100 w-full">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs sm:text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button
          variant="outline"
          className={`rounded-full ${isSaved ? "bg-blue-100" : ""}`}
          size="icon"
          onClick={handleSaveJob}
          disabled={isLoading}
        >
          <Bookmark className={isSaved ? "fill-blue-500 text-blue-500" : ""} />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-base sm:text-lg">
            {job?.company?.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">India</p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div className="mb-3">
        <h1 className="font-bold text-base sm:text-lg mb-1">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-3">{job?.description}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge className="text-blue-700 font-bold" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-[#F83002] font-bold" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209b7] font-bold" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>

      {/* View Details Button */}
      <div className="mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Button>
      </div>
    </div>
  );
};

export default Job;

// import React, { useState, useEffect, useCallback } from "react";
// import { Button } from "./ui/button";
// import { Bookmark, Eye } from "lucide-react";
// import { Avatar, AvatarImage } from "./ui/avatar";
// import { Badge } from "./ui/badge";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { JOB_API_END_POINT } from "@/utils/constant";

// const Job = ({ job }) => {
//   const navigate = useNavigate();
//   const [isSaved, setIsSaved] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const user_id = localStorage.getItem("user_id");

//   const checkIfSaved = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
//         withCredentials: true,
//       });

//       if (res.data.status === "success") {
//         const savedJobIds = res.data.jobs.map((j) => j._id);
//         setIsSaved(savedJobIds.includes(job._id));
//       }
//     } catch (err) {
//       console.error("Error fetching saved jobs:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [job._id]);

//   useEffect(() => {
//     checkIfSaved();
//   }, [checkIfSaved]);

//   const daysAgoFunction = (mongodbTime) => {
//     const createdAt = new Date(mongodbTime);
//     const currentTime = new Date();
//     const timeDifference = currentTime - createdAt;
//     return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
//   };

//   const handleSaveJob = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.post(
//         `${JOB_API_END_POINT}/save/${job._id}`,
//         {
//           status: isSaved ? 0 : 1,
//           userId: user_id,
//         },
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setIsSaved(!isSaved);
//       }
//     } catch (error) {
//       console.error("Error saving job:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-5 rounded-xl shadow-xl bg-white border border-gray-100 w-full">
//       {/* Header Row */}
//       <div className="flex items-center justify-between mb-2">
//         <p className="text-xs sm:text-sm text-gray-500">
//           {daysAgoFunction(job?.createdAt) === 0
//             ? "Today"
//             : `${daysAgoFunction(job?.createdAt)} days ago`}
//         </p>
//         <Button
//           variant="outline"
//           className={`rounded-full ${isSaved ? "bg-blue-100" : ""}`}
//           size="icon"
//           onClick={handleSaveJob}
//           disabled={isLoading}
//         >
//           <Bookmark className={isSaved ? "fill-blue-500 text-blue-500" : ""} />
//         </Button>
//       </div>

//       {/* Company Info */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
//         <Button className="p-6" variant="outline" size="icon">
//           <Avatar>
//             <AvatarImage src={job?.company?.logo} />
//           </Avatar>
//         </Button>
//         <div>
//           <h1 className="font-medium text-base sm:text-lg">
//             {job?.company?.name}
//           </h1>
//           <p className="text-xs sm:text-sm text-gray-500">India</p>
//         </div>
//       </div>

//       {/* Job Title & Description */}
//       <div className="mb-3">
//         <h1 className="font-bold text-base sm:text-lg mb-1">{job?.title}</h1>
//         <p className="text-sm text-gray-600 line-clamp-3">{job?.description}</p>
//       </div>

//       {/* Badges */}
//       <div className="flex flex-wrap gap-2 mt-2">
//         <Badge className="text-blue-700 font-bold" variant="ghost">
//           {job?.position} Positions
//         </Badge>
//         <Badge className="text-[#F83002] font-bold" variant="ghost">
//           {job?.jobType}
//         </Badge>
//         <Badge className="text-[#7209b7] font-bold" variant="ghost">
//           {job?.salary} LPA
//         </Badge>
//       </div>

//       {/* View Details Button */}
//       <div className="mt-4">
//         <Button
//           onClick={() => navigate(`/description/${job?._id}`)}
//           variant="outline"
//           className="w-full flex items-center justify-center gap-2 text-sm sm:text-base"
//         >
//           <Eye className="w-4 h-4" />
//           View Details
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Job;
