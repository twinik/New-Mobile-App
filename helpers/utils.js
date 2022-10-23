export const truncateText = (text, length) => {
  if (!text) {
    return "N/A";
  }
  if (text?.length > length) {
    return text.substring(0, length) + "...";
  } else {
    return text;
  }
};
