import axios from "axios";

const API = axios.create({
  baseURL: "https://tournamentcreator.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (res) => res,

  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (
      status === 401 &&
      (code === "TOKEN_EXPIRED" || code === "TOKEN_INVALID")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;