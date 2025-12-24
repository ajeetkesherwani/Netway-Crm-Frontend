export const addressValidate = (address) => {
  const trimmed = (address || "").trim();

  if (!trimmed) {
    return "Address Line 1 is required";
  }

  

  if (trimmed.length < 5) {
    return "Address Line 1 must be at least 5 characters";
  }

  if (trimmed.length > 100) {
    return "Address Line 1 should not exceed 100 characters";
  }

  return "";
};
