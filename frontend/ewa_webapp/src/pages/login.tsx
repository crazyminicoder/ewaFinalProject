import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../assets/Banner.jpg'; 

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const navigate = useNavigate(); 

  
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Logging in with:', formData);
    navigate('/dashboard');
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Section (Login Form) */}
      <div className="flex flex-col justify-center w-1/2 px-12 bg-black text-white">
        <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
        <p className="text-lg mb-8 text-gray-400">Log in to your account to continue</p>

        <form onSubmit={handleLogin} className="w-full">
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
            <div className="relative">
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
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-between text-sm mb-6">
            <a href="#" className="text-red-500 hover:underline">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-md text-white text-lg font-semibold"
          >
            Log In
          </button>
        </form>

        {/* Links to Register and Home */}
        <div className="mt-6 flex justify-between text-sm">
          <a href="/register" className="text-blue-500 hover:underline">Don't have an account? Register</a>
          <a href="/" className="text-blue-500 hover:underline">Back to Home</a>
        </div>
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

export default Login;
