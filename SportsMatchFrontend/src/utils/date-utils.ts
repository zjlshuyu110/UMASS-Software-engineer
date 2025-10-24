export const dateTemps = [8, 9, 10, 11, 12, 13, 14, 15].map((hour) => {
  const date = new Date()
  date.setHours(hour)
  return date
})

export function formatISOToDayDate(isoString: string): string {
  const date = new Date(isoString);

  const day = date.toLocaleString("en-US", { weekday: "short" }); // e.g. "Thu"
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const dayOfMonth = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day} ${month}/${dayOfMonth}/${year}`;
}
