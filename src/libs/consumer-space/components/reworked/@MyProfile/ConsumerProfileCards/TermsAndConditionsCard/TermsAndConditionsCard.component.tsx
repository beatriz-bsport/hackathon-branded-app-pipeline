import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Card from '#Fabrique/Card';
import Title from '#Fabrique/Title';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Button from '#Fabrique/ButtonV2';

import { ConsumerProfileContext } from '#src/libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';
import ConsumerCardSkeleton from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSkeleton';
import type { TermsAndConditionsCardProps } from '#src/libs/consumer-space/components/reworked/@MyProfile/types';
import './styles.css';

const TermsAndConditionsCard: React.FC<TermsAndConditionsCardProps> = ({
  dateJoined,
  generalTermsAndConditionsDateAccepted,
  generalTermsOfUseDateAccepted,
  isLoading,
}) => {
  const { t } = useTranslation('consumerSpace');

  const { toggleTermsAndConditionPortal, toggleTermsOfUsePortal } =
    useContext(ConsumerProfileContext) ?? {};

  const formattedDateJoined = DateTime.fromISO(dateJoined).toFormat('D');

  const formattedGeneralTermsAndConditionsDateAccepted =
    generalTermsAndConditionsDateAccepted &&
    DateTime.fromISO(generalTermsAndConditionsDateAccepted).toFormat('D');

  const formattedGeneralTermsOfUseDateAccepted =
    generalTermsOfUseDateAccepted &&
    DateTime.fromISO(generalTermsOfUseDateAccepted).toFormat('D');

  if (isLoading) return <ConsumerCardSkeleton />;

  return (
    <Card className={classNames('bs-consumer-payment-terms-card__root')}>
      <Title
        className="bs-consumer-payment-terms-card__title"
        subtitle={t('reworked.myProfile.termsAndConditions.subtitle', {
          dateJoined: formattedDateJoined,
        })}
        title={t('reworked.myProfile.termsAndConditions.title')}
        variant="xs"
      />
      <List className="bs-consumer-payment-terms-card__list">
        <ListItem
          captionText={t('reworked.myProfile.termsAndConditions.accepted', {
            dateAccepted: formattedGeneralTermsOfUseDateAccepted,
          })}
          classes={{
            captionText:
              'bs-consumer-payment-terms-card__list-item__caption-text',
          }}
          className={classNames('bs-consumer-payment-terms-card__list-item', {
            'bs-consumer-payment-terms-card__list-item--hidden':
              !formattedGeneralTermsOfUseDateAccepted,
          })}
          label={
            <Button
              className="bs-consumer-payment-terms-card__list-item__button"
              onClick={toggleTermsOfUsePortal}
              size="sm"
              variant="text"
            >
              {t('reworked.myProfile.termsAndConditions.termOfuse')}
            </Button>
          }
          size="sm"
        />
        <ListItem
          captionText={t('reworked.myProfile.termsAndConditions.accepted', {
            dateAccepted: formattedGeneralTermsAndConditionsDateAccepted,
          })}
          classes={{
            captionText:
              'bs-consumer-payment-terms-card__list-item__caption-text',
          }}
          className={classNames('bs-consumer-payment-terms-card__list-item', {
            'bs-consumer-payment-terms-card__list-item--hidden':
              !formattedGeneralTermsAndConditionsDateAccepted,
          })}
          label={
            <Button
              className="bs-consumer-payment-terms-card__list-item__button"
              onClick={toggleTermsAndConditionPortal}
              size="sm"
              variant="text"
            >
              {t('reworked.myProfile.termsAndConditions.generalTerms')}
            </Button>
          }
          size="sm"
        />
      </List>
    </Card>
  );
};

export const TermsAndConditionsCardStorybook = marketplaceCssHoc<
  React.ComponentProps<typeof TermsAndConditionsCard>
>()(TermsAndConditionsCard);
export default React.memo(TermsAndConditionsCard);
