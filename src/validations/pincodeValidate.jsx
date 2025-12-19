export const pincodeValidate = (pincode) => {
  const trimmed = (pincode || "").trim();

  if (!trimmed) return "Pincode is required";

  
  if (!/^\d+$/.test(trimmed)) {
    return "Only digits are allowed in Pincode";
  }

  
  if (trimmed.length !== 6) {
    return "Pincode must be exactly 6 digits";
  }

  return "";
};
