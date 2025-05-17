import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TH2, TH3 } from "@/components/ui/typography";
import { movies } from "@/lib/movie-data";
import { Plus, Star } from "lucide-react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholderImage from "../../assets/placeholder.svg";
import { DialogContext } from "@/context";
import MovieAddDialog from "./components/MovieAddDialog";
import { useAuth } from "@/hooks/useAuth";
import { useGetAllMovies } from "@/api/movies";
import { formatDate } from "@/helpers/format-date";
import { toTitleCase } from "@/helpers/title-case";
import { MovieCardSkeleton } from "@/components/loader";

export default function MoviePage() {
  return (
    <div className="h-[90svh] overflow-y-auto p-6">
      <ScrollArea className="flex flex-col ">
        <MovieHeader />
        <MovieContent />
        <MovieAddDialog />
      </ScrollArea>
    </div>
  );
}

const MovieHeader = () => {
  const navigate = useNavigate();
  const { setNewMovieDialog } = useContext(DialogContext);
  const { isAuthenticated } = useAuth();
  return (
    <div className="flex justify-between">
      <TH3>Movies</TH3>
      {isAuthenticated && (
        <Button onClick={() => setNewMovieDialog(true)}>
          <Plus /> Add Movie
        </Button>
      )}
    </div>
  );
};

const MovieContent = () => {
  const { data: getAllMovies, isPending } = useGetAllMovies();
  if (isPending) return <MovieCardSkeleton />;

  if (!getAllMovies || getAllMovies.length === 0) {
    return (
      <div className="mt-4 text-center text-gray-500">No movies found.</div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
      {getAllMovies?.map((movie) => (
        <MovieCard key={movie.movie_id} movie={movie} />
      ))}
    </div>
  );
};

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.movie_id}`);
  };

  return (
    <div
      className="relative overflow-hidden rounded-sm bg-slate-50/10 transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] w-full">
        <img
          src={movie.image || placeholderImage}
          alt={movie.title}
          className="h-full w-full object-cover rounded-md text-center"
          sizes="(max-width: 768px) 60vw, (max-width: 1200px) 33vw, 16vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 flex flex-col justify-end">
          <h3 className="font-bold text-white">{toTitleCase(movie.title)}</h3>
          <div className="flex items-center mt-1 mb-1">
            <span className="text-sm text-gray-300 mr-2">
              {formatDate(movie.date_added)}
            </span>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2 mt-1">
            {movie.description}
          </p>
        </div>
      </div>
    </div>
  );
};
