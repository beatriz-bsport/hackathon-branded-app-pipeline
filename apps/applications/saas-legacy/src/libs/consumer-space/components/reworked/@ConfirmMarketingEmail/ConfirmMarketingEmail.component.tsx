import React, { useEffect, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '#src/components/css-only/Fabrique/Typography';
import Card from '#src/components/css-only/Fabrique/Card';
import BigIcon from '#src/components/css-only/Fabrique/BigIcon';
import Title from '#src/components/css-only/Fabrique/Title';
import { AlertCircle } from '#src/components/untitledui';
import { postConfirmMarketingEmail } from '#src/libs/member/api';
import type { CompanyTheme } from '#src/libs/theme/types';
import ConfirmMarketingEmailSkeleton from './ConfirmMarketingEmailSkeleton';
import './styles.css';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

const REDIRECT_COUNTDOWN_SECONDS = 10;
const REDIRECT_INTERVAL_MS = 1000;
const FEATURE_FLAG_ERROR_CODE = 'FF_000';
const DEFAULT_BSPORT_LOGO = 'https://cdn.bsport.io/bsport_logo_txt.png';

type Props = {
  confirmationToken: string;
  companyTheme?: CompanyTheme | null;
  companyThemeLoading: boolean;
};

const ContentWrapper: React.FC = ({ children }) => {
  return (
    <div className="bs-confirm-marketing-email__container">
      <Card className="bs-confirm-marketing-email__card" variant="elevated">
        {children}
      </Card>
    </div>
  );
};

export const ConfirmMarketingEmail: React.FC<Props> = ({
  confirmationToken,
  companyTheme,
  companyThemeLoading,
}) => {
  const { t } = useTranslation('b2c_consumerSpace');
  const isDoubleOptInEnabled = useSafeFlag(
    FeatureFlags.MARKETING_DOUBLE_OPT_IN,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REDIRECT_COUNTDOWN_SECONDS);

  const companyName = companyTheme?.company_name ?? '';
  const websiteURL = companyTheme?.websiteURL;

  useEffect(() => {
    if (!isDoubleOptInEnabled) {
      setIsLoading(false);
      return;
    }

    postConfirmMarketingEmail(confirmationToken)
      .catch((err) => {
        console.error(
          'An error occurred during marketing email confirmation:',
          err.message,
        );
        setIsError(true);
        setError(err?.response?.data?.error || err?.response?.data?.error_code);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [confirmationToken, isDoubleOptInEnabled]);

  useEffect(() => {
    if (isLoading || isError || !isDoubleOptInEnabled || !websiteURL) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = websiteURL;
          return 0;
        }
        return prev - 1;
      });
    }, REDIRECT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isLoading, isError, websiteURL, isDoubleOptInEnabled]);

  if (companyThemeLoading || isLoading) {
    return (
      <ContentWrapper>
        <ConfirmMarketingEmailSkeleton />
      </ContentWrapper>
    );
  }

  if (isError || !isDoubleOptInEnabled) {
    return (
      <ContentWrapper>
        <BigIcon IconComponent={AlertCircle} variant="error" />
        <Title
          classes={{ subTitle: 'bs-confirm-marketing-email__subtitle' }}
          className="bs-confirm-marketing-email__title"
          subtitle={t(`confirmMarketingEmail.error.text`)}
          title={t(`confirmMarketingEmail.error.title`)}
          variant="sm"
        />
        {(error || !isDoubleOptInEnabled) && (
          <>
            <hr className="bs-confirm-marketing-email__divider" />
            <Typography
              align="center"
              className="bs-confirm-marketing-email__footer"
              variant="body-xs"
            >
              {t('confirmMarketingEmail.error.detail', {
                error: !isDoubleOptInEnabled ? FEATURE_FLAG_ERROR_CODE : error,
              })}
            </Typography>
          </>
        )}
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <div className="bs-confirm-marketing-email__company-logo__container">
        <div className="bs-confirm-marketing-email__company-logo__wrapper">
          <img
            alt={
              companyTheme
                ? `${companyTheme.company_name} - logo`
                : 'bsport-logo'
            }
            className="bs-confirm-marketing-email__company-logo"
            src={companyTheme ? companyTheme.cover : DEFAULT_BSPORT_LOGO}
          />
        </div>
      </div>
      <Title
        classes={{ subTitle: 'bs-confirm-marketing-email__subtitle' }}
        className="bs-confirm-marketing-email__title"
        subtitle={t('confirmMarketingEmail.success.text', { companyName })}
        title={t('confirmMarketingEmail.success.title')}
        variant="sm"
      />
      <hr className="bs-confirm-marketing-email__divider" />
      {websiteURL && (
        <Typography
          align="center"
          className="bs-confirm-marketing-email__redirect"
          variant="body-sm"
        >
          {t('confirmMarketingEmail.redirectToWebsite', { countdown })}
        </Typography>
      )}
      <Typography
        align="center"
        className="bs-confirm-marketing-email__footer"
        variant="body-xs"
      >
        {t('confirmMarketingEmail.footer')}
      </Typography>
    </ContentWrapper>
  );
};

export default memo(ConfirmMarketingEmail);
