import moment from 'moment-timezone';

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
  const parsedStartDate = startDate ? moment(startDate).startOf('day') : null;

  const parsedExpirationDate = expirationDate
    ? moment(expirationDate).startOf('day')
    : null;

  const daysBeforeExpiration = parsedExpirationDate
    ? parsedExpirationDate.diff(moment().startOf('day'), 'days')
    : null;

  let availability = null;

  if (parsedExpirationDate) {
    if (parsedExpirationDate.isBefore(moment(), 'day')) {
      availability = 'expired';
    } else {
      availability = 'active';
    }
    if (parsedStartDate && parsedStartDate.isAfter(moment())) {
      availability = 'future';
    }
  }

  return {
    daysBeforeExpiration,
    availability,
    formatedDates: {
      startDate: parsedStartDate?.format('L'),
      expirationDate: parsedExpirationDate?.format('L'),
    },
  };
};
