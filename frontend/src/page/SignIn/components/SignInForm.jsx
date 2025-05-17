import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserLogin } from "@/api/auth";
import { toast } from "sonner";
import { TokenAuth, UserContext } from "@/context";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { createAuthAxios } from "@/api/axiosConfig";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignInForm() {
  const navigate = useNavigate();
  const { mutate: onUserLogin, isPending } = useUserLogin();
  const { setTokenAuth } = useContext(TokenAuth);
  const cookies = new Cookies();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values) {
    const data = new FormData();
    for (const key in values) {
      data.append(key, values[key]);
    }

    onUserLogin(data, {
      onSuccess: (data) => {
        console.log(data);
        if (data.access) {
          cookies.set("token", data.access, { path: "/" });
          //   setUserData(jwtDecode(data.access));
          setTokenAuth(data);
          createAuthAxios(data.access);
          navigate("/", { replace: true });
          form.reset();
        }
      },
      onError: (error) => {
        toast.error(error.response.data.error);
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-[320px]"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="text-sm"
                  placeholder="Enter username"
                  type="text"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  className="text-sm"
                  type="password"
                  placeholder="Enter password"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SignUpNavigation />
        <FormActions>Login</FormActions>
      </form>
    </Form>
  );
}

const SignUpNavigation = () => {
  return (
    <div className="flex items-center justify-center">
      <Link to="/signup" className="text-xs text-slate-400">
        Create account
      </Link>
    </div>
  );
};

const FormActions = ({ children, isPending }) => {
  return (
    <Button type="submit" disabled={isPending} className="mt-2">
      {isPending && (
        <LoaderCircleIcon
          className="-ms-1 animate-spin"
          size={16}
          aria-hidden="true"
        />
      )}
      {children}
    </Button>
  );
};
