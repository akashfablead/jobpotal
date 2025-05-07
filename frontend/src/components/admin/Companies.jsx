import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { Navigate, useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { checkSubscription } from "@/utils/checkSubscription";

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const userId = localStorage.getItem("userId"); // Ensure you have the userId in local storage
      if (userId) {
        const subscriptionStatus = await checkSubscription(userId, dispatch);
        setHasActiveSubscription(subscriptionStatus.hasSubscription);
        localStorage.setItem(
          "hasActiveSubscription",
          subscriptionStatus.hasSubscription
        );
      }
    };

    fetchSubscriptionStatus();
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);

  // if (!hasActiveSubscription) {
  //   return <Navigate to="/subscription" />;
  // }
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by name"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/companies/create")}>
            New Company
          </Button>
        </div>
        <CompaniesTable />
      </div>
    </div>
  );
};

export default Companies;
