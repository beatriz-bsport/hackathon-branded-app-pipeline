export const formatVideoDuration = (durationInSeconds: number) => {
  const safeDurationInSeconds = Math.max(0, Math.floor(durationInSeconds));
  const hours = Math.floor(safeDurationInSeconds / 3600);
  const minutes = Math.floor((safeDurationInSeconds % 3600) / 60);
  const seconds = safeDurationInSeconds % 60;
  const hoursPart = String(hours).padStart(2, "0");
  const minutesPart = String(minutes).padStart(2, "0");
  const secondsPart = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hoursPart}:${minutesPart}:${secondsPart}`;
  }

  return `${minutesPart}:${secondsPart}`;
};
