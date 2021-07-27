import jwt_decode from "jwt-decode";

interface DecodedToken {
  id: string,
  role: string,
  iap: number,
  exp: number
}

export function getUserRole() {
    var token = localStorage.getItem("token");
    if(!token) {
        return '';
    }
    var decoded: DecodedToken = jwt_decode(token);   
    return decoded.role;
}

export function isAdmin() {
  var currentUserRole = getUserRole();
  return currentUserRole.toUpperCase() === "ADMIN";
}

export default isAdmin;