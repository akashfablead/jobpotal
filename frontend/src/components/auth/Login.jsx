import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT, USER_API_GOOGLE_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import {
  setSubscriptionStatus,
  setSubscriptionLoading,
} from "@/redux/subscriptionSlice";

// const Login = () => {

//     const [input, setInput] = useState({
//         email: "",
//         password: "",
//         role: "",
//     });
//     const { loading,user } = useSelector(store => store.auth);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const changeEventHandler = (e) => {
//         setInput({ ...input, [e.target.name]: e.target.value });
//     }

//     const submitHandler = async (e) => {
//         e.preventDefault();
//         try {
//             dispatch(setLoading(true));
//             const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 withCredentials: true,
//             });
//             if (res.data.success) {
//                 dispatch(setUser(res.data.user));
//                 navigate("/");
//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error.response.data.message);
//         } finally {
//             dispatch(setLoading(false));
//         }
//     }
//     useEffect(()=>{
//         if(user){
//             navigate("/");
//         }
//     },[])
//     return (
//         <div>
//             <Navbar />
//             <div className='flex items-center justify-center max-w-7xl mx-auto'>
//                 <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
//                     <h1 className='font-bold text-xl mb-5'>Login</h1>
//                     <div className='my-2'>
//                         <Label>Email</Label>
//                         <Input
//                             type="email"
//                             value={input.email}
//                             name="email"
//                             onChange={changeEventHandler}
//                             placeholder="patel@gmail.com"
//                         />
//                     </div>

//                     <div className='my-2'>
//                         <Label>Password</Label>
//                         <Input
//                             type="password"
//                             value={input.password}
//                             name="password"
//                             onChange={changeEventHandler}
//                             placeholder="patel@gmail.com"
//                         />
//                     </div>
//                     <div className='flex items-center justify-between'>
//                         <RadioGroup className="flex items-center gap-4 my-5">
//                             <div className="flex items-center space-x-2">
//                                 <Input
//                                     type="radio"
//                                     name="role"
//                                     value="student"
//                                     checked={input.role === 'student'}
//                                     onChange={changeEventHandler}
//                                     className="cursor-pointer"
//                                 />
//                                 <Label htmlFor="r1">Student</Label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <Input
//                                     type="radio"
//                                     name="role"
//                                     value="recruiter"
//                                     checked={input.role === 'recruiter'}
//                                     onChange={changeEventHandler}
//                                     className="cursor-pointer"
//                                 />
//                                 <Label htmlFor="r2">Recruiter</Label>
//                             </div>
//                         </RadioGroup>
//                     </div>
//                     {
//                         loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Login</Button>
//                     }
//                     <span className='text-sm'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Login

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

  const checkSubscription = async (userId) => {
    try {
      dispatch(setSubscriptionLoading(true));
      const res = await axios.get(
        `${USER_API_END_POINT}/check-subscription/${userId}`,
        {
          withCredentials: true,
        }
      );

      if (!res.data) {
        throw new Error("No response data received");
      }

      dispatch(
        setSubscriptionStatus({
          hasActiveSubscription: res.data.hasActiveSubscription || false,
          subscription: res.data.subscription || null,
        })
      );

      return {
        hasSubscription: res.data.hasActiveSubscription || false,
        subscription: res.data.subscription || null,
      };
    } catch (error) {
      console.error("Subscription check failed:", error);
      toast.error(
        "Unable to verify subscription status. Please try again later."
      );
      return {
        hasSubscription: false,
        subscription: null,
      };
    } finally {
      dispatch(setSubscriptionLoading(false));
    }
  };

  const handleLoginSuccess = async (userData) => {
    if (!userData || !userData._id) {
      toast.error("Invalid user data received");
      return;
    }

    dispatch(setUser(userData));

    try {
      const { hasSubscription, subscription } = await checkSubscription(
        userData._id
      );
      console.log("Subscription status:", hasSubscription);

      // Store subscription status in local storage
      localStorage.setItem("hasActiveSubscription", hasSubscription);

      if (userData.role === "recruiter") {
        if (hasSubscription) {
          navigate("/admin/companies");
          toast.success(`Welcome back, ${userData.fullname}`);
        } else {
          navigate("/subscription");
        }
      } else {
        if (hasSubscription) {
          navigate("/");
          toast.success(`Welcome back, ${userData.fullname}`);
        } else {
          navigate("/subscription");
        }
      }
    } catch (error) {
      console.error("Error during login flow:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        await handleLoginSuccess(res.data.user);
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
        await handleLoginSuccess(res.data.user);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Google Login Failed");
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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
