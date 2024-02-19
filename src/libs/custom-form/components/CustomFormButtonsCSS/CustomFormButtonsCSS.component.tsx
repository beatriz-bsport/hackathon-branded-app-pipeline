import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import type {
  CustomFormFieldAnswer,
  CustomFormFilled,
} from '#libs/custom-form/types';
import Button from '#Fabrique/ButtonV2';
import './styles.css';

export type Props = {
  onCancel?: (data?: CustomFormFieldAnswer) => void;
  disconnectOnCancel?: boolean;
  handleSubmit?: () => void;
  onSubmitDraft?: (customFormwithAnswer: CustomFormFilled) => void;
  values?: CustomFormFilled;
  isMulti?: boolean;
  userStatus?: number;
  renderConfirmButtonText: (
    userStatus?: number,
  ) =>
    | 'member:forms.needInformationValidation.button.notMemberYet'
    | 'member:forms.needInformationValidation.button.memberOfCompany'
    | 'customForm.clientForms.modify'
    | 'customForm.send';
  simplifyUI?: boolean;
  isSubmitting: boolean;
  handleCancel: () => void;
};

const CustomFormButtonsCSS: React.FC<Props> = ({
  onCancel,
  disconnectOnCancel,
  handleSubmit,
  onSubmitDraft,
  values,
  isMulti,
  userStatus,
  renderConfirmButtonText,
  simplifyUI,
  isSubmitting,
  handleCancel,
}) => {
  const { t } = useTranslation('marketing');

  const handleOnClick = useCallback(() => {
    handleSubmit?.();
    onSubmitDraft?.(values);
  }, [handleSubmit, onSubmitDraft, values]);

  return (
    <div
      className={classNames({
        'bs-custom-form-buttons--submit-and-cancel': !!onCancel,
        'bs-custom-form-buttons--submit': !onCancel,
        'bs-custom-form-buttons--submit-and-cancel--simplified':
          !!onCancel && simplifyUI,
      })}
    >
      <Button
        className={classNames('bs-custom-form-buttons__button_cancelled', {
          'bs-custom-form-buttons__button--hidden': !onCancel,
        })}
        color="primary"
        isDisabled={isSubmitting}
        onClick={handleCancel}
        size="md"
        variant="text"
      >
        {disconnectOnCancel
          ? t('customForm.disconnect')
          : t('customForm.previous')}
      </Button>
      <Button
        className={classNames('bs-custom-form-buttons__button_submit', {
          'bs-custom-form-buttons__button--hidden':
            !handleSubmit && !onSubmitDraft,
        })}
        color="primary"
        isDisabled={isSubmitting}
        onClick={handleOnClick}
        size="md"
        variant="contained"
      >
        {isMulti
          ? t('customForm.next')
          : t(renderConfirmButtonText(userStatus))}
      </Button>
    </div>
  );
};

export const CustomFormButtonsCSSStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof CustomFormButtonsCSS>>()(
    CustomFormButtonsCSS,
  );
export default React.memo(CustomFormButtonsCSS);
