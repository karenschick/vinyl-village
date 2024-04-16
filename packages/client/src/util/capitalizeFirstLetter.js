const capitalizeFirstLetter = (string) => {
  if (!string) return "Unknown";
  return string
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default capitalizeFirstLetter;
