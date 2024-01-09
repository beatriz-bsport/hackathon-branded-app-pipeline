import React from 'react';
import PersonAdd from '@material-ui/icons/PersonAdd';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import StatusMessageWithIcon from '#components/css-only/StatusMessageWithIcon';
import TextField from '#Fabrique/TextField';
import Button, { ButtonColor, ButtonType } from '#Fabrique/Button';
import { type AddGuestFormValues } from '..';

type Props = {
  bookingGuestRemainingText: string;
  onCancel: () => void;
};

const AddGuestFormInitialStep: React.FC<Props> = ({
  bookingGuestRemainingText,
  onCancel,
}) => {
  const { t } = useTranslation(['booking', 'common']);
  const { values, errors, handleChange } =
    useFormikContext<AddGuestFormValues>();

  return (
    <>
      <StatusMessageWithIcon
        icon={
          <div className="bs-booking-add-guest-modal__icon bs-booking-add-guest-modal-initial__icon">
            <PersonAdd />
          </div>
        }
        id="add-guest-modal-message-icon"
        message={t('booking:guest.form.dialog.description')}
        title={t('booking:guest.form.dialog.title')}
      />

      {bookingGuestRemainingText && (
        <span
          className="bs-booking-add-guest-modal__guest-count"
          id="add-guest-modal-guest-count"
        >
          <i>{bookingGuestRemainingText}</i>
        </span>
      )}

      <TextField
        hasWhiteBackground
        isFullWidth
        isRequired
        helperText={t(errors.firstName)}
        helperTextId="add-guest-modal-first-name-helper-text"
        id="add-guest-modal-first-name"
        inputId="add-guest-modal-first-name-input"
        isError={!!errors.firstName}
        label={t('booking:guest.form.firstname.label')}
        name="firstName"
        onChange={handleChange}
        type="text"
        value={values.firstName}
      />
      <TextField
        hasWhiteBackground
        isFullWidth
        id="add-guest-modal-last-name"
        inputId="add-guest-modal-last-name-input"
        label={t('booking:guest.form.lastname.label')}
        name="lastName"
        onChange={handleChange}
        type="text"
        value={values.lastName}
      />
      <TextField
        hasWhiteBackground
        isFullWidth
        helperText={t(errors.email)}
        helperTextId="add-guest-modal-email-helper-text"
        id="add-guest-modal-email"
        inputId="add-guest-modal-email-input"
        isError={!!errors.email}
        label={t('booking:guest.form.email.label')}
        name="email"
        onChange={handleChange}
        type="email"
        value={values.email}
      />

      <div
        className="bs-booking-add-guest-modal__actions"
        id="add-guest-modal-form-actions"
      >
        <Button
          classes={{
            root: 'bs-booking-add-guest-modal__actions__cancel',
          }}
          onClick={onCancel}
        >
          {t('common:cancel')}
        </Button>
        <Button
          classes={{
            root: 'bs-booking-add-guest-modal__actions__submit',
          }}
          color={ButtonColor.PRIMARY}
          type={ButtonType.SUBMIT}
        >
          {t('common:confirm')}
        </Button>
      </div>
    </>
  );
};

export default React.memo(AddGuestFormInitialStep);
