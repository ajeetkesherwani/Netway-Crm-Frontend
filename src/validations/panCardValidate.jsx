export const panCardValidate = (pan) => {
  const trimmed = (pan || "").trim().toUpperCase();

  if (!trimmed) {
    return "PAN Card number is required";
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!panRegex.test(trimmed)) {
    return "Invalid PAN Card format (e.g. ABCDE1234F)";
  }

  return "";
};
