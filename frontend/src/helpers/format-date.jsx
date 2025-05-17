export const formatDate = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  const options = {
    year: "numeric",
  };

  return date.toLocaleString("en-US", options);
};
