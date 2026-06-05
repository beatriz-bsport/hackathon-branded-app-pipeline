import React from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerCardSection from '#src/libs/consumer-space/components/reworked/common/ConsumerCardSection';
import Button from '#Fabrique/ButtonV2';
import type { ConsumerSubscriptionDetailsCardProps } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionDetailsCard/index';
import Alert from '#Fabrique/Alert';
import clsx from 'clsx';

type Props = Required<
  Pick<
    ConsumerSubscriptionDetailsCardProps,
    | 'commitmentValue'
    | 'commitmentPeriod'
    | 'isCommitmentPeriodSectionHidden'
    | 'onUnSubscribeClick'
    | 'shouldDisplayCommitmentPeriodAlert'
    | 'shouldDisplayCommitmentPeriodSubtitle'
    | 'isMemberCancellationAllowed'
  >
>;

const ConsumerSubscriptionDetailsCardCommitmentPeriod: React.FC<Props> = ({
  shouldDisplayCommitmentPeriodAlert,
  shouldDisplayCommitmentPeriodSubtitle,
  commitmentValue,
  commitmentPeriod,
  isMemberCancellationAllowed,
  isCommitmentPeriodSectionHidden,
  onUnSubscribeClick,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (isCommitmentPeriodSectionHidden) {
    return null;
  }

  return (
    <ConsumerCardSection
      alerts={[
        <Alert key="commitment-period-alert" color="info" variant="weak">
          {t(
            `reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.explain.${commitmentPeriod}`,
            {
              count: commitmentValue ?? 1,
              commitment_period_value: commitmentValue ?? 1,
            },
          )}
        </Alert>,
      ]}
      classes={{
        textContainer:
          'bs-consumer__subscription-details-card__section__container',
      }}
      className={clsx({
        'bs-consumer__subscription-details-card__commitment_period__section-with-alert':
          shouldDisplayCommitmentPeriodAlert,
        'bs-consumer__subscription-details-card__commitment_period__section':
          !shouldDisplayCommitmentPeriodAlert,
      })}
      isWithAlert={shouldDisplayCommitmentPeriodAlert}
      subtitle={
        shouldDisplayCommitmentPeriodSubtitle
          ? t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.subtitle',
            )
          : undefined
      }
      title={t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.title',
      )}
    >
      <Button
        className="bs-consumer__subscription-details-card__commitment_period__button"
        color="grey"
        isDisabled={!isMemberCancellationAllowed}
        onClick={onUnSubscribeClick}
        size="md"
        variant="outlined"
      >
        {t(
          'reworked.mySubscriptions.consumerSubscriptionCardDetails.buttonsLabel.unsubscribe',
        )}
      </Button>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSubscriptionDetailsCardCommitmentPeriod);
