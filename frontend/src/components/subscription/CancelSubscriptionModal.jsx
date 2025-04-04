import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";

const CancelSubscriptionModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        localStorage.clear();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-center mb-4 text-red-600">
          Subscription Cancelled
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Your subscription has been successfully cancelled. If this was a
          mistake, you can re-subscribe from your profile.
        </p>

        <div className="flex justify-center gap-4">
          <Button
            className="bg-gray-300 hover:bg-gray-400 text-black"
            onClick={logoutHandler}
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;
