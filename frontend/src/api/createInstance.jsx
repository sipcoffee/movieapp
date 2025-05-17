import axios from "axios";
import Cookies from "universal-cookie";
const BASE_URL =
  import.meta.env.VITE_APP_BACKEND_API || "http://localhost:8006";

// Helper function to get the token from cookies
const getAuthToken = () => {
  const cookies = new Cookies();
  return cookies.get("token"); // Ensure this matches the token name you used
};
//import.meta.env.REACT_APP_BACKEND_API
// Create Axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to include the bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    // console.log("token", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
