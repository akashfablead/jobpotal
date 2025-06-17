import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Contact,
  Mail,
  Pen,
  Calendar,
  MapPin,
  Linkedin,
  Globe,
  User,
  Briefcase,
  BookOpen,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { Link, useNavigate } from "react-router-dom";

const isResume = true;

const Profile = () => {
  useGetAppliedJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/updateprofile");
  };
  // Ensure user and user.profile are defined
  const userProfile = user?.profile || {};
  const userEducation = userProfile.education || [];
  const userExperience = userProfile.experience || [];

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.profile?.profilePhoto}
                alt={user?.fullname}
              />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              <p>{userProfile.bio}</p>
            </div>
          </div>
          <Link to="/updateprofile">
            <Button className="text-right" variant="outline">
              <Pen />
            </Button>
          </Link>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{user?.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <User />
            <span>{user?.gender}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Calendar />
            <span>
              {user?.dob ? new Date(user.dob).toLocaleDateString() : "NA"}
            </span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <MapPin />
            <span>{user?.location}</span>
          </div>
        </div>
        <div className="my-5">
          <h1 className="font-bold">About Me</h1>
          <p>{userProfile.about_me}</p>
        </div>
        <div className="my-5">
          <h1 className="font-bold">Skills</h1>
          <div className="flex items-center gap-1">
            {userProfile.skills?.length ? (
              userProfile.skills.map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>
        <div className="my-5">
          <h1 className="font-bold">Education</h1>
          {userEducation.length ? (
            userEducation.map((edu, index) => (
              <div key={index} className="my-2">
                <p>
                  <BookOpen className="inline mr-2" />
                  {edu.degree} from {edu.institution} in {edu.year}
                </p>
              </div>
            ))
          ) : (
            <span>NA</span>
          )}
        </div>
        <div className="my-5">
          <h1 className="font-bold">Experience</h1>
          {userExperience.length ? (
            userExperience.map((exp, index) => (
              <div key={index} className="my-2">
                <p>
                  <Briefcase className="inline mr-2" />
                  {exp.job_title} at {exp.company} for {exp.duration}
                </p>
              </div>
            ))
          ) : (
            <span>NA</span>
          )}
        </div>
        <div className="my-5">
          <h1 className="font-bold">Preferred Job Types</h1>
          <p>{userProfile.preferred_job_types?.join(", ") || "NA"}</p>
        </div>
        <div className="my-5">
          <h1 className="font-bold">Preferred Locations</h1>
          <p>{userProfile.preferred_locations?.join(", ") || "NA"}</p>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold">Resume</Label>
          {isResume ? (
            <a
              target="_blank"
              href={userProfile.resume_url}
              className="text-blue-500 w-full hover:underline cursor-pointer"
              rel="noopener noreferrer"
            >
              {userProfile.resumeOriginalName}
            </a>
          ) : (
            <span>NA</span>
          )}
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Linkedin />
            <a
              href={userProfile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              LinkedIn Profile
            </a>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Globe />
            <a
              href={userProfile.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Portfolio
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl">
        <h1 className="font-bold text-lg my-5">Applied Jobs</h1>
        <AppliedJobTable />
      </div>
    </div>
  );
};

export default Profile;
