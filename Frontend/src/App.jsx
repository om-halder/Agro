import React, { Suspense, lazy } from 'react';
import { ReactLenis, useLenis } from 'lenis/react'
import {  Routes, Route } from "react-router-dom";
import Loading from "./pages/Loading";
import PrivateRoute from "./auth/PrivateRoute";

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const Profile = lazy(() => import("./pages/Profile"));
const CropProblem = lazy(() => import('./pages/CropProblem'));
<<<<<<< HEAD
const CommunityChat = lazy(() => import('./pages/CommunityChat'));
=======
>>>>>>> 72ee0cc505d33f5c4edbd89c97e75d3dc8b10818
function App() {
  const lenis = useLenis((lenis) => {
    // called every scroll
    console.log(lenis)
  })


  return (
    <>
      <ReactLenis root />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          
          <Route
            path="/crop"
            element={
              <PrivateRoute>
                <CropProblem />
              </PrivateRoute>
            }
          />

  <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
<<<<<<< HEAD
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <CommunityChat />
              </PrivateRoute>
            }
          />
=======
>>>>>>> 72ee0cc505d33f5c4edbd89c97e75d3dc8b10818
          <Route path="/loading" element={<Loading/>}/>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
