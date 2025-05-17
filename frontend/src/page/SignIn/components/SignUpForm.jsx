import React from "react";
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
import { Link } from "react-router-dom";
import { useCreateUser } from "@/api/auth";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUpForm() {
  const { mutate: onCreateUser, isPending } = useCreateUser();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values) {
    const data = new FormData();
    for (const key in values) {
      data.append(key, values[key]);
    }

    onCreateUser(data, {
      onSuccess: (data) => {
        console.log(data);
        toast.success(data.message);
        form.reset();
      },
      onError: (error) => {
        console.log(error);
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="text-sm"
                  placeholder="Enter email"
                  type="email"
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
        <FormActions>Create Account</FormActions>
      </form>
    </Form>
  );
}

const SignUpNavigation = () => {
  return (
    <div className="flex items-center justify-center">
      <Link to="/signin" className="text-xs text-slate-400">
        Sign In to your account
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
