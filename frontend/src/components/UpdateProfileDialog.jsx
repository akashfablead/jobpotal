import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";

const UpdateProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const skillOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "UI/UX",
    "HTML",
    "CSS",
    "TypeScript",
    "SQL",
  ];
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    gender: user?.gender || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    location: user?.location || "",
    linkedin_url: user?.profile?.linkedin_url || "",
    portfolio_url: user?.profile?.portfolio_url || "",
    about_me: user?.profile?.about_me || "",
    preferred_job_types: user?.profile?.preferred_job_types?.join(", ") || "",
    preferred_locations: user?.profile?.preferred_locations?.join(", ") || "",
  });

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const validateForm = () => {
    if (!input.fullname || !input.email) {
      toast.error("Full name and email are required.");
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (file) {
      formData.append("file", file);
    }

    // Convert comma-separated strings to arrays
    if (input.skills) {
      formData.append(
        "skills",
        input.skills.split(",").map((skill) => skill.trim())
      );
    }

    if (input.preferred_job_types) {
      formData.append(
        "preferred_job_types",
        input.preferred_job_types.split(",").map((type) => type.trim())
      );
    }
    if (input.preferred_locations) {
      formData.append(
        "preferred_locations",
        input.preferred_locations.split(",").map((location) => location.trim())
      );
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Profile updated successfully!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed!");
    } finally {
      setLoading(false);
    }
  };

  // const renderInput = (label, name, type = "text") => (
  //   <div className="grid grid-cols-4 items-center gap-4">
  //     <Label htmlFor={name} className="text-right">
  //       {label}
  //     </Label>
  //     <Input
  //       id={name}
  //       name={name}
  //       type={type}
  //       value={input[name]}
  //       onChange={changeHandler}
  //       className="col-span-3"
  //     />
  //   </div>
  // );

  const renderInput = (label, name, type = "text", disabled = false) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={name} className="text-right">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={input[name]}
        onChange={changeHandler}
        disabled={disabled}
        className="col-span-3 bg-gray-100 cursor-not-allowed"
      />
    </div>
  );

  const renderSelect = (label, name, options) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={name} className="text-right">
        {label}
      </Label>
      <select
        id={name}
        name={name}
        value={input[name]}
        onChange={changeHandler}
        className="col-span-3 p-2 border rounded"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
  const renderMultiSelect = (label, name, options) => (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={name} className="text-right">
        {label}
      </Label>
      <select
        id={name}
        name={name}
        multiple
        value={input[name]}
        onChange={(e) => {
          const selected = Array.from(
            e.target.selectedOptions,
            (opt) => opt.value
          );
          setInput({ ...input, [name]: selected });
        }}
        className="col-span-3 p-2 border rounded h-32"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow-sm">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Update Your Profile
        </h1>
        <form onSubmit={submitHandler} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700 border-b pb-2">
              Contact Information
            </h2>
            {renderInput("Full Name", "fullname", "fullname", true)}
            {renderInput("Email", "email", "email", true)}
            {renderInput("Phone Number", "phoneNumber")}
            {renderInput("Location", "location")}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700 border-b pb-2">
              Personal Details
            </h2>
            {renderSelect("Gender", "gender", genderOptions)}
            {renderInput("Date of Birth", "dob", "date")}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700 border-b pb-2">
              Professional Info
            </h2>
            {renderInput("Bio", "bio")}
            {renderMultiSelect("Skills", "skills", skillOptions)}
            {renderInput("LinkedIn URL", "linkedin_url")}
            {renderInput("Portfolio URL", "portfolio_url")}
            {renderInput("About Me", "about_me")}
            {renderInput("Preferred Job Types", "preferred_job_types")}
            {renderInput("Preferred Locations", "preferred_locations")}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Upload Resume (PDF)
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="application/pdf"
              onChange={fileChangeHandler}
              className="col-span-3"
            />
          </div>

          <div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfilePage;
