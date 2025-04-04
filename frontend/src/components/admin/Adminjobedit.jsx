// import React, { useEffect, useState } from "react";
// import Navbar from "../shared/Navbar";
// import { Button } from "../ui/button";
// import { ArrowLeft, Loader2 } from "lucide-react";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import axios from "axios";
// import { JOB_API_END_POINT } from "@/utils/constant";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";

// const JobEdit = () => {
//   const params = useParams();
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const [input, setInput] = useState({
//     title: "",
//     description: "",
//     requirements: "",
//     salary: "",
//     location: "",
//     jobType: "",
//     experience: "",
//     position: "",
//     companyId: "",
//   });

//   const changeEventHandler = (e) => {
//     setInput({ ...input, [e.target.name]: e.target.value });
//   };

//   // Fetch job details when component mounts
//   useEffect(() => {
//     const fetchJob = async () => {
//       try {
//         const res = await axios.get(`${JOB_API_END_POINT}/get/${params.id}`, {
//           withCredentials: true,
//         });
//         const job = res.data.job;
//         setInput({
//           title: job.title,
//           description: job.description,
//           requirements: job.requirements.join(","),
//           salary: job.salary,
//           location: job.location,
//           jobType: job.jobType,
//           experience: job.experienceLevel,
//           position: job.position,
//           companyId: job.company,
//         });
//       } catch (error) {
//         console.log(error);
//         toast.error("Failed to fetch job details");
//       }
//     };
//     fetchJob();
//   }, [params.id]);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const res = await axios.put(
//         `${JOB_API_END_POINT}/edit/${params.id}`,
//         input,
//         {
//           withCredentials: true,
//         }
//       );
//       if (res.data.success) {
//         toast.success(res.data.message);
//         navigate("/admin/jobs");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="max-w-xl mx-auto my-10">
//         <form onSubmit={submitHandler}>
//           <div className="flex items-center gap-5 p-8">
//             <Button
//               onClick={() => navigate("/admin/jobs")}
//               variant="outline"
//               className="flex items-center gap-2 text-gray-500 font-semibold"
//             >
//               <ArrowLeft />
//               <span>Back</span>
//             </Button>
//             <h1 className="font-bold text-xl">Edit Job</h1>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Label>Job Title</Label>
//               <Input
//                 type="text"
//                 name="title"
//                 value={input.title}
//                 onChange={changeEventHandler}
//               />
//             </div>
//             <div>
//               <Label>Description</Label>
//               <Textarea
//                 name="description"
//                 value={input.description}
//                 onChange={changeEventHandler}
//               />
//             </div>
//             <div>
//               <Label>Requirements (comma separated)</Label>
//               <Input
//                 type="text"
//                 name="requirements"
//                 value={input.requirements}
//                 onChange={changeEventHandler}
//               />
//             </div>
//             <div>
//               <Label>Salary</Label>
//               <Input
//                 type="number"
//                 name="salary"
//                 value={input.salary}
//                 onChange={changeEventHandler}
//               />
//             </div>
//             <div>
//               <Label>Location</Label>
//               <Input
//                 type="text"
//                 name="location"
//                 value={input.location}
//                 onChange={changeEventHandler}
//               />
//             </div>
//             <div>
//               <Label>Job Type</Label>
//               <Select
//                 name="jobType"
//                 value={input.jobType}
//                 onValueChange={(value) =>
//                   setInput({ ...input, jobType: value })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select job type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="full-time">Full Time</SelectItem>
//                   <SelectItem value="part-time">Part Time</SelectItem>
//                   <SelectItem value="contract">Contract</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Experience (years)</Label>
//               <Input
//                 type="number"
//                 name="experience"
//                 value={input.experience}
//                 onChange={changeEventHandler}
//               />
//             </div>
//             <div>
//               <Label>Number of Positions</Label>
//               <Input
//                 type="number"
//                 name="position"
//                 value={input.position}
//                 onChange={changeEventHandler}
//               />
//             </div>
//           </div>
//           {loading ? (
//             <Button className="w-full my-4" disabled>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Please wait
//             </Button>
//           ) : (
//             <Button type="submit" className="w-full my-4">
//               Update Job
//             </Button>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default JobEdit;

import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const JobEdit = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });
  const subscription = localStorage.getItem("hasActiveSubscription");
  const hasActiveSubscription = subscription === "true";

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${params.id}`, {
          withCredentials: true,
        });

        if (res.data.status === "success") {
          // setInput(res.data.job);
          const requirementsString = Array.isArray(res.data.job.requirements)
            ? res.data.job.requirements.join(", ")
            : res.data.job.requirements;

          setInput({
            title: res.data.job.title || "",
            description: res.data.job.description || "",
            requirements: requirementsString || "",
            salary: res.data.job.salary || "",
            location: res.data.job.location || "",
            jobType: res.data.job.jobType || "",
            experience: res.data.job.experienceLevel || "",
            position: res.data.job.position || "",
            companyId: res.data.job.company || "", // Update to use company field from response
          });
        } else {
          toast.error("Failed to fetch job details");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error(
          error.response?.data?.message || "Failed to fetch job details"
        );
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const validateForm = () => {
    const newErrors = {};
    if (!input.title.trim()) newErrors.title = "Job title is required";
    if (!input.description.trim())
      newErrors.description = "Description is required";
    if (!input.requirements.trim())
      newErrors.requirements = "Requirements are required";
    if (!input.salary) newErrors.salary = "Salary is required";
    if (!input.location.trim()) newErrors.location = "Location is required";
    if (!input.jobType) newErrors.jobType = "Job type is required";
    if (!input.experience) newErrors.experience = "Experience is required";
    if (!input.position) newErrors.position = "Number of positions is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Modify the submitHandler to use the new FormData
  // const submitHandler = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const formData = new FormData();

  //     if (input.companyId) {
  //       formData.append("companyId", input.companyId);
  //     }
  //     // Append basic fields
  //     formData.append("title", input.title);
  //     formData.append("description", input.description);
  //     formData.append("location", input.location);
  //     formData.append("jobType", input.jobType);

  //     // Convert and append numeric fields
  //     formData.append("experience", Number(input.experience));
  //     formData.append("position", Number(input.position));
  //     formData.append("salary", Number(input.salary));

  //     // Convert requirements to array and append
  //     const requirementsArray = input.requirements
  //       .split(",")
  //       .map((req) => req.trim());
  //     formData.append("requirements", JSON.stringify(requirementsArray));

  //     const res = await axios.post(
  //       `${JOB_API_END_POINT}/editjobs/${params.id}`,
  //       formData,
  //       {
  //         withCredentials: true,
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (res.data.status === "success") {
  //       toast.success(res.data.message);
  //       navigate("/admin/jobs");
  //     }
  //   } catch (error) {
  //     console.error("Error updating job:", error);
  //     toast.error(error.response?.data?.message || "Something went wrong");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const jobData = {
        title: input.title,
        description: input.description,
        requirements: input.requirements,
        salary: input.salary,
        location: input.location,
        jobType: input.jobType,
        experience: input.experience,
        position: input.position,
        companyId: input.companyId,
      };

      const res = await axios.post(
        `${JOB_API_END_POINT}/editjobs/${params.id}`,
        jobData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      } else {
        toast.error(res.data.message || "Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  if (!hasActiveSubscription) {
    return <Navigate to="/subscription" />;
  }
  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto my-10">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-5 p-8">
            <Button
              onClick={() => navigate("/admin/jobs")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-xl">Edit Job</h1>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Job Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Requirements (comma separated)</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Select
                value={input.jobType}
                onValueChange={(value) =>
                  setInput({ ...input, jobType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Experience (years)</Label>
              <Input
                type="number"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Number of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Update Job
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default JobEdit;
