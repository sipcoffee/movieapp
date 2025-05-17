export const getInitials = (username) => {
  if (!username) return "";
  return `${username[0]}`.toUpperCase();
};
