// Studio details shared by the landing page and the contact page.
// Placeholder details, confirm with the studio
export const addressLines = ["7D Commercial Road", "Grantham", "NG31 6DB"];
export const address = addressLines.join(", ");

// open/close are null on closed days
export const hours = [
  { day: "Mon", open: null, close: null },
  { day: "Tue", open: "10:00", close: "18:00" },
  { day: "Wed", open: "10:00", close: "18:00" },
  { day: "Thu", open: "10:00", close: "18:00" },
  { day: "Fri", open: "10:00", close: "18:00" },
  { day: "Sat", open: "10:00", close: "16:00" },
  { day: "Sun", open: null, close: null },
];
