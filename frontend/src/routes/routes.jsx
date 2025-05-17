import NavigationLayout from "@/layout/NavigationLayout";
import AuthLayout from "@/layout/AuthLayout";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const MoviePage = lazy(() => import("@/page/movies/MoviePage"));
const MovieDetailsPage = lazy(() => import("@/page/movies/MovieDetailsPage"));
const ErrorPage = lazy(() => import("@/page/error/ErrorPage"));
const SignInPage = lazy(() => import("@/page/SignIn/SignInPage"));
const SignUpPage = lazy(() => import("@/page/SignIn/SignUpPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <NavigationLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MoviePage />,
      },
    ],
  },
  {
    path: "movie/:id",
    element: <MovieDetailsPage />,
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <SignInPage />,
      },
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
    ],
  },
]);
