import {
  Play,
  Plus,
  ThumbsUp,
  ArrowLeft,
  Trash2,
  Pencil,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { TH1, TH2, TH4, THP } from "@/components/ui/typography";
import placeholderImage from "../../assets/placeholder.svg";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteMovie, useGetMovieDetails } from "@/api/movies";
import { toTitleCase } from "@/helpers/title-case";
import { formatDate } from "@/helpers/format-date";
import useValidatedMovieId from "@/hooks/useValidateMovieId";
import { MovieDetailsSkeletonLoader } from "@/components/loader";
import { useContext, useState } from "react";
import MoviePlayer from "./components/MoviePlayer";
import MovieUpdateDialog from "./components/MovieUpdateDialog";
import {
  RemoveMovieContext,
  ReplaceMovieContext,
  UpdateMovieContext,
} from "@/context";
import MovieRemoveDialog from "./components/MovieRemoveDialog";
import MovieReplaceDialog from "./components/MovieReplaceDialog";
import { Label } from "@/components/ui/label";

const BASE_URL =
  import.meta.env.VITE_APP_BACKEND_API || "http://localhost:8006";

export default function MovieDetailsPage() {
  const navigate = useNavigate();
  const id = useValidatedMovieId();
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: getMovieDetail, isLoading, isError } = useGetMovieDetails(id);

  if (isLoading) return <MovieDetailsSkeletonLoader />;
  const movie = getMovieDetail;

  if (isError) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Movies
        </Button>
      </div>
    );
  }

  // Build the full video URL by prepending backendBaseUrl
  const videoSrc = movie.video_file.startsWith("http")
    ? movie.video_file
    : `${BASE_URL}${movie.video_file}`;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
      </div>

      <div className="relative w-full h-[50vh] md:h-[70vh] bg-black flex items-center justify-center">
        {!isPlaying ? (
          <>
            <MovieBanner title={movie.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
              <MovieTitle title={movie.title} />
              <MovieAdded added={movie.date_added} />
              <MovieActionButtons setIsPlaying={setIsPlaying} />
            </div>
          </>
        ) : (
          <MoviePlayer videoSrc={videoSrc} setIsPlaying={setIsPlaying} />
        )}
      </div>

      <MovieDescription description={movie.description} />

      <MovieUpdateDialog movie={movie} />
      <MovieRemoveDialog />
      <MovieReplaceDialog videoFile={movie.video_file} />
    </div>
  );
}

const MovieBanner = ({ title }) => {
  return (
    <img
      src={placeholderImage}
      alt={title}
      className="object-cover w-full h-full"
      sizes="100vw"
    />
  );
};

const MovieTitle = ({ title }) => {
  return <TH1>{toTitleCase(title)}</TH1>;
};

const MovieAdded = ({ added }) => {
  return (
    <div className="flex items-center gap-4 text-sm my-3">
      <TH4>{formatDate(added)}</TH4>
    </div>
  );
};

const MovieActionButtons = ({ setIsPlaying }) => {
  const { isAuthenticated } = useAuth();
  const { setUpdateMovieDialog } = useContext(UpdateMovieContext);
  const { setRemoveMovieDialog } = useContext(RemoveMovieContext);
  const { setReplaceMovieDialog } = useContext(ReplaceMovieContext);
  const id = useValidatedMovieId();

  const handleDeleteMovie = () => {
    setRemoveMovieDialog(true);
  };

  return (
    <div className="flex items-center gap-4 mt-6">
      <Button
        className="bg-white hover:bg-white/90 text-black font-medium flex items-center gap-2 shadow-2xl"
        size="lg"
        onClick={() => setIsPlaying(true)}
      >
        <Play className="h-5 w-5 fill-black" />
        Play
      </Button>

      {isAuthenticated && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-white/40 bg-zinc-800/80 h-12 w-12 hover:bg-blue-500"
            onClick={() => setUpdateMovieDialog(true)}
          >
            <Pencil className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-white/40 bg-zinc-800/80 h-12 w-12 hover:bg-blue-500"
            onClick={() => setReplaceMovieDialog(true)}
          >
            <Video className="h-6 w-6" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="rounded-full border-white/40  h-12 w-12"
            onClick={handleDeleteMovie}
          >
            <Trash2 className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
};

const MovieDescription = ({ description }) => {
  return (
    <div className="container mx-6 px-6 md:px-6 py-1 mt-4 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <TH2>Description</TH2>
          <THP>{description}</THP>
        </div>
      </div>
    </div>
  );
};
