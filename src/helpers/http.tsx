import ENVIRONMENT_URL from "./environmentUrl";

type Data = {
  [key: string]: string;
};

export function getTokenFromStorage() {
  return localStorage.getItem("token");
}

export function postRequest(url: string, data: Data) {
  const token = localStorage.getItem("token");
  return fetch(`${ENVIRONMENT_URL}/${url}`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function getRequest(url: string) {
  const token = localStorage.getItem("token");
  return fetch(`${ENVIRONMENT_URL}/${url}`, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function deleteRequest(url: string, userId: string) {
  const token = localStorage.getItem("token");
  return fetch(`${ENVIRONMENT_URL}/${url}/${userId}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
}

export function putRequest(url: string, data: Data) {
  const token = localStorage.getItem("token");
  return fetch(`${ENVIRONMENT_URL}/${url}`, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
