import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Company Info Section */}
          <div>
            <div className="flex items-center">
              <img src="/logo.png" alt="Job Hunt Logo" className="h-8 w-8 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Job Hunt</h2>
            </div>
            <p className="mt-4 max-w-md text-gray-600">
              Find your dream job with Job Hunt. Connect with top employers and discover 
              opportunities that match your skills and aspirations.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://facebook.com" className="text-gray-500 hover:text-blue-500 transition-colors" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.676 0H1.324C.593 0 0 .592 0 1.324v21.352C0 23.408.593 24 1.324 24H12.82V14.706H9.692v-3.578h3.128V8.408c0-3.1 1.893-4.787 4.657-4.787 1.325 0 2.463.1 2.794.144v3.238l-1.918.001c-1.503 0-1.794.715-1.794 1.762v2.31h3.587l-.468 3.578h-3.119V24h6.116C23.407 24 24 23.408 24 22.676V1.324C24 .592 23.407 0 22.676 0z" /></svg>
              </a>
              <a href="https://twitter.com" className="text-gray-500 hover:text-blue-400 transition-colors" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.835 9.835 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.867 9.867 0 01-3.127 1.195 4.924 4.924 0 00-8.38 4.49A13.978 13.978 0 011.67 3.149 4.93 4.93 0 003.16 9.724a4.903 4.903 0 01-2.229-.616v.062a4.93 4.93 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.93 4.93 0 004.6 3.417A9.869 9.869 0 010 21.543a13.978 13.978 0 007.548 2.212c9.057 0 14.01-7.507 14.01-14.01 0-.213-.004-.425-.015-.636A10.012 10.012 0 0024 4.557z" /></svg>
              </a>
              <a href="https://linkedin.com" className="text-gray-500 hover:text-blue-700 transition-colors" aria-label="LinkedIn">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452H16.85v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.94v5.666H9.147V9.756h3.448v1.464h.05c.48-.91 1.653-1.871 3.401-1.871 3.634 0 4.307 2.39 4.307 5.498v5.605zM5.337 8.29c-1.105 0-2-.896-2-2 0-1.106.895-2 2-2 1.104 0 2 .895 2 2 0 1.104-.896 2-2 2zM7.119 20.452H3.553V9.756h3.566v10.696zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451c.979 0 1.771-.774 1.771-1.729V1.729C24 .774 23.205 0 22.225 0z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <div>
              <p className="font-medium text-gray-900">For Job Seekers</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
                <Link to="/jobs" className="hover:text-blue-600">Browse Jobs</Link>
                <Link to="/profile" className="hover:text-blue-600">My Profile</Link>
                <Link to="/jobs" className="hover:text-blue-600">Saved Jobs</Link>
                <Link to="/profile" className="hover:text-blue-600">Applied Jobs</Link>
              </nav>
            </div>

            <div>
              <p className="font-medium text-gray-900">For Employers</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
                <Link to="/pricing" className="hover:text-blue-600">Pricing</Link>
                <Link to="/resources" className="hover:text-blue-600">Resources</Link>
                <Link to="/faq" className="hover:text-blue-600">FAQ</Link>
              </nav>
            </div>

            <div>
              <p className="font-medium text-gray-900">Company</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
                <Link to="/about" className="hover:text-blue-600">About Us</Link>
                <Link to="/contactus" className="hover:text-blue-600">Contact</Link>
                <Link to="/blog" className="hover:text-blue-600">Blog</Link>
              </nav>
            </div>

            <div>
              <p className="font-medium text-gray-900">Legal</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm text-gray-500">
                <Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-blue-600">Terms of Service</Link>
                <Link to="/cookies" className="hover:text-blue-600">Cookie Policy</Link>
                <Link to="/accessibility" className="hover:text-blue-600">Accessibility</Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-100 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-gray-500">
              <span className="block sm:inline">All rights reserved.</span>
              <span className="inline-block">© {new Date().getFullYear()} Job Hunt</span>
            </p>

            <p className="mt-4 text-sm text-gray-500 sm:order-first sm:mt-0">
              Made with ❤️ for job seekers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;