import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetup from "./components/admin/CompanySetup";
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./redux/store";
import JobEdit from "./components/admin/Adminjobedit";
import SubscriptionPlans from "./components/subscription/SubscriptionPlans";
import ThankYouPage from "./components/subscription/ThankYouPage";
import CancelSubscriptionModal from "./components/subscription/CancelSubscriptionModal";
import FAQ from "./components/pages/FAQ";
import Resources from "./components/pages/Resources";
import Pricing from "./components/pages/Pricing";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import ProficesavedJobs from "./components/proficesavejobds";
import UpdateProfilePage from "./components/UpdateProfileDialog";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/faq",
    element: <FAQ />,
  },
  {
    path: "/resources",
    element: <Resources />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contactus",
    element: <Contact />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/updateprofile",
    element: <UpdateProfilePage />,
  },
  {
    path: "/savedjobs",
    element: <ProficesavedJobs />,
  },
  {
    path: "/subscription/thank-you",
    element: (
      // <ProtectedRoute>
      <ThankYouPage />
      // </ProtectedRoute>
    ),
  },

  {
    path: "/subscription/cancel",
    element: (
      // <ProtectedRoute>
      <CancelSubscriptionModal />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/subscription",
    element: <SubscriptionPlans />,
  },
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobsedit/:id",
    element: (
      <ProtectedRoute>
        <JobEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
]);
function App() {
  return (
    <div>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Provider store={store}>
          <RouterProvider router={appRouter} />
        </Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
