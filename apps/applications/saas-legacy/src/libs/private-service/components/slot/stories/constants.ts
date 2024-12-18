export const initialData = {
  name: 'La vallée des rois',
  duration_minutes: '45',
  duration_hour: '2',
  duration_day: '1',
  credit: '2',
  people_capacity_used: '10',
  booking_interval_minutes: '30',
};

export const defaultValues = {
  name: '',
  durationMinutes: '0',
  durationHours: '1',
  durationDays: '0',
  credit: '1',
  peopleCapacityUsed: '1',
  bookingIntervalMinutes: '15',
};

export const expectedValues = {
  name: initialData.name,
  durationMinues: initialData.duration_minutes,
  durationHours: '0',
  durationDays: defaultValues.durationDays,
  credit: initialData.credit,
  peopleCapacityUsed: initialData.people_capacity_used,
  bookingIntervalMinutes: initialData.booking_interval_minutes,
};

export const wrongInputValues = {
  numeric: 'I am not supposed to be a sentance',
};
