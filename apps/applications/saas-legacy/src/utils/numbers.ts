export const safeParseFloat = (input?: string | null): number => {
  try {
    if (input === null || input === undefined) {
      return 0;
    }

    const parsed = Number.parseFloat(input);
    if (Number.isNaN(parsed)) {
      return 0;
    }

    return parsed;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
