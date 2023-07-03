import React, { useState } from 'react';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import '../Login.css';
import { useTranslation, withTranslation } from 'react-i18next';

import { StylesProvider, useTheme } from '@material-ui/styles';
import classNames from 'classnames';
import EmailIcon from '#components/icons/EmailIcon.component';
import ResendEmailForConfirmationDialog from '../ResendEmailForConfirmationDialog.component';
import LoginTitle from '../LoginTitle.component';

import './EmailConfirmationStyles.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

type Props = {
  goBackToLogin: () => void;
  sendEmailForConfirmation: (options: any) => void;
  lastTimeSentEmailConfirmation: string;
  simplifyUI?: boolean;
  company?: boolean;
};

export const EmailConfirmation = (props: Props) => {
  const { t } = useTranslation('login');
  const theme = useTheme();

  const [resendEmailForConfirmation, setResendEmailForConfirmation] =
    useState(false);

  return (
    <StylesProvider injectFirst>
      <div className="bs-email-confirmation-content">
        <div className="bs-email-confirmation-content__top-container">
          <LoginTitle
            title={t('emailConfirmation.title')}
            simplifyUI={props.simplifyUI}
            company={props.company}
          />
        </div>
        {!props.simplifyUI && (
          <div className="bs-email-confirmation-content__icon-container">
            <div className="bs-email-confirmation-content__icon-container__background" />
            <EmailIcon
              className="bs-email-confirmation-content__icon-container__icon"
              // @ts-ignore
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
          id="btn-back-to-log-in"
          onClick={props.goBackToLogin}
          className="bs-email-confirmation-content__back-button"
        >
          {t('emailConfirmation.backToLogin')}
        </Button>
        <div className="bs-email-confirmation-content__bottom-container">
          <div className="bs-email-confirmation-content__caption-text">
            {t('emailConfirmation.notReceived')}
          </div>
          <div className="bs-email-confirmation-content__bottom-container__second-line">
            <Button
              id="btn-resend-email"
              className="bs-email-confirmation-content__bottom-container__second-line__resend-email-button"
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
          open={resendEmailForConfirmation}
          onClose={() => {
            setResendEmailForConfirmation(false);
          }}
          lastTimeSentEmailConfirmation={props.lastTimeSentEmailConfirmation}
          resendEmailForConfirmation={props.sendEmailForConfirmation}
        />
      </div>
    </StylesProvider>
  );
};

export const EmailConfirmationStorybook =
  // @ts-expect-error
  marketplaceCssHoc()(EmailConfirmation);

export default compose<any, Props>(withTranslation(['login']))(
  React.memo(EmailConfirmation),
);
