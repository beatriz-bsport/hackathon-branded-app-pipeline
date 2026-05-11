/**
 * Transforms a member full name into initials
 * @example getMemberInitials(name: "john doe") => "JD"
 * @example getMemberInitials(name: "jean claude van damme") => "JCVD"
 */
export const getMemberInitialsFromFullName = (name: string): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};
