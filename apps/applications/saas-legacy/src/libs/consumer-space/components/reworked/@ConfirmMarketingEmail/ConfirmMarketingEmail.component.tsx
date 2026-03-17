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

const REDIRECT_COUNTDOWN_SECONDS = 10;
const REDIRECT_INTERVAL_MS = 1000;

type Props = {
  memberId: number;
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
  memberId,
  confirmationToken,
  companyTheme,
  companyThemeLoading,
}) => {
  const { t } = useTranslation('b2c_consumerSpace');

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [countdown, setCountdown] = useState(REDIRECT_COUNTDOWN_SECONDS);

  const companyName = companyTheme?.company_name ?? '';

  useEffect(() => {
    postConfirmMarketingEmail(memberId, confirmationToken)
      .catch((err) => {
        console.error(err);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [memberId, confirmationToken]);

  const websiteURL = companyTheme?.websiteURL;

  useEffect(() => {
    if (isLoading || isError || !websiteURL) return;

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
  }, [isLoading, isError, websiteURL]);

  if (companyThemeLoading || isLoading) {
    return (
      <ContentWrapper>
        <ConfirmMarketingEmailSkeleton />
      </ContentWrapper>
    );
  }

  if (isError) {
    return (
      <ContentWrapper>
        <BigIcon IconComponent={AlertCircle} variant="error" />
        <Title
          classes={{ subTitle: 'bs-confirm-marketing-email__subtitle' }}
          className="bs-confirm-marketing-email__title"
          subtitle={t('confirmMarketingEmail.error.text')}
          title={t('confirmMarketingEmail.error.title')}
          variant="sm"
        />
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
            src={
              companyTheme
                ? companyTheme.cover
                : 'https://cdn.bsport.io/bsport_logo_txt.png'
            }
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
