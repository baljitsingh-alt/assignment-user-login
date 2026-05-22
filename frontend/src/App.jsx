import { useState } from 'react'
import Form from "./components/Signup"
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Signup from './components/Signup';
import MyProfile from "./components/MyProfile";
import Landing from "./components/Landing";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  const [count, setCount] = useState(0)


  console.log(import.meta.env.VITE_BACKEND_URL); 

  return (

    <BrowserRouter>

     <Routes>
      <Route path="/" element={<Landing />} />
        <Route  path="/me" element={
          <ProtectedRoute>
            <MyProfile/>
          </ProtectedRoute>
        } />
       <Route  path="/signup" element={<Signup/>} />


    </Routes>
    </BrowserRouter>

  )
}

export default App


