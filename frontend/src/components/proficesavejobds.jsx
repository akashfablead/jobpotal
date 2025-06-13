// SavedJobs.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchSavedJobs, unsaveJob } from "../actions/jobActions";
// import { fetchSavedJobsApi, unsaveJobApi } from "../api";
import { Button } from "./ui/button";

const ProficesavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((state) => state.jobs);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobs = await fetchSavedJobsApi();
      dispatch(fetchSavedJobs(jobs));
    };
    fetchJobs();
  }, [dispatch]);

  const handleUnsaveJob = async (jobId) => {
    await unsaveJobApi(jobId);
    dispatch(unsaveJob(jobId));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
      <h2 className="font-bold text-lg mb-4">Saved Jobs</h2>
      {savedJobs.length > 0 ? (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-xl">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500">{job.location}</p>
              <Button
                onClick={() => handleUnsaveJob(job.id)}
                variant="outline"
                className="mt-2"
              >
                Unsave Job
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p>No saved jobs.</p>
      )}
    </div>
  );
};

export default ProficesavedJobs;
