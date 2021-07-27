import { useEffect, useState } from "react";
import "../App.scss";
import { deleteRequest, getRequest, postRequest } from "../helpers/http";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { showNotification, Type } from "../helpers/toast";
import { setLoadingState } from "../App";

type User = {
  email: string,
  role: string,
  _id: string
}

function UserManagement({handleLoading}: setLoadingState) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  
  const [users, setUsers] = useState([]);
  const [changed, setChanged] = useState('');

  async function handleErrors(response: Response) {
    if (!response.ok) {
      await response.json().then((error: any) => {
        if (error.authStatus === "failed") {
          throw Error("authFailed");
        }
        throw Error(error.message);
      });
    }
    return response.json();
  }

  useEffect(() => {
    getUsers();    
  }, [changed]);

  const createNewUser = (e: any, data = { email, password, role }) => {
    e.target.form.checkValidity();
    e.target.form.reportValidity();
    e.preventDefault();

    if(data.email === '' || data.password === '' || data.role === '') {
        return;
    }

    const endpoint = "api/auth/register";

    postRequest(endpoint, data)
      .then(handleErrors)
      .then((resp) => {
        setChanged(resp);
        showNotification("User was successfully registered");
      })
      .catch((error) => {
        showNotification(error.message, Type.error);
      });
  };

  const getUsers = () => {
    handleLoading(true);
    const endpoint = "api/users";

    getRequest(endpoint)
      .then(handleErrors)
      .then((resp) => {
        setUsers(resp);
        handleLoading(false);
      })
      .catch((error) => {
        showNotification(error.message, Type.error);
        handleLoading(false);
      });
  }

  const removeUser = (userId: User["_id"]) => {
    const endpoint = "api/users";

    deleteRequest(endpoint, userId)
      .then(handleErrors)
      .then((resp) => {
        showNotification(resp.message);
        setChanged(resp);
      })
      .catch((error) => {
        showNotification(error.message, Type.error);
      });
  }

  return (
    <div className="App">
      <div className="main">
        <h2>Create new user</h2>

        <form>
          <div className="card">
            <p>
              <label>User E-Mail:</label>
              <input
                type="email"
                required
                placeholder="example@mail.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </p>
            <p>
              <label>Password (temporary):</label>
              <input
                type="text"
                required
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
              />
            </p>
            <p>
              <label>Role:</label>
              <select
                name="role"
                onChange={(e) => setRole(e.target.value)}
                defaultValue={"Please choose a role"}
                id="role"
                required
              >
                <option value="">
                  Please choose a role
                </option>
                <option id="admin">
                  Admin
                </option>
                <option id="editor">
                  Editor
                </option>
                <option id="writer">
                  Writer
                </option>
              </select>
            </p>

            <button onClick={(e) => createNewUser(e)}>
              <FontAwesomeIcon icon={faSave} /> Änderungen speichern
            </button>
          </div>
        </form>
      
        <hr />
        <h2>All registered users</h2>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Role</td>
              <td>Remove</td>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => {
              return (
                <tr key={user.email}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => removeUser(user._id)}><FontAwesomeIcon icon={faUserSlash} /> Remove</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UserManagement;
