import React, { useState } from 'react';
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';

export default function Signup() {

  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignupPage, setIsSignupPage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("formData", formData);

    if (isSignupPage) {

      if (formData.password !== formData.confirmPassword) {
        setError("password not matched");
        return;
      }

      try {

        const res = await axios.post(
           `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`,
          {
            firstName: formData.fName,
            lastName: formData.lName,
            email: formData.email,
            password: formData.password
          }
        );

        if (res.status === 200) {

          toast.success(res.data.message || "registered successfully");

          setFormData({
            fName: "",
            lName: "",
            email: "",
            password: "",
            confirmPassword: ""
          });

          setIsSignupPage(false);
        }

      } catch (error) {

        console.log("error", error.response?.data?.message);

        if (error.response?.data) {
          toast.error(error.response.data.message || 'failed to signup');
        }
      }

    } else {

      // login

      try {

        const res = await axios.post(
           `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`,
          {
            email: formData.email,
            password: formData.password
          }
        );

        if (res.status === 200) {

          const token = res.data.token;

          localStorage.setItem("token", token);

          // Fetch user profile
          const userRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          const userData = userRes.data.userProfile;

          login(userData, token);

          toast.success(res.data.message || "successfully logged in");

          navigate("/me");
        }

      } catch (error) {

        console.log("error", error.response?.data?.message);

        if (error.response?.data) {
          toast.error(error.response.data.message || "failed to login");
        }
      }
    }
  };

  return (
    <div className='flex justify-center items-center'>

      <form onSubmit={handleSubmit} className='gap-2 flex flex-col mt-32'>

        {
          isSignupPage &&
          <div className='flex flex-col gap-2'>

            <label>First Name</label>

            <input
              type="text"
              className='pl-4 bg-gray-200 rounded-md'
              name='fName'
              value={formData.fName}
              onChange={handleChange}
              placeholder='enter your first name'
            />

            <label>Second Name</label>

            <input
              type="text"
              className='pl-4 bg-gray-200 rounded-md'
              name='lName'
              value={formData.lName}
              onChange={handleChange}
              placeholder='enter your last name'
            />

          </div>
        }

        <label>Email</label>

        <input
          type="email"
          className='pl-4 bg-gray-200 rounded-md'
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='enter your email'
        />

        <label>Password</label>

        <input
          type="password"
          className='pl-4 bg-gray-200 rounded-md'
          name='password'
          value={formData.password}
          onChange={handleChange}
          placeholder='enter your password'
        />

        {
          isSignupPage &&
          <div className='flex flex-col gap-2'>

            <label>Confirm Password</label>

            <input
              type="password"
              className='pl-4 bg-gray-200 rounded-md'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder='confirm your password'
            />

          </div>
        }

        {
          error &&
          <p className='text-red-500 bg-red-200 p-2 rounded-md'>
            {error}
          </p>
        }

        <button className='p-2 bg-gray-600 hover:text-black text-white rounded-xl mt-12 hover:cursor-pointer'>
          {isSignupPage ? 'signup' : 'login'}
        </button>

        <div className='hover:cursor-pointer'>

          {
            isSignupPage
              ? (
                <p
                  className='text-blue-600 bg-blue-300 p-2'
                  onClick={() => setIsSignupPage(false)}
                >
                  switch to login
                </p>
              )
              : (
                <p
                  className='text-blue-600 bg-blue-300 p-2'
                  onClick={() => setIsSignupPage(true)}
                >
                  switch to signup
                </p>
              )
          }

        </div>

      </form>

    </div>
  );
}