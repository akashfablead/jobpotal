import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Clock,
  Home,
  Globe,
  Share2,
  Bookmark,
  Building,
  GraduationCap,
  ArrowRight,
  Star,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import Navbar from "./shared/Navbar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);
  const [isSaved, setIsSaved] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/saved`, {
          withCredentials: true,
        });

        if (res.data.status === "success") {
          const savedJobIds = res.data.jobs.map((j) => j._id);
          setIsSaved(savedJobIds.includes(jobId));
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      }
    };

    checkIfSaved();
  }, [user_id]);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      if (!singleJob?.title) return;

      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/similar/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setSimilarJobs(
            res.data.jobs.filter((job) => job._id !== jobId).slice(0, 4)
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarJobs();
  }, [jobId, singleJob?.title]);

  const handleSaveJob = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${JOB_API_END_POINT}/save/${jobId}`,
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
        toast.success(
          isSaved ? "Job removed from saved" : "Job saved successfully"
        );
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job");
    } finally {
      setIsLoading(false);
    }
  };

  // if (!hasActiveSubscription) {
  //   return <Navigate to="/subscription" />;
  // }
  return (
    <div>
      <Navbar />
      <div className="mx-auto my-10 px-4">
        {/* Header Section */}
        <div className="mb-6">
          <Link
            to={"/"}
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Company Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-4">
            {singleJob?.company?.logo && (
              <img
                src={singleJob.company.logo}
                alt={singleJob.company.name}
                className="w-25 h-25 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                {singleJob?.company?.name}
              </h3>
              <p className="text-gray-600 mt-1 mb-2">
                {singleJob?.company?.description}
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {singleJob?.company?.location}
                </span>
                {singleJob?.company?.website && (
                  <a
                    href={`https://${singleJob.company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Job Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {singleJob?.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {singleJob?.jobType}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {singleJob?.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {singleJob?.salary} LPA
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  {singleJob?.position} Positions
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  {singleJob?.experienceLevel} Years Exp
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={isApplied ? null : applyJobHandler}
                disabled={isApplied}
                className={`w-full md:w-auto px-8 py-2 rounded-full ${
                  isApplied
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isApplied ? "✓ Already Applied" : "Apply Now"}
              </Button>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-4">Share this job</h3>
                      <div className="flex flex-col gap-3">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied!");
                          }}
                        >
                          Copy Link
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            window.open(
                              `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`
                            )
                          }
                        >
                          Share on LinkedIn
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setIsSaved(!isSaved);
                    toast.success(
                      isSaved ? "Removed from saved" : "Job saved successfully"
                    );
                  }}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                  />
                  {isSaved ? "Saved" : "Save Job"}
                </Button> */}
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 rounded-full ${
                    isSaved ? "bg-blue-100" : ""
                  }`}
                  onClick={handleSaveJob}
                  disabled={isLoading}
                >
                  <Bookmark
                    className={isSaved ? "fill-blue-500 text-blue-500" : ""}
                  />
                  {isSaved ? "Saved" : "Save Job"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Total Applicants</p>
                <p className="font-semibold">
                  {singleJob?.applications?.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Posted Date</p>
                <p className="font-semibold">
                  {singleJob?.createdAt.split("T")[0]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Application Deadline</p>
                <p className="font-semibold">
                  {singleJob?.deadline
                    ? new Date(singleJob.deadline).toLocaleDateString()
                    : "No deadline set"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="whitespace-pre-line">{singleJob?.description}</p>
            </div>

            {/* Requirements Section */}
            {singleJob?.requirements && singleJob.requirements.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {singleJob.requirements.map((requirement, index) => (
                    <li key={index} className="text-gray-700">
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Section */}
            {singleJob?.skills && singleJob.skills.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {singleJob.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 bg-gray-50"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits Section */}
            {singleJob?.benefits && singleJob.benefits.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3">Benefits & Perks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {singleJob.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Jobs Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Similar Jobs</h2>
              <Link
                to="/jobs"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {similarJobs.length > 0 ? (
              <div className="mt-4">
                <Slider
                  dots={false}
                  infinite={true}
                  speed={500}
                  autoplay={true}
                  autoplaySpeed={5000}
                  slidesToShow={2}
                  slidesToScroll={1}
                  arrows={true}
                  responsive={[
                    {
                      breakpoint: 768,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false,
                      },
                    },
                  ]}
                  className="similar-jobs-slider"
                >
                  {similarJobs.map((job) => (
                    <div key={job._id} className="px-2 py-1">
                      <Link
                        to={`/description/${job._id}`}
                        className="block p-4 border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white hover:border-blue-100"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                            {job.company?.logo ? (
                              <img
                                src={job.company.logo}
                                alt={job.company.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Building className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 truncate text-lg">
                                {job.title}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 ml-2"
                              >
                                {job.jobType || "Full-time"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {job.company?.name}
                            </p>
                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                              <div className="flex items-center gap-1 text-gray-600 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate max-w-[120px]">
                                  {job.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600 text-sm">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary} LPA</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {job.createdAt
                                    ? new Date(
                                        job.createdAt
                                      ).toLocaleDateString()
                                    : "Recently"}
                                </span>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {job.skills?.slice(0, 3).map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {job.skills?.length > 3 && (
                                <span className="text-gray-500 text-xs">
                                  +{job.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-gray-500 mt-2">No similar jobs found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
