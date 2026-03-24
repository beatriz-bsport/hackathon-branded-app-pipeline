/**
 * Crops the number if the total number of digits after the separator is greater than maxDigits.
 */
export function toMaxDigits(value: number, maxDigits?: number) {
  if (maxDigits == null) {
    return value;
  }

  if (maxDigits === 0) {
    return Math.trunc(value);
  }

  // Convert the number to a string to handle the decimal part
  const valueStr = value.toString();

  // Split the string into integer and decimal parts
  const parts = valueStr.split(/[.,]/);
  const integerPart = parts[0];
  const decimalPart = parts[1] || "";

  // If there is no decimal part or it's already within the limit, return the original value
  if (!decimalPart || decimalPart.length <= maxDigits) {
    return value;
  }

  // Truncate the decimal part to maxDigits
  const truncatedDecimal = decimalPart.substring(0, maxDigits);

  // Reconstruct the number string
  const resultStr = `${integerPart}.${truncatedDecimal}`;

  // Convert back to a number and return
  return parseFloat(resultStr);
}
