
export const characterValidate = (name) => {
  if (!name.trim()) return "Name is required";

  if (!/^[A-Za-z\s]+$/.test(name)) {
    return "Only alphabets are allowed";
  }

  if (name.length > 10) {
    return "Name should not exceed 10 characters";
  }

  return "";
};
