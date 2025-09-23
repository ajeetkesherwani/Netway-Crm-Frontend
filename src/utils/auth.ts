// export const isAuthenticated = (): boolean => {
//   return localStorage.getItem("auth") === "true";
// };

// export const login = (): void => {
//   localStorage.setItem("auth", "true");
// };


// export const logout = (): void => {
//   localStorage.removeItem("auth");
// };


// utils/auth.ts

// ✅ store token
export const login = (token: string): void => {
  localStorage.setItem("token", token);
  localStorage.setItem("auth", "true"); // optional flag
};

// ✅ check if logged in
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

// ✅ remove token on logout
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("auth");
};

// ✅ get token when making API requests
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};
