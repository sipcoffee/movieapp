import { useUpdateMovie } from "@/api/movies";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { UpdateMovieContext } from "@/context";
import { useQueryClient } from "@tanstack/react-query";
import React, { useContext } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(6, "Description must be at least 6 characters"),
});

export default function MovieUpdateDialog({ movie }) {
  const { updateMovieDialog, setUpdateMovieDialog } =
    useContext(UpdateMovieContext);

  return (
    <Dialog open={updateMovieDialog} onOpenChange={setUpdateMovieDialog}>
      <DialogContent
        className="[&>button]:hidden"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogTitle>Update Movie</DialogTitle>
        <DialogDescription></DialogDescription>
        <MovieUpdateFormFields movie={movie} />
      </DialogContent>
    </Dialog>
  );
}

const MovieUpdateFormFields = ({ movie }) => {
  const { mutate: onUpdateMovie, isPending } = useUpdateMovie(movie?.movie_id);
  const { setUpdateMovieDialog } = useContext(UpdateMovieContext);
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: movie.title,
      description: movie.description,
    },
  });

  function onSubmit(values) {
    console.log(values);
    const data = new FormData();

    for (const key in values) {
      data.append(key, values[key]);
    }

    onUpdateMovie(data, {
      onSuccess: (data) => {
        toast.success(data.message);
        setUpdateMovieDialog(false);
        queryClient.invalidateQueries(["get-movie-details", movie.movie_id]);
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

        <FormActions
          isPending={isPending}
          onCancel={() => setUpdateMovieDialog(false)}
        >
          Update
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
