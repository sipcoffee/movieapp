import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReplaceMovieContext } from "@/context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MovieFileUpload from "./MovieFileUpload";
import { FormActions } from "@/components/form-actions";
import { Paperclip } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useReplaceMovie } from "@/api/movies";
import useValidatedMovieId from "@/hooks/useValidateMovieId";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getFilenameFromPath } from "@/helpers/strip-file-path";

export const formSchema = z.object({
  video_file: z
    .instanceof(File, { message: "A video file is required" })
    .refine((file) => file.size > 0, { message: "File cannot be empty" })
    .refine((file) => file.type === "video/mp4", {
      message: "Only MP4 files are allowed",
    }),
});

export default function MovieReplaceDialog({ videoFile }) {
  const { replaceMovieDialog, setReplaceMovieDialog } =
    useContext(ReplaceMovieContext);

  return (
    <Dialog open={replaceMovieDialog} onOpenChange={setReplaceMovieDialog}>
      <DialogContent
        className="[&>button]:hidden"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogTitle>Update Movie File</DialogTitle>
        <DialogDescription></DialogDescription>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Paperclip />
            <Label>{getFilenameFromPath(videoFile)}</Label>
          </div>
          <ReplaceMovieForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ReplaceMovieForm = () => {
  const id = useValidatedMovieId();
  const queryClient = useQueryClient();
  const { setReplaceMovieDialog } = useContext(ReplaceMovieContext);
  const { mutate: onReplaceMovie, isPending } = useReplaceMovie(id);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      video_file: undefined, // or null
    },
  });

  function onSubmit(values) {
    const data = new FormData();

    for (const key in values) {
      if (values[key] instanceof File) {
        data.append(key, values[key]);
      }
    }

    onReplaceMovie(data, {
      onSuccess: (data) => {
        toast.success(data.message);
        setReplaceMovieDialog(false);
        queryClient.invalidateQueries(["get-movie-details", id]);
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
          onCancel={() => setReplaceMovieDialog(false)}
        >
          Upload
        </FormActions>
      </form>
    </Form>
  );
};
