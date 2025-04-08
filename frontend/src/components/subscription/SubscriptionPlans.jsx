import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  SUBSCRIPTION_API_END_POINT,
  USER_API_END_POINT,
} from "@/utils/constant";
import { Card } from "../ui/card";
import { useSelector } from "react-redux";
import { setSubscriptionStatus } from "@/redux/subscriptionSlice";
import { use } from "react";

const plans = [
  {
    name: "Monthly",
    id: "monthly", // Add this field
    price: 999.0,
    period: "month",
    features: ["Access to all jobs", "Basic support", "Profile customization"],
  },
  {
    name: "Semi Annual",
    id: "semi_annual",
    price: 4999.0,
    period: "6 months",
    features: [
      "Everything in Monthly",
      "Priority support",
      "Featured profile",
      "Early access to new jobs",
    ],
  },
  {
    name: "Annual",
    id: "annual", // Add this field
    price: 8999.0,
    period: "year",
    features: [
      "Everything in Semi-Annual",
      "Premium support",
      "Custom profile badge",
      "Job alerts",
      "Analytics dashboard",
    ],
  },
];

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Add this line
  const [sessionId, setSessionId] = useState(null); // Add this line

  const handleSubscribe = async (planId) => {
    try {
      if (!user) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${SUBSCRIPTION_API_END_POINT}/create`,
        {
          planType: planId,
          customerInfo: {
            name: user.fullname || "",
            email: user.email || "",
            address: {
              line1: user.address || "Default Address",
              city: user.city || "Default City",
              state: user.state || "Default State",
              postal_code: user.postalCode || "000000",
              country: "IN",
            },
          },
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.data && response.data.data.url) {
        window.location.href = response.data.data.url;
        localStorage.setItem("hasActiveSubscription", true);
        localStorage.setItem(
          "subscription",
          JSON.stringify(response.data.subscription)
        );
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(
        error.response?.data?.message || "Failed to create subscription"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        Choose Your Plan
      </h2>
      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Divider lines */}
        <div className="hidden md:block absolute top-10 bottom-10 left-1/3 w-px bg-gray-200"></div>
        <div className="hidden md:block absolute top-10 bottom-10 right-1/3 w-px bg-gray-200"></div>

        {plans.map((plan, index) => (
          <Card
            key={plan.name}
            className={`p-6 transition-all duration-300 bg-white rounded-xl border ${
              index === 1
                ? "border-primary shadow-lg scale-105 z-10"
                : "border-gray-200 hover:shadow-md"
            }`}
          >
            {index === 1 && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular Choice
              </div>
            )}
            <div className="text-center">
              <h3
                className={`text-2xl font-bold mb-2 ${
                  index === 1 ? "text-primary" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>
              <p className="text-4xl font-bold mb-4 text-gray-900">
                ₹{plan.price}
                <span className="text-base font-normal text-gray-600">
                  /{plan.period}
                </span>
              </p>
            </div>
            <div className="my-8 h-px bg-gray-100"></div>
            <div className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center">
                  <Check
                    className={`h-5 w-5 mr-2 flex-shrink-0 ${
                      index === 1 ? "text-primary" : "text-green-500"
                    }`}
                  />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            <Button
              className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${
                index === 1
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-900"
              }`}
              onClick={() => handleSubscribe(plan.id)} // Use plan.id instead of plan.name
            >
              {index === 1 ? "Get Started" : "Subscribe Now"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
