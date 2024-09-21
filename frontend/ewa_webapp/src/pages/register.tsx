import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../assets/Banner2.jpg'; 

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

 
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Registering with:', formData);
    navigate('/dashboard'); 
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Section (Register Form) */}
      <div className="flex flex-col justify-center w-1/2 px-12 bg-black text-white">
        <h1 className="text-4xl font-bold mb-6">Create an Account</h1>
        <p className="text-lg mb-8 text-gray-400">Register to access your account</p>

        <form onSubmit={handleRegister} className="w-full">
          {/* First Name Field */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-400">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your first name"
              required
            />
          </div>

          {/* Last Name Field */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-400">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your last name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-400">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-400">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-400">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-md text-white text-lg font-semibold"
          >
            Register
          </button>
        </form>
      </div>

      {/* Right Section (Banner Image) */}
      <div className="hidden md:flex w-1/2">
        <img
          src={Banner}
          alt="Banner"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Register;
