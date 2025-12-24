export const stateValidate = (state) => {
  const trimmed = (state || "").trim();

  if (!trimmed) {
    return "state is required";
  }

  // if (!/^[A-Za-z\s]+$/.test(trimmed)) {
  //   return "state can contain only alphabets";
  // }

  if (trimmed.length > 35) {
    return "state should not exceed 35 characters";
  }

  return "";
};
