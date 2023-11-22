import * as Yup from 'yup';

export const CalendarFilterValidationSchema = Yup.object().shape({
  filters: Yup.object().shape({
    coaches: Yup.array().of(Yup.number().nullable(false)).max(100),
    establishments: Yup.array().of(Yup.number().nullable(false)).max(100),
    activity__in: Yup.array().of(Yup.number().nullable(false)).max(100),
    levels: Yup.array().of(Yup.number().nullable(false)).max(100),
    establishment_group__in: Yup.array()
      .of(Yup.number().nullable(false))
      .max(100),
  }),
});

export const CalendarOnlineFilterValidationSchema = Yup.object().shape({
  onlineFilter: Yup.object().shape({
    is_online: Yup.boolean().nullable(),
  }),
});
