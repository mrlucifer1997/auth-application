import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";

import ErrorBoundary from "./component/ErrorBoundary";
import DashBoard from "./component/DashBoard";
import Home from "./component/Home"; // Import Home component
import UserProfiles from "./component/UserProfiles"; // Import UserProfiles component
import About from "./component/About"; // Import About component
import CountryList from "./component/CountryList";
import StateList from "./component/StateList";
import CityList from "./component/CityList";

import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';

import "./App.scss";
import React from "react";
import PrivateRoute from "./context/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

const App:React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      path: "dashBoard",
      element: (
        <ErrorBoundary render={<DashBoard />} />
      ),
      children: [
        {
          path: "",
          element: <PrivateRoute element={<Home />} />,
        },
        {
          path: "user-profiles",
          element: <PrivateRoute element={<UserProfiles />} />,
        },
        {
          path: "about",
          element: <PrivateRoute element={<About />} />,
        }, 
        {
          path: "countryList",
          element: <PrivateRoute element={<CountryList />} />,
        },    
        {
          path: "stateList",
          element: <PrivateRoute element={<StateList />} />,
        }, 
        {
          path: "cityList",
          element: <PrivateRoute element={<CityList />} />,
        },     
      ],
    },
  ]);

  return (
    <React.Fragment>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          closeOnClick
          pauseOnHover      
        />
      </AuthProvider>
    </React.Fragment>
  );
}

export default App;
