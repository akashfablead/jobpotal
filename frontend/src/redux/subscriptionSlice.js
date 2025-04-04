import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    hasActiveSubscription: false,
    subscription: null,
    error: null
};

const subscriptionSlice = createSlice({
    name: 'subscription',
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
        clearSubscriptionState: (state) => {
            return initialState;
        }
    }
});

export const {
    setSubscriptionLoading,
    setSubscriptionStatus,
    setSubscriptionError,
    clearSubscriptionState
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;