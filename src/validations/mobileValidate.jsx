export const mobileValidate = (mobile) => {
  const value = (mobile || "").trim();

  if (!value) {
    return "Mobile number is required";
  }

  // Allow only digits
  if (!/^\d+$/.test(value)) {
    return "Only numbers are allowed";
  }

  // Max length check
  if (value.length > 10) {
    return "Mobile number cannot exceed 10 digits";
  }

  // Exact Indian mobile format (start with 6–9)
  if (!/^[6-9]\d{9}$/.test(value)) {
    return "Enter a valid 10-digit mobile number starting with 6-9";
  }

  return "";
};
