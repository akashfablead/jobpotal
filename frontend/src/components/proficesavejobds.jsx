import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { JOB_API_END_POINT } from "@/utils/constant";
import Navbar from "./shared/Navbar";
import AppliedJobTable from "./AppliedJobTable";
import { toast } from "sonner";

const ProficesavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
        withCredentials: true,
      });

      // ✅ Check for status and job list
      if (
        res.data.status === "success" &&
        res.data.success &&
        Array.isArray(res.data.jobs)
      ) {
        setSavedJobs(res.data.jobs);
      } else {
        setSavedJobs([]);
      }
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      const formData = new FormData();
      formData.append("status", 0);

      const res = await axios.post(
        `${JOB_API_END_POINT}/unsave/${jobId}`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.data.status === "success" && res.data.success) {
        setSavedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
        toast.success(res.data.message);
      }
    } catch (err) {
      console.error("Error unsaving job:", err);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  // return (
  //   <>
  //     <Navbar />
  //     <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
  //       <h2 className="font-bold text-lg mb-4">Saved Jobs</h2>
  //       {savedJobs.length > 0 ? (
  //         <div className="space-y-4">
  //           {savedJobs.map((job) => (
  //             <div
  //               key={job._id}
  //               className="border border-gray-200 rounded-lg p-4 flex items-start gap-4"
  //             >
  //               {/* Company Logo */}
  //               {job.company?.logo && (
  //                 <img
  //                   src={job.company.logo}
  //                   alt={job.company.name}
  //                   className="w-16 h-16 object-contain rounded"
  //                 />
  //               )}

  //               {/* Job Info */}
  //               <div>
  //                 <h3 className="font-medium text-xl">{job.title}</h3>
  //                 <p className="text-gray-600">{job.company?.name}</p>
  //                 <p className="text-gray-500">{job.location}</p>
  //                 <p className="text-sm text-gray-400">
  //                   {job.jobType} | ₹{job.salary}
  //                 </p>
  //                 <p className="text-sm text-gray-400">
  //                   Skills: {job.requirements?.join(", ")}
  //                 </p>

  //                 <Button
  //                   onClick={() => handleUnsaveJob(job._id)}
  //                   variant="outline"
  //                   className="mt-3"
  //                 >
  //                   Unsave Job
  //                 </Button>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       ) : (
  //         <p>No saved jobs found.</p>
  //       )}
  //     </div>
  //   </>
  // );

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Saved Jobs</h2>

        {savedJobs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {savedJobs.map((job) => (
              <div
                key={job._id}
                className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col sm:flex-row gap-4"
              >
                {/* Logo */}
                {job.company?.logo && (
                  <div className="w-full sm:w-auto sm:shrink-0">
                    <img
                      src={job.company.logo}
                      alt={job.company.name}
                      className="w-20 h-20 object-contain rounded-lg border"
                    />
                  </div>
                )}

                {/* Job Details */}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {job.title}
                  </h3>
                  <p className="text-gray-600">{job.company?.name}</p>
                  <p className="text-gray-500 text-sm">{job.location}</p>

                  <div className="mt-2 text-sm text-gray-400 space-y-1">
                    <p>
                      {job.jobType} | ₹{job.salary}
                    </p>
                    <p>Skills: {job.requirements?.join(", ")}</p>
                  </div>

                  <Button
                    onClick={() => handleUnsaveJob(job._id)}
                    variant="outline"
                    className="mt-4"
                  >
                    Unsave Job
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">💼 No saved jobs found.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProficesavedJobs;
