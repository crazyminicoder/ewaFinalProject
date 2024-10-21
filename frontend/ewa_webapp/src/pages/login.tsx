import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Banner from '../assets/Banner.jpg';

interface FormData {
  email: string;
  password: string;
}

// Helper function to decode JWT token
function decodeToken(token: string): { id: number; email: string } | null {
  try {
      const base64Url = token.split('.')[1]; // Get the payload part of the token
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
          atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
      );

      return JSON.parse(jsonPayload); // Convert the JSON string into an object
  } catch (error) {
      console.error('Invalid token:', error);
      return null;
  }
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', { // Replace with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("login data = ",data)

      if (response.ok) {
        const decodedToken = decodeToken(data.token);
            if (decodedToken) {
                localStorage.setItem('userId', decodedToken.id.toString()); // Store userId in localStorage
                alert('Login successful!');
                // Navigate to a different page or dashboard
            } else {
                alert('Failed to decode token.');
          }
        localStorage.setItem('token', data.token); // Store token for authenticated routes
        toast.success('Welcome back, champion. Time to conquer!', { theme: "dark", position: "top-center" });
        setTimeout(() => navigate('/'), 3000); // Redirect to the dashboard after 3 seconds
      } else {
        toast.error(data.message || 'Login failed', { theme: "dark", position: "top-center" });
      }
    } catch (error) {
      console.error('Mistakes happen. Real champions make adjustments and try again.', error);
      toast.error('An error occurred during login', { theme: "dark", position: "top-center" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex w-full h-screen">
      <ToastContainer />
      
      <div className="flex flex-col justify-center w-1/2 px-12 bg-black text-white">
        <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
        <p className="text-lg mb-8 text-gray-400">Log in to your account to continue</p>

        <form onSubmit={handleLogin} className="w-full">
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-400">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-md border border-gray-600 text-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-400">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-md border border-gray-600 text-white"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-md text-white text-lg font-semibold"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 flex justify-between text-sm">
          <a href="/register" className="text-blue-500 hover:underline">Don't have an account? Register</a>
          <a href="/" className="text-blue-500 hover:underline">Back to Home</a>
        </div>
      </div>

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
