import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator/LoadingIndicator";

import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { isAdmin } from './helpers/userRole';

import Login from "./Login/Login";
import Profile from "./Profile/Profile";
import UserManagement from "./UserManagement/UserManagement";
import Blog from "./Blog/Blog";

import tommyCodesLogo from "./assets/tommyCodes.svg";
import { showNotification } from "./helpers/toast";

export type setLoadingState = {
  handleLoading: (a: boolean) => void
}

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<String | null>("");
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    showNotification("Logged out successfully! Redirecting to home.")
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  return (
    <Router>
      <LoadingIndicator isLoading={isLoading} />
      <header>
        <div className="logo-holder">
          <NavLink activeClassName="active" to="/" exact>
            <img src={tommyCodesLogo} alt="Tommy Codes Blog" />
          </NavLink>
        </div>
        <div className="main-navigation">
          <nav>
            <ul>
              <li>
                <NavLink activeClassName="active" to="/" exact>
                  Blog
                </NavLink>
              </li>
              {!token && (
                <li className="logout">
                  <NavLink activeClassName="active" to="/login" exact>
                    Login
                  </NavLink>
                </li>
              )}
              {token && (
                <>
                  <li>
                    <NavLink activeClassName="active" to="/profile">
                      Profile
                    </NavLink>
                  </li>
                  {isAdmin() && (
                    <li>
                      <NavLink activeClassName="active" to="/userManagement">
                        Users
                      </NavLink>
                    </li>
                  )}
                  <li className="logout">
                    <button onClick={() => handleLogout()}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <ToastContainer />
        </div>
      </header>
      {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/" exact>
          <Blog handleLoading={setIsLoading} />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/userManagement">
          <UserManagement handleLoading={setIsLoading} />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
