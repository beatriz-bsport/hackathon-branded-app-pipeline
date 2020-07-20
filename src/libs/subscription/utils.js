import moment from 'moment';

export function isPaused(pausesArray) {
  return pausesArray.reduce(
    (acc, p) =>
      acc ||
      moment().isBetween(
        moment(p.date_created),
        moment(p.date_created).add(p.days, 'days'),
      ),
    false,
  );
}
