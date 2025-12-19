
export const checkAlternateSameAsMobile = (mobile, alternate) => {
  const m = (mobile || "").trim();
  const a = (alternate || "").trim();
  return m && a && m === a
    ? "Alternate mobile cannot be the same as primary mobile"
    : "";
};