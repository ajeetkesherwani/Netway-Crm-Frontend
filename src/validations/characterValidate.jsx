
export const characterValidate = (name) => {
  if (!name.trim()) return "Name is required";

  if (!/^[A-Za-z\s]+$/.test(name)) {
    return "Only alphabets are allowed";
  }

  if (name.length > 30) {
    return "Name should not exceed 30 characters";
  }

  return "";
};
