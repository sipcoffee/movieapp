import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getAuthAxios } from "../axiosConfig";
const BASE_URL = import.meta.env.VITE_APP_BACKEND_API;

export const useCreateUser = () => {
  return useMutation({
    mutationKey: ["create-user"],
    mutationFn: async (data) => {
      const response = await axios.post(`${BASE_URL}/api/register`, data, {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
      });

      // Check for the "detail" field in the response data and throw an error if found
      if (response.data?.detail) {
        return response.data.detail;
      }

      return response.data;
    },
  });
};

export const useUserLogin = () => {
  return useMutation({
    mutationKey: ["user-login"],
    mutationFn: async (user_data) => {
      const response = await axios.post(`${BASE_URL}/api/login`, user_data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      return response.data;
    },
  });
};

export const useUserLogout = () => {
  return useMutation({
    mutationKey: ["user-logout"],
    mutationFn: async (data) => {
      const authAxios = getAuthAxios();
      if (!authAxios) {
        throw new Error("Not authenticated");
      }
      const response = await authAxios.post(`${BASE_URL}/api/logout`, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      return response.data;
    },
  });
};
