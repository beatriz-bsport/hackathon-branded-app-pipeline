import React, { useCallback, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '#src/components/css-only/Fabrique/Typography';
import Button from '#src/components/css-only/Fabrique/ButtonV2';
import CircularProgress from '#src/components/css-only/CircularProgress';
import Card from '#src/components/css-only/Fabrique/Card';
import BigIcon from '#src/components/css-only/Fabrique/BigIcon';
import { BellOff01 } from '#src/components/untitledui';
import { postUnsubscribe } from '#src/libs/member/api';
import type { CompanyTheme } from '#src/libs/theme/types';
import Title from '#src/components/css-only/Fabrique/Title';
import UnsubscribeSkeleton from './UnsubscribeSkeleton';
import './styles.css';

type SuccessProps = {
  successTitle: string;
  successText: string;
};

type Props = {
  unsubscribe_uuid: string;
  companyTheme: CompanyTheme;
  companyThemeLoading: boolean;
};

const UnsubscribeSuccessStateComponent: React.FC<SuccessProps> = ({
  successTitle,
  successText,
}) => {
  return (
    <>
      <BigIcon IconComponent={BellOff01} variant="success" />
      <Title
        className="bs-unsubscribe__success__title"
        subtitle={successText}
        title={successTitle}
        variant="sm"
      />
    </>
  );
};

const ContentWrapper: React.FC = ({ children }) => {
  return (
    <div className="bs-unsubscribe__container">
      <Card className="bs-unsubscribe__card" variant="elevated">
        {children}
      </Card>
    </div>
  );
};

export const Unsubscribe: React.FC<Props> = ({
  unsubscribe_uuid,
  companyTheme,
  companyThemeLoading,
}) => {
  const { t } = useTranslation('consumerSpace');

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const doUnsubscribe = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      await postUnsubscribe(unsubscribe_uuid);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [setIsError, setIsLoading, setIsSuccess, unsubscribe_uuid]);

  const companyName = companyTheme?.company_name ?? '';

  if (companyThemeLoading) {
    return (
      <ContentWrapper>
        <UnsubscribeSkeleton />
      </ContentWrapper>
    );
  }
  if (isSuccess) {
    return (
      <ContentWrapper>
        <UnsubscribeSuccessStateComponent
          successText={t('unsubscriber.success.text', { companyName })}
          successTitle={t('unsubscriber.success.title')}
        />
      </ContentWrapper>
    );
  }

  // Check if the last character of the company name is 's'
  const translationKey = companyName.endsWith('s')
    ? `unsubscriber.explainAction.normal`
    : `unsubscriber.explainAction.possessive`;

  return (
    <ContentWrapper>
      <div className="bs-unsubscribe__company-logo__container">
        <div className="bs-unsubscribe__company-logo__wrapper">
          <img
            alt={
              companyTheme
                ? `${companyTheme.company_name} - logo`
                : 'bsport-logo'
            }
            className="bs-unsubscribe__company-logo"
            src={
              companyTheme
                ? companyTheme.cover
                : 'https://cdn.bsport.io/bsport_logo_txt.png'
            }
          />
        </div>
      </div>
      <Title
        classes={{ title: 'bs-unsubscribe__typography' }}
        title={t(translationKey, { companyName })}
        variant="sm"
      />
      {isError && (
        <Typography color="error">{t('unsubscriber.error')}</Typography>
      )}
      {isLoading ? (
        <CircularProgress className="bs-unsubscribe__circular-progress" />
      ) : (
        <Button color="grey" onClick={doUnsubscribe} variant="outlined">
          {t('unsubscriber.doUnsubscribe')}
        </Button>
      )}
    </ContentWrapper>
  );
};

export default memo(Unsubscribe);
