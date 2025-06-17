import React, { useState, useEffect } from "react";
import axios from "axios";
import Job from "./Job";
import { toast } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
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
        } else {
          toast.error(response.data.message || "Failed to fetch saved jobs");
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch saved jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  // Calculate pagination values
  const totalPages = Math.ceil(savedJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = savedJobs.slice(startIndex, startIndex + jobsPerPage);

  // Handle page change
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of the range around current page
      let start = Math.max(
        2,
        currentPage - Math.floor(maxVisiblePages / 2) + 1
      );
      let end = Math.min(totalPages - 1, start + maxVisiblePages - 3);

      // Adjust if we're at the end
      if (end === totalPages - 1) {
        start = end - maxVisiblePages + 3;
      }

      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push("...");
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg">
          <p className="text-gray-600 text-xl mb-2">
            You haven't saved any jobs yet.
          </p>
          <p className="text-gray-500">
            Browse jobs and save the ones you're interested in.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {savedJobs.length > jobsPerPage && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronLeft size={20} />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((number, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof number === "number" && goToPage(number)
                    }
                    disabled={typeof number !== "number"}
                    className={`px-3 py-1 rounded-md ${
                      typeof number !== "number"
                        ? "text-gray-500 cursor-default"
                        : currentPage === number
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedJobs;
