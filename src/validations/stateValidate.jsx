export const stateValidate = (city) => {
  const trimmed = (city || "").trim();

  if (!trimmed) {
    return "City is required";
  }

  if (!/^[A-Za-z\s]+$/.test(trimmed)) {
    return "City can contain only alphabets";
  }

  if (trimmed.length > 10) {
    return "City should not exceed 30 characters";
  }

  return "";
};
