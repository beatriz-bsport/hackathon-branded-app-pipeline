import React from 'react';

import { useTranslation } from 'react-i18next';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Button from '#Fabrique/ButtonV2';
import Typography from '#Fabrique/Typography';

import { CheckCircleBroken } from '#components/untitledui';

import Card from '#Fabrique/Card';

import './styles.css';

type Props = { handlePageExit: () => void };

const ResetPasswordConfirmation: React.FC<Props> = ({ handlePageExit }) => {
  const { t } = useTranslation('translation');
  const title = t('form.passwordResetConfirmation.title');
  const subtitle = t('form.passwordResetConfirmation.subtitle');
  const buttonText = t('form.passwordResetConfirmation.continue');

  return (
    <Card className="bs-reset-password-confirmation__container">
      <div className="bs-reset-password-confirmation__content__icon-container">
        <CheckCircleBroken
          className="bs-reset-password-confirmation__content__icon"
          stroke="currentColor"
        />
      </div>
      <div className="bs-reset-password-confirmation__content__text-section">
        <Typography
          align="center"
          className="bs-reset-password-confirmation__content__text-section__title"
          variant="title-sm"
        >
          {title}
        </Typography>
        <Typography
          align="center"
          className="bs-reset-password-confirmation__content__text-section__subtitle"
          variant="body-md"
        >
          {subtitle}
        </Typography>
      </div>
      <Button
        className="bs-reset-password-confirmation__content__continue-button"
        onClick={handlePageExit}
        size="md"
      >
        {buttonText}
      </Button>
    </Card>
  );
};
export const ResetPasswordConfirmationStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof ResetPasswordConfirmation>
>()(ResetPasswordConfirmation);

export default React.memo(ResetPasswordConfirmation);
