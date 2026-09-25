export const saveAuthData = (data) => {

  localStorage.setItem("token", data.token);

  localStorage.setItem("role", data.role);

  // Guard: only store userId if it is a valid non-null value
  if (data.userId != null) {
    localStorage.setItem("userId", String(data.userId));
  } else {
    localStorage.removeItem("userId");
  }

  localStorage.setItem("fullName", data.fullName ?? "");

  localStorage.setItem("email", data.email ?? "");

};

export const logout = () => {

  localStorage.clear();

};

export const getToken = () => {

  return localStorage.getItem("token");

};

export const getRole = () => {

  return localStorage.getItem("role");

};

// Returns a clean numeric string userId, or null if missing/invalid
export const getUserId = () => {
  const raw = localStorage.getItem("userId");
  if (!raw || raw === "null" || raw === "undefined") return null;
  return raw;
};

export const isLoggedIn = () => {

  return !!localStorage.getItem("token");

};