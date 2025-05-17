import { useMutation, useQuery } from "@tanstack/react-query";
import { getAuthAxios } from "../axiosConfig";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_APP_BACKEND_API;

export const useCreateMovie = () => {
  return useMutation({
    mutationKey: ["create-video"],
    mutationFn: async (data) => {
      const authAxios = getAuthAxios();
      if (!authAxios) {
        throw new Error("Not authenticated");
      }
      const response = await authAxios.post(`${BASE_URL}/api/movies`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Check for the "detail" field in the response data and throw an error if found
      if (response.data?.detail) {
        return response.data.detail;
      }

      return response.data;
    },
  });
};

// GET ALL MOVIES
export const useGetAllMovies = () => {
  return useQuery({
    queryKey: ["get-all-movies"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/movies`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
    retry: 1,
  });
};

export const useGetMovieDetails = (id) => {
  return useQuery({
    queryKey: ["get-movie-details", id],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/api/movies/${id}`);
      return res.data;
    },
    retry: 1,
    enabled: !!id,
  });
};

export const useUpdateMovie = (id) => {
  return useMutation({
    mutationKey: ["update-video", id],
    mutationFn: async (data) => {
      const authAxios = getAuthAxios();
      if (!authAxios) {
        throw new Error("Not authenticated");
      }
      const response = await authAxios.put(
        `${BASE_URL}/api/movies/${id}`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Check for the "detail" field in the response data and throw an error if found
      if (response.data?.detail) {
        return response.data.detail;
      }

      return response.data;
    },
    retry: false,
    enabled: !!id,
  });
};

export const useDeleteMovie = (id) => {
  return useMutation({
    mutationKey: ["delete-video", id],
    mutationFn: async () => {
      const authAxios = getAuthAxios();
      if (!authAxios) {
        throw new Error("Not authenticated");
      }
      const response = await authAxios.delete(`${BASE_URL}/api/movies/${id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.data?.detail) {
        return response.data.detail;
      }

      return response.data;
    },
    retry: false,
    enabled: !!id,
  });
};

export const useReplaceMovie = (id) => {
  return useMutation({
    mutationKey: ["replace-video", id],
    mutationFn: async (data) => {
      const authAxios = getAuthAxios();
      if (!authAxios) {
        throw new Error("Not authenticated");
      }
      const response = await authAxios.put(
        `${BASE_URL}/api/movies/${id}/update-video`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Check for the "detail" field in the response data and throw an error if found
      if (response.data?.detail) {
        return response.data.detail;
      }

      return response.data;
    },
    retry: false,
    enabled: !!id,
  });
};
