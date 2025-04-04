import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4 py-16">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-xl w-full text-center animate-fade-in">
        <div className="text-green-500 text-6xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          Thank You for Subscribing!
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Your subscription was successful. You’ll get a confirmation email
          shortly.
        </p>

        <button
          onClick={handleGoHome}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 animate-fade-in-up"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
