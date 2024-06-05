import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import '#csscomponents/Login/styles.css';
import { useTranslation } from 'react-i18next';

import { StylesProvider } from '@material-ui/styles';
import { useTheme } from '@material-ui/core';
import classNames from 'classnames';
import EmailIcon from '#components/icons/EmailIcon.component';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import ResendEmailForConfirmationDialog from '../ResendEmailForConfirmationDialog.component';
import LoginTitle from '../LoginTitle.component';

import './EmailConfirmationStyles.css';

type Props = {
  goBackToLogin: () => void;
  sendEmailForConfirmation: (options: any) => void;
  lastTimeSentEmailConfirmation: string;
  simplifyUI?: boolean;
  company?: boolean;
};

export const EmailConfirmation: React.FC<Props> = ({
  goBackToLogin,
  sendEmailForConfirmation,
  lastTimeSentEmailConfirmation,
  simplifyUI,
  company,
}) => {
  const { t } = useTranslation('login');
  const theme = useTheme();

  const [resendEmailForConfirmation, setResendEmailForConfirmation] =
    useState(false);

  return (
    <StylesProvider injectFirst>
      <div className="bs-email-confirmation-content">
        <div className="bs-email-confirmation-content__top-container">
          <LoginTitle
            isCompany={company}
            simplifyUI={simplifyUI}
            title={t('emailConfirmation.title')}
          />
        </div>
        {!simplifyUI && (
          <div className="bs-email-confirmation-content__icon-container">
            <div className="bs-email-confirmation-content__icon-container__background" />
            <EmailIcon
              className="bs-email-confirmation-content__icon-container__icon"
              fill={theme.palette.primary.main}
            />
          </div>
        )}
        <div
          className={classNames(
            'bs-email-confirmation-content__text-explain',
            'bs-email-confirmation-content__body1-text',
          )}
        >
          {t('emailConfirmation.textExplain')}
        </div>
        <Button
          className="bs-email-confirmation-content__back-button"
          id="btn-back-to-log-in"
          onClick={goBackToLogin}
        >
          {t('emailConfirmation.backToLogin')}
        </Button>
        <div className="bs-email-confirmation-content__bottom-container">
          <div className="bs-email-confirmation-content__caption-text">
            {t('emailConfirmation.notReceived')}
          </div>
          <div className="bs-email-confirmation-content__bottom-container__second-line">
            <Button
              className="bs-email-confirmation-content__bottom-container__second-line__resend-email-button"
              id="btn-resend-email"
              onClick={() => {
                setResendEmailForConfirmation(true);
              }}
            >
              <div className="bs-email-confirmation-content__caption-text">
                {t('emailConfirmation.clickHere')}
              </div>
            </Button>
            <div className="bs-email-confirmation-content__caption-text">
              {t('emailConfirmation.helperToSendOnceAgain')}
            </div>
          </div>
        </div>
        <ResendEmailForConfirmationDialog
          lastTimeSentEmailConfirmation={lastTimeSentEmailConfirmation}
          onClose={() => {
            setResendEmailForConfirmation(false);
          }}
          open={resendEmailForConfirmation}
          resendEmailForConfirmation={sendEmailForConfirmation}
        />
      </div>
    </StylesProvider>
  );
};

export const EmailConfirmationForStorybook =
  marketplaceCssHoc()(EmailConfirmation);

export default React.memo(EmailConfirmation);
