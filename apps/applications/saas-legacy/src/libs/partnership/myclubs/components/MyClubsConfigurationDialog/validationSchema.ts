import * as Yup from 'yup';

export const PartnershipConfigurationValidationSchema = Yup.object().shape({
  establishmentIds: Yup.array()
    .of(Yup.number())
    .test(
      'Should Contain At Least One Establishment',
      'partnership:myclubs.configuration.dialog.field.establishmentIds.error.required',
      function checkEstablishmentLength() {
        return this.parent.establishmentIds?.length >= 1;
      },
    ),
});
