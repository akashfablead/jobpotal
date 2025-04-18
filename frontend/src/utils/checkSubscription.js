import axios from "axios";
import { setSubscriptionStatus, setSubscriptionLoading } from "../redux/subscriptionSlice";

const USER_API_END_POINT = import.meta.env.VITE_USER_API;

export const checkSubscription = async (userId, dispatch) => {
  try {
    dispatch(setSubscriptionLoading(true));
    const res = await axios.get(
      `${USER_API_END_POINT}/check-subscription/${userId}`,
      { withCredentials: true }
    );

    if (!res.data) throw new Error("No response data received");

    dispatch(setSubscriptionStatus({
      hasActiveSubscription: res.data.hasActiveSubscription || false,
      subscription: res.data.subscription || null,
    }));

    return {
      hasSubscription: res.data.hasActiveSubscription || false,
      subscription: res.data.subscription || null,
    };
  } catch (error) {
    console.error("Subscription check failed:", error);
    return { hasSubscription: false };
  } finally {
    dispatch(setSubscriptionLoading(false));
  }
};
