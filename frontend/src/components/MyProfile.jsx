import React from 'react'
import { useAuth } from '../provider/AuthProvider'

export default function MyProfile({data}) {

  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };
  
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      {user ? (
        <div className='bg-white p-8 rounded-lg shadow-lg'>
          <h1 className='text-2xl font-bold mb-4'>My Profile</h1>
          <p className='mb-2'><strong>First Name:</strong> {user.firstName}</p>
          <p className='mb-2'><strong>Last Name:</strong> {user.lastName}</p>
          <p className='mb-4'><strong>Email:</strong> {user.email}</p>
          <button 
            onClick={handleLogout}
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
          >
            Logout
          </button>
        </div>
      ) : (
        <div className='text-center'>
          <p className='text-xl'>Loading profile...</p>
        </div>
      )}
    </div>
  )
}
