import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function TwitterJobResponses() {
  return (
    <div className="rounded-md flex flex-col antialiased bg-white  items-center justify-center relative overflow-hidden p-6 py-10">
      <h1 className="text-4xl font-bold mx-auto">
        <span className="text-[#6A38C2]">User</span> Responses
      </h1>

      <InfiniteMovingCards items={twitterdata} direction="right" speed="slow" />
    </div>
  );
}

const twitterdata = [
  {
    quote:
      "Excited to see @TechCompany is hiring for a Software Engineer role! With 5 years of experience in full-stack development, I'm eager to bring my skills to your innovative team. #Hiring #SoftwareEngineer",
    name: "@jobseeker123",
    title: "Twitter Response",
    img: "https://th.bing.com/th/id/OIP.KdBSw8TPL34eU6T7bjhpAAHaLH?w=195&h=292&c=7&r=0&o=5&dpr=1.1&pid=1.7", // Replace with actual image URL
  },
  {
    quote:
      "Just applied for the Graphic Designer position at @DesignFirm! Looking forward to the opportunity to contribute to your amazing projects. #JobSearch #GraphicDesign",
    name: "@creativemind",
    title: "Twitter Response",
    img: "https://th.bing.com/th/id/OIP.Nw1A3CGvx46PBqyzaRirGQHaKs?w=195&h=281&c=7&r=0&o=5&dpr=1.1&pid=1.7", // Replace with actual image URL
  },
  {
    quote:
      "Thanks for the follow, @HRManager! I'm passionate about HR and would love to connect to discuss potential opportunities at @DreamCompany. #HR #Networking",
    name: "@networkpro",
    title: "Twitter Response",
    img: "https://th.bing.com/th/id/OIP.NqY3rNMnx2NXYo3KJfg43gHaHa?w=195&h=195&c=7&r=0&o=5&dpr=1.1&pid=1.7", // Replace with actual image URL
  },
  {
    quote:
      "Thrilled to share that I've secured an interview with @InnovateCorp for the Product Manager role! Fingers crossed for the next steps. #JobHunt #InterviewReady",
    name: "@careerbuilder",
    title: "Twitter Response",
    img: "https://th.bing.com/th/id/OIP.Rv5hzhHxzYHGKELo5TzKFQHaLH?w=195&h=292&c=7&r=0&o=5&dpr=1.1&pid=1.7", // Replace with actual image URL
  },
  {
    quote:
      "Recent graduate seeking entry-level positions in marketing. Any leads or opportunities would be greatly appreciated! #EntryLevel #MarketingJobs",
    name: "@freshgraduate",
    title: "Twitter Response",
    img: "https://th.bing.com/th/id/OIP.kLuVl7_2soHqjgecM56X2AHaLL?w=195&h=295&c=7&r=0&o=5&dpr=1.1&pid=1.7", // Replace with actual image URL
  },
  {
    quote:
      "Hi @jobseeker123! Thanks for your interest in our Software Engineer role. We'll review your application and get back to you soon. #Hiring #TechJobs",
    name: "@TechCompany",
    title: "Twitter Response",
    img: "https://th.bing.com/th/id/OIP.dQKmLGYl3kucD13lv2QOuAHaJQ?w=195&h=244&c=7&r=0&o=5&dpr=1.1&pid=1.7", // Replace with actual image URL
  },
];
