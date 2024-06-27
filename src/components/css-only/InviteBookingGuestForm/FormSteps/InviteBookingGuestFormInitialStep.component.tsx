import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import TextField from '#Fabrique/TextFieldV2';
import Typography from '#Fabrique/Typography';

import type { InviteBookingGuestFormValues } from '..';

const InviteBookingGuestFormInitialStep: React.FC = () => {
  const { t } = useTranslation('booking');

  const { values, errors, handleChange } =
    useFormikContext<InviteBookingGuestFormValues>();

  return (
    <>
      <Typography>{t('guest.form.dialog.description')}</Typography>

      <div className="bs-invite-booking-guest-modal__form__fields">
        <TextField
          isFullWidth
          isRequired
          errorMessage={t(errors.firstName)}
          id="add-guest-modal-first-name"
          inputId="add-guest-modal-first-name-input"
          isError={!!errors.firstName}
          label={t('guest.form.firstname.label')}
          name="firstName"
          onChange={handleChange}
          placeholder={t('guest.form.firstname.label')}
          type="text"
          value={values.firstName}
        />
        <TextField
          isFullWidth
          id="add-guest-modal-last-name"
          inputId="add-guest-modal-last-name-input"
          label={t('guest.form.lastname.label')}
          name="lastName"
          onChange={handleChange}
          placeholder={t('guest.form.lastname.label')}
          type="text"
          value={values.lastName}
        />
        <TextField
          isFullWidth
          errorMessage={t(errors.email)}
          id="add-guest-modal-email"
          inputId="add-guest-modal-email-input"
          isError={!!errors.email}
          label={t('guest.form.email.label')}
          name="email"
          onChange={handleChange}
          placeholder={t('guest.form.email.label')}
          type="email"
          value={values.email}
        />
      </div>
    </>
  );
};

export default React.memo(InviteBookingGuestFormInitialStep);
