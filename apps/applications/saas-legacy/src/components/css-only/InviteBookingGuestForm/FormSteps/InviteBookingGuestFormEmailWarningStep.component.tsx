import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import Alert from '#src/components/css-only/Fabrique/Alert';
import TextField from '#src/components/css-only/Fabrique/TextFieldV2';

import type { InviteBookingGuestFormValues } from '..';

const InviteBookingGuestFormEmailWarningStep: React.FC = () => {
  const { t } = useTranslation('booking');

  const { values, errors, handleChange } =
    useFormikContext<InviteBookingGuestFormValues>();

  return (
    <>
      <Alert color="warning" variant="weak">
        {t('guest.form.dialog.emailWarning.alert')}
      </Alert>

      <div className="bs-invite-booking-guest-modal__form__fields">
        <TextField
          isFullWidth
          errorMessage={t(errors.email)}
          id="add-guest-modal-warning-email"
          inputId="add-guest-modal-warning-email-input"
          isError={!!errors.email}
          label={t('guest.form.dialog.emailWarning.fieldLabel')}
          name="email"
          onChange={handleChange}
          placeholder={t('booking:guest.form.email.label')}
          type="email"
          value={values.email}
        />
      </div>
    </>
  );
};

export default React.memo(InviteBookingGuestFormEmailWarningStep);
