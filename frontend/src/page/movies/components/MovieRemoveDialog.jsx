import { useDeleteMovie } from "@/api/movies";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RemoveMovieContext } from "@/context";
import useValidatedMovieId from "@/hooks/useValidateMovieId";
import { useQueryClient } from "@tanstack/react-query";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function MovieRemoveDialog() {
  const id = useValidatedMovieId();
  const navigate = useNavigate();
  const { removeMovieDialog, setRemoveMovieDialog } =
    useContext(RemoveMovieContext);

  const queryClient = useQueryClient();

  const { mutate: onDeleteMovie } = useDeleteMovie(id);

  const handleDeleteMove = () => {
    onDeleteMovie([], {
      onSuccess: (data) => {
        if (data.message) {
          toast.success(data.message);
          queryClient.invalidateQueries(["get-movie-details", id]);
          navigate("/", { replace: true });
        }
      },
    });
  };

  return (
    <AlertDialog open={removeMovieDialog} onOpenChange={setRemoveMovieDialog}>
      <AlertDialogContent
        className="w-[420px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this Movie?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Performing this action will delete this movie forever.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMove}>
            Confrim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
