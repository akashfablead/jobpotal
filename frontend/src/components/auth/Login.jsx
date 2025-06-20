import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  USER_API_END_POINT,
  USER_API_GOOGLE_END_POINT,
} from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    // debugger;
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success === true) {
        const userData = res.data.user;
        dispatch(setUser(userData));
        localStorage.setItem(
          "hasActiveSubscription",
          res.data.user.hasActiveSubscription
        );
        localStorage.setItem("user_id", res.data.user._id);
        console.log(
          "Subscription status:",
          res.data.user.hasActiveSubscription
        );

        if (userData.role === "recruiter") {
          if (res.data.user.hasActiveSubscription === true) {
            navigate("/admin/companies");
            toast.success(`Welcome back, ${userData.fullname}`);
          } else {
            navigate("/subscription");
          }
        } else if (userData.role === "student") {
          if (res.data.user.hasActiveSubscription === true) {
            navigate("/");
            toast.success(`Welcome back, ${userData.fullname}`);
          } else {
            navigate("/subscription");
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_GOOGLE_END_POINT}/google`,
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      if (res.data.success) {
        const userData = res.data.user;
        dispatch(setUser(userData));
        const { hasSubscription } = await checkSubscription(userData._id);
        console.log("Subscription status:", hasSubscription);
        localStorage.setItem("hasActiveSubscription", hasSubscription);
        localStorage.setItem("user_id", res.data.user._id);

        if (userData.role === "recruiter") {
          if (hasSubscription) {
            navigate("/admin/companies");
            toast.success(`Welcome back, ${userData.fullname}`);
            localStorage.setItem("user_id", res.data.user._id);
          } else {
            navigate("/subscription");
            localStorage.setItem("user_id", res.data.user._id);
          }
        } else {
          if (hasSubscription) {
            navigate("/");
            toast.success(`Welcome back, ${userData.fullname}`);
          } else {
            navigate("/subscription");
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Google Login Failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // useEffect(() => {
  //   const userId = localStorage.getItem("user_id");
  //   if (userId) {
  //     const hasActiveSubscription =
  //       localStorage.getItem("hasActiveSubscription") === "true";
  //     if (hasActiveSubscription) {
  //       navigate("/");
  //     } else {
  //       navigate("/subscription");
  //     }
  //   }
  // }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>

          {/* Google Login Button */}
          <div className="flex justify-center mb-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast.error("Google Login Failed");
              }}
              useOneTap
            />
          </div>

          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t w-full border-gray-300" />
            <span className="bg-white px-2 text-gray-500 text-sm">OR</span>
            <div className="border-t w-full border-gray-300" />
          </div>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="patel@gmail.com"
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="patel@gmail.com"
            />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Login
            </Button>
          )}
          <span className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
