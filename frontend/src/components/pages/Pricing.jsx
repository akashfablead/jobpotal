import React from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const Pricing = () => {
  return (
    <>
    <Navbar />  
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Pricing</h1>
      <p className="text-gray-700 mb-4">
        Choose the best plan that suits your needs. Whether you're a job seeker or an employer, we have the right plan for you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic Plan */}
        <div className="border rounded-lg p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Basic</h2>
          <p className="text-gray-700 mt-2">$0 / month</p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>Access to job listings</li>
            <li>Save jobs</li>
            <li>Basic profile visibility</li>
          </ul>
          <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border rounded-lg p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Pro</h2>
          <p className="text-gray-700 mt-2">$29 / month</p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>All Basic features</li>
            <li>Priority support</li>
            <li>Advanced profile visibility</li>
          </ul>
          <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Upgrade
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="border rounded-lg p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Enterprise</h2>
          <p className="text-gray-700 mt-2">Custom Pricing</p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>All Pro features</li>
            <li>Dedicated account manager</li>
            <li>Custom integrations</li>
          </ul>
          <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Contact Us
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Pricing;