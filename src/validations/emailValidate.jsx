export const emailValidate = (email) => {
  if (!email.trim()) {
    return "Email is required";
  }

  // First character must be a letter
  if (!/^[A-Za-z]/.test(email)) {
    return "Email should start with a letter";
  }

  // Standard email regex
  const emailRegex = /^[A-Za-z][^\s@]*@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  if (email.length > 50) {
    return "Email should not exceed 50 characters";
  }

  return "";
};
