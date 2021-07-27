import { useEffect, useState } from "react";
import "../App.scss";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { showNotification, Type } from "../helpers/toast";
import { getRequest, putRequest } from "../helpers/http";

function Profile() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [city, setCity] = useState("");

  const [changedName, setChangedName] = useState("");
  const [changedSurname, setChangedSurname] = useState("");
  const [changedCity, setChangedCity] = useState("");

  async function handleErrors(response: any) {
    if (!response.ok) {
      await response.json().then((error: any) => {
        if(error.authStatus === 'failed') {
          throw Error("authFailed")
        }
        throw Error(error.message);
      });
    }
    return response.json();
  }

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = () => {
    if (name !== "") return;
    getRequest("api/profile")
      .then(handleErrors)
      .then((resp) => {
        setName(resp.name);
        setSurname(resp.surname);
        setCity(resp.city);
      })
      .catch((error) => {
        
        if(error.message === 'authFailed') {
          localStorage.removeItem("token");
          showNotification("Session expired or token invalid. Please log in.", Type.error);
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
          return;
        }

        showNotification(error.message, Type.error);
      });
  };

  const handleProfileUpdate = (
    data = { name: changedName, surname: changedSurname, city: changedCity }
  ) => {
    if (data.name === "") {
      data.name = name;
    }
    if (data.surname === "") {
      data.surname = surname;
    }
    if (data.city === "") {
      data.city = city;
    }

    putRequest("api/profile", data)
      .then(handleErrors)
      .then((resp) => {
        setName(resp.profile.name);
        setSurname(resp.profile.surname);
        showNotification(resp.message);
      })
      .catch((error) => {
        showNotification(error.message, Type.error)
      });
  };

  return (
    <div className="App">
      <div className="main">
        <h2>Your profile</h2>

        <div className="card">
          <p>
            <label>Name:</label>
            <input
              defaultValue={name}
              onChange={(e) => setChangedName(e.target.value)}
            />
          </p>
          <p>
            <label>Surname:</label>
            <input
              defaultValue={surname}
              onChange={(e) => setChangedSurname(e.target.value)}
            />
          </p>
          <p>
            <label>City:</label>
            <input
              defaultValue={city}
              onChange={(e) => setChangedCity(e.target.value)}
            />
          </p>

          <button onClick={() => handleProfileUpdate()}>
            <FontAwesomeIcon icon={faSave} /> Änderungen speichern
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Profile;
