import { useEffect, useState } from "react";
import "./Login.scss";

import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import { postRequest } from "../helpers/http";
import { showNotification, Type } from "../helpers/toast";

function Login() {
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setLoggedIn(true);
    }
  }, []);

  async function handleErrors(response: any) {
    if (!response.ok) {
      await response.json().then((text: any) => {
        throw Error(text.error);
      });
    }
    return response.json();
  }

  type Data = {
    password: string,
    email: string
  }

  const handleRegister = (
    e: any,
    data: Data = {
      password: registerPassword,
      email: registerEmail,
    }
  ) => {
    e.target.parentElement.checkValidity();
    e.target.parentElement.reportValidity();
    e.preventDefault();
    if (data.email === "" || data.password === "") {
      setMessage("Alle Felder müssen ausgefüllt sein.");
      return;
    } else {
      setMessage("");
    }

    postRequest("api/auth/register", data)
      .then(handleErrors)
      .then(() => {
        showNotification("User was successfully registered!");
      })
      .catch((error) => {
        showNotification(error.message, Type.error);
      });
  };

  const handleLogin = (
    e: any,
    data: Data = {
      password: registerPassword,
      email: registerEmail,
    }
  ) => {
    const validity = e.target.parentElement.checkValidity();
    e.target.parentElement.reportValidity();
    e.preventDefault();
    if (data.email === "" || data.password === "" || !validity) {
      setMessage("Alle Felder müssen ausgefüllt sein.");
      return;
    } else {
      setMessage("");
    }
    postRequest("api/auth/login", data)
      .then(handleErrors)
      .then((resp) => {
        showNotification("Logged in!");
        localStorage.setItem("token", resp.token);

        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      })
      .catch((error) => {
        showNotification(error.message, Type.error);
      });
  };

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Tommycodes Blog - Login</title>
      </Helmet>
      <div className="login">
        <div className="welcome-headline">
          <h2>Welcome to Tommycodes</h2>
        </div>
        <div className="login-container">
          <form autoComplete="on" onSubmit={(e) => handleLogin(e)}>
            <label>E-Mail</label>
            <input
              type="email"
              name="email"
              required
              placeholder="example@domain.com"
              onLoad={(e: any) => setRegisterEmail(e.target.value)}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              placeholder="********"
              minLength={6}
              onLoad={(e: any) => setRegisterPassword(e.target.value)}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />

            <span className="error-message error-message--small">
              {message}
            </span>

            <button onClick={(e) => handleLogin(e)}>Login</button>
            <button
              style={{ float: "right" }}
              onClick={(e) => handleRegister(e)}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
