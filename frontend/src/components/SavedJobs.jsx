import React, { useState, useEffect } from "react";
import axios from "axios";
import Job from "./Job";
import { toast } from "react-hot-toast";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/job/saved`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setSavedJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        toast.error("Failed to fetch saved jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            You haven't saved any jobs yet.
          </p>
          <p className="text-gray-400 mt-2">
            Browse jobs and save the ones you're interested in.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
