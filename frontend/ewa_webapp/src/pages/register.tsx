import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/register', { // Replace with your backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: `${formData.firstName} ${formData.lastName}`, // Combines first and last name
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

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

      if (response.ok) {
        const decodedToken = decodeToken(data.token);
        if (decodedToken) {
            localStorage.setItem('userId', decodedToken.id.toString());
            localStorage.setItem('userName', decodedToken.email.split("@")[0]); // Store the user’s name
        }
        localStorage.setItem('token', data.token);
        toast.success('You’ve leveled up. Now start building the life you want.', { theme: "dark",position: "top-center" });
        setTimeout(() => navigate('/'), 2000); // Navigate to the index page after 3 seconds
      } else if (data.message === 'User already exists') { // Check if the user already exists
        toast.error('An account with this email already exists. Please log in.', { position: "top-center" });
        setTimeout(() => navigate('/login'), 2000); // Redirect to login after showing the message
      } else {
        toast.error(data.message, { position: "top-center" });
      }
    } catch (error) {
      console.error('Failure isn’t an option. Check your info and try again.', error);
      toast.error('An error occurred during registration', { position: "top-center" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex w-full h-screen">
      <ToastContainer />
      
      <div className="flex flex-col justify-center w-1/2 px-12 bg-black text-white">
        <h1 className="text-4xl font-bold mb-6">Create an Account</h1>
        <p className="text-lg mb-8 text-gray-400">Register to access your account</p>

        <form onSubmit={handleRegister} className="w-full">
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-400">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-md border border-gray-600 text-white"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-400">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-md border border-gray-600 text-white"
              placeholder="Enter your last name"
              required
            />
          </div>

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

          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-gray-400">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 rounded-md border border-gray-600 text-white"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-md text-white text-lg font-semibold"
          >
            Register
          </button>
        </form>
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

export default Register;
