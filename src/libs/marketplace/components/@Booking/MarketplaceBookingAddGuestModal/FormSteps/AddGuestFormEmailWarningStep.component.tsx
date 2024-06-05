import React from 'react';
import WarningRounded from '@material-ui/icons/WarningRounded';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import StatusMessageWithIcon from '#components/css-only/StatusMessageWithIcon';
import TextField from '#Fabrique/TextField';
import Button, { ButtonColor, ButtonType } from '#Fabrique/Button';
import { type AddGuestFormValues } from '..';

const AddGuestFormEmailWarningStep: React.FC = () => {
  const { t } = useTranslation('booking');
  const { values, errors, handleChange } =
    useFormikContext<AddGuestFormValues>();

  return (
    <>
      <StatusMessageWithIcon
        icon={
          <div className="bs-booking-add-guest-modal__icon bs-booking-add-guest-modal-warning__icon">
            <WarningRounded />
          </div>
        }
        id="add-guest-modal-warning-message-icon"
        message={t('booking:guest.form.dialog.emailWarning.description')}
        title={t('booking:guest.form.dialog.emailWarning.title')}
      />

      <TextField
        hasWhiteBackground
        isFullWidth
        helperText={t(errors.email)}
        id="add-guest-modal-warning-email"
        inputId="add-guest-modal-warning-email-input"
        isError={!!errors.email}
        label={t('booking:guest.form.email.label')}
        name="email"
        onChange={handleChange}
        type="email"
        value={values.email}
      />

      <div
        className="bs-booking-add-guest-modal__actions bs-booking-add-guest-modal-warning__actions"
        id="add-guest-modal-form-actions"
      >
        <Button
          classes={{
            root: 'bs-booking-add-guest-modal__actions__cancel',
          }}
          type={ButtonType.SUBMIT}
        >
          {t(
            'booking:guest.form.dialog.emailWarning.actions.continueWithoutEmail',
          )}
        </Button>
        <Button
          classes={{
            root: 'bs-booking-add-guest-modal__actions__submit',
          }}
          color={ButtonColor.PRIMARY}
          isDisabled={!values.email || !!errors.email}
          type={ButtonType.SUBMIT}
        >
          {t('booking:guest.form.dialog.emailWarning.actions.saveAndContinue')}
        </Button>
      </div>
    </>
  );
};

export default React.memo(AddGuestFormEmailWarningStep);
