import { Link, Outlet, useNavigate } from "react-router-dom";

import "../style/dashBoard.scss";
import { useAuth } from "../context/AuthContext";
import { Button } from "@mui/material";

const DashBoard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    logout(); // Clear authentication state
    navigate('/'); // Redirect to login or home page
  };

  return (
    <>
      <header>
        <div className="container">
          <input type="checkbox" name="check" id="check" />
          <div className="logo-container">
            <h3 className="logo">
              Brand<span>Name</span>
            </h3>
          </div>
          <nav>
            <div className="nav-btn">
              <div className="nav-links">
                <ul>
                  <li className="nav-link">
                    <Link to="/dashboard">Home</Link>
                  </li>
                  <li className="nav-link">
                    <Link to="/dashboard/user-profiles">User Profile</Link>
                  </li>
                  <li className="nav-link">
                    <Link to="/dashboard/about">About</Link>
                  </li>  
                  <li className="nav-link">
                    <Link to="/dashboard/countryList">Country</Link>
                  </li>       
                  <li className="nav-link">
                    <Link to="/dashboard/stateList">State</Link>
                  </li>       
                  <li className="nav-link">
                    <Link to="/dashboard/cityList">City</Link>
                  </li>                  
                  <li className="nav-link">
                    <Button onClick={handleSignOut}>
                      <Link to="/">Sign Out</Link>
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          {/* Remove routes from here; they'll be defined in App.js */}
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default DashBoard;
 