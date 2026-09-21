export function convertUTCToLocalDateString(dateString) {
  if (!dateString) return;
  // Extract the date part directly from the ISO string to avoid timezone shift.
  // e.g. "2025-01-09T18:30:00.000Z" stored as midnight IST should show as "9 Jan 2025", not "10 Jan 2025".
  const raw = String(dateString);
  const datePart = raw.includes("T") ? raw.split("T")[0] : raw.split(" ")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) return;
  const date = new Date(year, month - 1, day); // local date, no UTC shift
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function convertUTCDateToYYYYMMDD(dateString) {
  if (!dateString) return null;
  const raw = String(dateString);
  // Extract YYYY-MM-DD directly from ISO string to avoid timezone shift
  if (raw.includes("T") || raw.includes(" ")) {
    return (raw.includes("T") ? raw.split("T")[0] : raw.split(" ")[0]);
  }
  return Intl.DateTimeFormat("en-CA").format(new Date(dateString));
}
