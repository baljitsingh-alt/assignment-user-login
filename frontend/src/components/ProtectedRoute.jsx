import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../provider/AuthProvider'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/signup" replace />
  }

  return children
}
