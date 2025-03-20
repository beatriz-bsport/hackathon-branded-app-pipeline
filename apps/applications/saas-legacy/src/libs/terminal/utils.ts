export const parseIntentIdFromClientSecret = (
  clientSecret: string,
): string | null => {
  // Searches for the pattern 'pi_' or 'seti_' followed by 24 alphanumerical chars
  const intentRegex = /^(pi_|seti_)[A-Za-z0-9]{24}/;
  const intentId = intentRegex.exec(clientSecret);
  return intentId ? intentId[0] : null;
};
