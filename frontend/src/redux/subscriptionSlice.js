// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     loading: false,
//     hasActiveSubscription: false,
//     subscription: null,
//     error: null
// };

// const subscriptionSlice = createSlice({
//     name: 'subscription',
//     initialState,
//     reducers: {
//         setSubscriptionLoading: (state, action) => {
//             state.loading = action.payload;
//         },
//         setSubscriptionStatus: (state, action) => {
//             state.hasActiveSubscription = action.payload.hasActiveSubscription;
//             state.subscription = action.payload.subscription;
//             state.error = null;
//         },
//         setSubscriptionError: (state, action) => {
//             state.error = action.payload;
//             state.loading = false;
//         },
//         clearSubscriptionState: (state) => {
//             return initialState;
//         }
//     }
// });

// export const {
//     setSubscriptionLoading,
//     setSubscriptionStatus,
//     setSubscriptionError,
//     clearSubscriptionState
// } = subscriptionSlice.actions;

// export default subscriptionSlice.reducer;

import { USER_API_END_POINT } from "@/utils/constant";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  hasActiveSubscription: false,
  subscription: null,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscriptionLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSubscriptionStatus: (state, action) => {
      state.hasActiveSubscription = action.payload.hasActiveSubscription;
      state.subscription = action.payload.subscription;
      state.error = null;
    },
    setSubscriptionError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSubscriptionState: () => initialState,
  },
});

export const {
  setSubscriptionLoading,
  setSubscriptionStatus,
  setSubscriptionError,
  clearSubscriptionState,
} = subscriptionSlice.actions;

// Thunk for checking subscription
export const checkSubscriptionThunk = (userId) => async (dispatch) => {
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
  } catch (error) {
    console.error("Subscription check failed:", error);
    dispatch(setSubscriptionError(error.message));
  } finally {
    dispatch(setSubscriptionLoading(false));
  }
};

export default subscriptionSlice.reducer;