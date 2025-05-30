export const getLocalISOStringWithOffset = (date: Date): string => {
  const pad = (num: number, size = 2) => String(num).padStart(size, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = pad(date.getMilliseconds(), 3);

  // Get timezone offset in minutes and convert to +HH:MM or -HH:MM
  const offset = -date.getTimezoneOffset(); // in minutes
  const offsetSign = offset >= 0 ? "+" : "-";
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
  const offsetMinutes = pad(Math.abs(offset) % 60);

  const offsetString = `${offsetSign}${offsetHours}:${offsetMinutes}`;

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetString}`;
};
