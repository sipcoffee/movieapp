import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const isValidMovieId = (id) => {
  // Example: check if it's a valid number
  return !isNaN(id) && Number(id) > 0;
};

const useValidatedMovieId = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidMovieId(id)) {
      navigate("/not-found", { replace: true });
    }
  }, [id, navigate]);

  return id;
};

export default useValidatedMovieId;
