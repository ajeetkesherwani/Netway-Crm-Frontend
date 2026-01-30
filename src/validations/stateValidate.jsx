export const stateValidate = (city) => {
  const trimmed = (city || "").trim();

  if (!trimmed) {
    return "State is required";
  }

  if (!/^[A-Za-z\s]+$/.test(trimmed)) {
    return "State can contain only alphabets";
  }

  // if (trimmed.length > 60) {
  //   return "State should not exceed 60 characters";
  // }

  return "";
};
