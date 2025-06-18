import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, PlusCircle, MinusCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import MultiSelectRadix from "./ui/MultiSelectRadix";

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

  const jobTypeOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
    "Remote",
  ];

  const locationOptions = [
    "New York",
    "San Francisco",
    "Los Angeles",
    "Chicago",
    "Austin",
    "Seattle",
  ];

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: Array.isArray(user?.profile?.skills)
      ? user.profile.skills
      : user?.profile?.skills
      ? user.profile.skills.split(",").map((skill) => skill.trim())
      : [],
    gender: user?.gender || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    location: user?.location || "",
    linkedin_url: user?.profile?.linkedin_url || "",
    portfolio_url: user?.profile?.portfolio_url || "",
    about_me: user?.profile?.about_me || "",
    preferred_job_types: Array.isArray(user?.profile?.preferred_job_types)
      ? user.profile.preferred_job_types
      : user?.profile?.preferred_job_types
      ? user.profile.preferred_job_types.split(",").map((type) => type.trim())
      : [],
    preferred_locations: Array.isArray(user?.profile?.preferred_locations)
      ? user.profile.preferred_locations
      : user?.profile?.preferred_locations
      ? user.profile.preferred_locations
          .split(",")
          .map((location) => location.trim())
      : [],
    experience: [
      {
        title: "",
        company: "",
        years: "",
      },
    ],
    education: [
      {
        degree: "",
        institute: "",
        year: "",
      },
    ],
  });

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const experienceChangeHandler = (index, field, value) => {
    const newExperiences = [...input.experience];
    newExperiences[index][field] = value;
    setInput({ ...input, experience: newExperiences });
  };

  const educationChangeHandler = (index, field, value) => {
    const newEducation = [...input.education];
    newEducation[index][field] = value;
    setInput({ ...input, education: newEducation });
  };

  const addExperience = () => {
    setInput({
      ...input,
      experience: [
        ...input.experience,
        {
          title: "",
          company: "",
          years: "",
        },
      ],
    });
  };

  const removeExperience = (index) => {
    const newExperiences = input.experience.filter((_, i) => i !== index);
    setInput({ ...input, experience: newExperiences });
  };

  const addEducation = () => {
    setInput({
      ...input,
      education: [
        ...input.education,
        {
          degree: "",
          institute: "",
          year: "",
        },
      ],
    });
  };

  const removeEducation = (index) => {
    const newEducation = input.education.filter((_, i) => i !== index);
    setInput({ ...input, education: newEducation });
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
      if (
        key !== "skills" &&
        key !== "preferred_job_types" &&
        key !== "preferred_locations" &&
        key !== "experience" &&
        key !== "education"
      ) {
        formData.append(key, value);
      }
    });

    if (file) {
      formData.append("file", file);
    }

    input.skills.forEach((skill) => {
      formData.append("skills[]", skill);
    });

    input.preferred_job_types.forEach((type) => {
      formData.append("preferred_job_types[]", type);
    });

    input.preferred_locations.forEach((location) => {
      formData.append("preferred_locations[]", location);
    });

    input.experience.forEach((exp, index) => {
      formData.append(`experience[${index}][title]`, exp.title);
      formData.append(`experience[${index}][company]`, exp.company);
      formData.append(`experience[${index}][years]`, exp.years);
    });

    input.education.forEach((edu, index) => {
      formData.append(`education[${index}][degree]`, edu.degree);
      formData.append(`education[${index}][institute]`, edu.institute);
      formData.append(`education[${index}][year]`, edu.year);
    });

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

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const renderMultiSelect = (label, name, options) => (
    <MultiSelectRadix
      label={label}
      name={name}
      options={options}
      values={
        Array.isArray(input[name])
          ? input[name]
          : input[name].split(",").map((s) => s.trim())
      }
      onChange={(name, selected) => setInput({ ...input, [name]: selected })}
    />
  );

  const renderExperienceFields = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-700 border-b pb-2">
        Experience
      </h2>
      {input.experience.map((exp, index) => (
        <div key={index} className="space-y-2 border p-4 rounded">
          <Input
            placeholder="Title"
            value={exp.title}
            onChange={(e) =>
              experienceChangeHandler(index, "title", e.target.value)
            }
          />
          <Input
            placeholder="Company"
            value={exp.company}
            onChange={(e) =>
              experienceChangeHandler(index, "company", e.target.value)
            }
          />
          <Input
            placeholder="Years"
            value={exp.years}
            onChange={(e) =>
              experienceChangeHandler(index, "years", e.target.value)
            }
          />
          {index !== 0 && (
            <Button
              type="button"
              onClick={() => removeExperience(index)}
              variant="destructive"
              size="sm"
            >
              <MinusCircle className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      ))}
      <Button type="button" onClick={addExperience} variant="outline">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );

  const renderEducationFields = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-700 border-b pb-2">
        Education
      </h2>
      {input.education.map((edu, index) => (
        <div key={index} className="space-y-2 border p-4 rounded">
          <Input
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) =>
              educationChangeHandler(index, "degree", e.target.value)
            }
          />
          <Input
            placeholder="Institute"
            value={edu.institute}
            onChange={(e) =>
              educationChangeHandler(index, "institute", e.target.value)
            }
          />
          <Input
            placeholder="Year"
            value={edu.year}
            onChange={(e) =>
              educationChangeHandler(index, "year", e.target.value)
            }
          />
          {index !== 0 && (
            <Button
              type="button"
              onClick={() => removeEducation(index)}
              variant="destructive"
              size="sm"
            >
              <MinusCircle className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      ))}
      <Button type="button" onClick={addEducation} variant="outline">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>
  );

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
            {renderInput("Full Name", "fullname", "text", true)}
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
            {renderMultiSelect(
              "Preferred Job Types",
              "preferred_job_types",
              jobTypeOptions
            )}
            {renderMultiSelect(
              "Preferred Locations",
              "preferred_locations",
              locationOptions
            )}
          </div>

          {renderExperienceFields()}
          {renderEducationFields()}

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
