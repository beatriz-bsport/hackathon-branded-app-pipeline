import * as Yup from 'yup';

export const WellhubConfigurationValidationSchema = Yup.object().shape({
  unitId: Yup.number()
    .nullable(true)
    .required(
      'partnership:wellhub.configuration.dialog.field.externalId.error.required',
    )
    .min(
      0,
      'partnership:wellhub.configuration.dialog.field.externalId.error.positive',
    ),
  establishmentIds: Yup.array()
    .of(Yup.number())
    .test(
      'Should Contain At Least One Establishment',
      'partnership:wellhub.configuration.dialog.field.establishmentIds.error.required',
      function checkEstablishmentLength() {
        return this.parent.establishmentIds?.length >= 1;
      },
    ),
});
