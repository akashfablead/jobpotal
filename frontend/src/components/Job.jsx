import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if job is saved by the current user
    // const checkIfSaved = async () => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     if (!token) return;

    //     const response = await axios.get(
    //       `${import.meta.env.VITE_API_URL}/api/v1/job/saved`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );

    //     if (response.data.success) {
    //       // const savedJobs = response.data.jobs;
    //       // const isJobSaved = savedJobs.some(
    //       //   (savedJob) => savedJob._id === job._id
    //       // );

    //     }
    //   } catch (error) {
    //     console.error("Error checking saved status:", error);
    //   }
    // };
    const checkIfSaved = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
          withCredentials: true,
        });

        // ✅ Check for status and job list
        if (res.data.status === "success" && res.data.success) {
          setIsSaved(
            !isSaved && res.data.jobs.some((job) => job._id === job._id)
          );
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfSaved();
  }, [job._id]);

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const handleSaveJob = async () => {
    try {
      setIsLoading(true);

      // if (!localStorage.getItem("token")) {
      //   navigate("/login");
      //   return;
      // }

      // const formData = new FormData();
      // formData.append("status", isSaved ? 0 : 1);

      const response = await axios.post(
        `${JOB_API_END_POINT}/save/${job._id}`,
        {
          status: isSaved ? 0 : 1,
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
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
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

      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">India</p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className={"text-blue-700 font-bold"} variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className={"text-[#F83002] font-bold"} variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
          {job?.salary}LPA
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
        >
          Details
        </Button>
        {/* <Button
          className={`${isSaved ? "bg-blue-500" : "bg-[#7209b7]"}`}
          onClick={handleSaveJob}
          disabled={isLoading}
        >
          {isSaved ? "Saved" : "Save For Later"}
        </Button> */}
      </div>
    </div>
  );
};

export default Job;
