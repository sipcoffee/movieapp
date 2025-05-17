import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

let authAxiosInstance = null;

const BASE_URL =
  import.meta.env.VITE_APP_BACKEND_API || "http://localhost:8006";

// console.log(BASE_URL);

export const createAuthAxios = (token) => {
  authAxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Add response interceptor
  authAxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        cookies.remove("token");
        window.location.href = "/signin";
      }
      return Promise.reject(error);
    }
  );

  return authAxiosInstance;
};

export const getAuthAxios = () => {
  if (!authAxiosInstance) {
    const token = cookies.get("token");
    if (token) {
      createAuthAxios(token);
    }
  }
  return authAxiosInstance;
};
