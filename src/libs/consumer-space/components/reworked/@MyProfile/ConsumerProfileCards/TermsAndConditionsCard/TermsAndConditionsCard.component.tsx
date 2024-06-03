import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Card from '#Fabrique/Card';
import Title from '#Fabrique/Title';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Button from '#Fabrique/ButtonV2';

import type { TermsAndConditionsCardProps } from '#libs/consumer-space/components/reworked/@MyProfile/types';
import { ConsumerProfileContext } from '#libs/consumer-space/components/reworked/@MyProfile/ConsumerProfileContext';
import './styles.css';

const TermsAndConditionsCard: React.FC<TermsAndConditionsCardProps> = ({
  dateJoined,
  generalTermsAndConditionsDateAccepted,
}) => {
  const { t } = useTranslation('consumerSpace');
  const { toggleTermsAndConditionPortal, toggleTermsOfUsePortal } =
    useContext(ConsumerProfileContext) ?? {};

  return (
    <Card className={classNames('bs-consumer-payment-terms-card__root')}>
      <Title
        className="bs-consumer-payment-terms-card__title"
        subtitle={t('reworked.myProfile.termsAndConditions.subtitle', {
          dateJoined,
        })}
        title={t('reworked.myProfile.termsAndConditions.title')}
        variant="xs"
      />
      <List className="bs-consumer-payment-terms-card__list">
        <ListItem
          className="bs-consumer-payment-terms-card__list-item"
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
            dateAccepted: generalTermsAndConditionsDateAccepted,
          })}
          classes={{
            captionText:
              'bs-consumer-payment-terms-card__list-item__caption-text',
          }}
          className="bs-consumer-payment-terms-card__list-item"
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
