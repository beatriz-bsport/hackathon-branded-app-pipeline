export function generateRandomInt(max: number, min: number = 0) {
  // Return a random value between min (included, 0 if undefined) and max (excluded)
  return Math.floor(Math.random() * (max - min)) + min;
}
