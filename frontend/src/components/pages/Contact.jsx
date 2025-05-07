import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import { CONTACT_API_END_POINT } from '@/utils/constant';
import Footer from '../shared/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      // Send the form data to the backend API
      const formData = new FormData();
      formData.append("name", formData.name);
      formData.append("email",  formData.email);
      formData.append("message",  formData.message);

      const response = await axios.post(
        `${CONTACT_API_END_POINT}/contactform`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',

          },
        withCredentials: true,
        }
      );
      if (response.status === 201) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setStatus('An error occurred. Please try again.');
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-screen-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
    </div>
    <Footer />
    </>
  );
};

export default Contact;