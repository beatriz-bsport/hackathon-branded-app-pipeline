import { DateTime } from 'luxon';

/**
 * `getAvailabilityInformation` is a function that calculates the availability status of a pass and the days before its expiration, based on the current date and the start and expiration dates of the pass.
 *
 * @param startDate - The start date of the pass, optionnal.
 * @param expirationDate - The expiration date of the pass, optionnal.
 * @returns An object containing the days before expiration, the availability status, and the formatted start and expiration dates.
 *
 */
export const getAvailabilityInformation = ({
  startDate,
  expirationDate,
}: {
  startDate?: string;
  expirationDate?: string;
}) => {
  const parsedStartDate = startDate
    ? DateTime.fromISO(startDate).startOf('day')
    : null;

  const parsedExpirationDate = expirationDate
    ? DateTime.fromISO(expirationDate).startOf('day')
    : null;

  const daysBeforeExpiration = parsedExpirationDate
    ? Math.floor(
        parsedExpirationDate
          .diff(DateTime.now().startOf('day'), 'days')
          .as('days'),
      )
    : null;

  let availability = null;

  if (parsedExpirationDate) {
    if (parsedExpirationDate < DateTime.now()) {
      availability = 'expired';
    } else {
      availability = 'active';
    }
    if (parsedStartDate && parsedStartDate > DateTime.now()) {
      availability = 'future';
    }
  }

  return {
    daysBeforeExpiration,
    availability,
    formatedDates: {
      startDate: parsedStartDate?.toFormat('D'),
      expirationDate: parsedExpirationDate?.toFormat('D'),
    },
  };
};
