import { ReactLenis, useLenis } from 'lenis/react'
import {  Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./auth/PrivateRoute";

import Loading from "./pages/Loading";
import CropProblem from './pages/CropProblem';
function App() {
  const lenis = useLenis((lenis) => {
    // called every scroll
    console.log(lenis)
  })


  return (
    <>
      <ReactLenis root />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/Crop" element={<CropProblem/>}/>
        <Route path="/loading" element={<Loading/>}/>
      </Routes>
    </>
  )
}

export default App
