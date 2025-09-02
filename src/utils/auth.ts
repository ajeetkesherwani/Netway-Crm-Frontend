export const isAuthenticated = (): boolean => {
  return localStorage.getItem("auth") === "true";
};

export const login = (): void => {
  localStorage.setItem("auth", "true");
};

export const logout = (): void => {
  localStorage.removeItem("auth");
};
