import React, { useContext } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogContext } from "@/context";
import { Button } from "@/components/ui/button";
import MovieFileUpload from "./MovieFileUpload";
import { useCreateMovie } from "@/api/movies";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(6, "Description must be at least 6 characters"),
  video_file: z
    .instanceof(File, { message: "A video file is required" })
    .refine((file) => file.size > 0, { message: "File cannot be empty" })
    .refine((file) => file.type === "video/mp4", {
      message: "Only MP4 files are allowed",
    }),
});

export default function MovieAddDialog() {
  const { newMovieDialog, setNewMovieDialog } = useContext(DialogContext);
  return (
    <Dialog open={newMovieDialog} onOpenChange={setNewMovieDialog}>
      <DialogContent
        className="[&>button]:hidden"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogTitle>New Movie</DialogTitle>
        <DialogDescription></DialogDescription>
        <MovieFormFields />
      </DialogContent>
    </Dialog>
  );
}

const MovieFormFields = () => {
  const { mutate: onCreateMovie, isPending } = useCreateMovie();
  const queryClient = useQueryClient();
  const { setNewMovieDialog } = useContext(DialogContext);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      video_file: undefined, // or null
    },
  });

  function onSubmit(values) {
    console.log(values);
    const data = new FormData();

    for (const key in values) {
      if (values[key] instanceof File) {
        data.append(key, values[key]);
      } else if (values[key] !== null && values[key] !== undefined) {
        // For non-file fields, convert to string (FormData only accepts strings or blobs)
        data.append(key, values[key].toString());
      }
    }
    onCreateMovie(data, {
      onSuccess: (data) => {
        console.log(data);
        toast.success(data.message);
        setNewMovieDialog(false);
        queryClient.invalidateQueries(["get-all-movies"]);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Title"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
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
          name="video_file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <MovieFileUpload field={field} isPending={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormActions
          isPending={isPending}
          onCancel={() => setNewMovieDialog(false)}
        >
          Create
        </FormActions>
      </form>
    </Form>
  );
};

const FormActions = ({ children, isPending, onCancel }) => {
  return (
    <div className="flex justify-end mt-2 gap-2">
      <Button variant="ghost" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending && (
          <LoaderCircleIcon
            className="-ms-1 animate-spin"
            size={16}
            aria-hidden="true"
          />
        )}
        {children}
      </Button>
    </div>
  );
};
