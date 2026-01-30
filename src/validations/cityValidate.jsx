export const cityValidate = (city) => {
  const trimmed = (city || "").trim();

  if (!trimmed) {
    return "City is required";
  }

  if (!/^[A-Za-z\s]+$/.test(trimmed)) {
    return "City can contain only alphabets";
  }

  if (trimmed.length > 50) {
    return "City should not exceed 50 characters";
  }

  return "";
};
