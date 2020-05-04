import moment from 'moment';
import uniq from 'lodash/uniq';

export const getMissingResourceForBooking = (service, data, asManager) => {
  if (!service || !data) return ['private_service'];
  const missing = [];
  if (service.is_home_service && asManager) {
    missing.push('address');
  } else if (service.establishments.length && !data.establishment) {
    missing.push('establishment');
  }
  if (service.coaches.length && !data.coach && asManager) {
    missing.push('coach');
  }
  if (!data.private_service) {
    missing.push('private_service');
  }
  if (!data.private_slot) {
    missing.push('private_slot');
  }

  return missing;
};

export const splitIntervalList = (
  interval_list,
  duration_minutes = 0,
  booking_interval = 15,
) => {
  const slots = [];
  interval_list.map(([start, end]) => {
    const slotToGenerate =
      parseInt(
        (moment(end).add(-duration_minutes, 'minutes') - moment(start)) /
          (1000 * 60 * booking_interval),
        10,
      ) + 1;
    let n = 0;
    while (n < slotToGenerate) {
      slots.push(
        moment(start)
          .add(n * booking_interval, 'minutes')
          .format(),
      );
      n += 1;
    }
    return null;
  });
  return uniq(slots);
};
