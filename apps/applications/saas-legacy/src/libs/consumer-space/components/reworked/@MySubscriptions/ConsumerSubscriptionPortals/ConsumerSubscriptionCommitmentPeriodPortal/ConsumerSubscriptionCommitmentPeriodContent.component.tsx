import React from 'react';

import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import BigIcon from '#Fabrique/BigIcon';
import Typography from '#Fabrique/Typography';
import CircularProgress from '#src/components/css-only/CircularProgress';
import Alert from '#Fabrique/Alert';

import { formatAsDate } from '#src/utils/datetime';

type Props = {
  hasSucceeded: boolean;
  hasFailed: boolean;
  hasSubscriptionStarted: boolean;
  subscriptionForecastedExpirationDate: string | null;
  isProcessing: boolean;
};

const ConsumerSubscriptionCommitmentPeriodContent: React.FC<Props> = ({
  hasSucceeded,
  hasFailed,
  hasSubscriptionStarted,
  isProcessing,
  subscriptionForecastedExpirationDate,
}) => {
  const { t } = useTranslation('consumerSpace');

  if (isProcessing) {
    return (
      <div className="bs-consumer__subscription__commitment_period__confirmation-dialog__content">
        <CircularProgress size="sm" />
        <div className="bs-consumer__subscription__modal-dialog__content__commitment-period">
          <Typography align="center" variant="body-lg">
            {t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.loading',
            )}
          </Typography>
        </div>
      </div>
    );
  }

  if (hasSucceeded) {
    return (
      <div className="bs-consumer__subscription__commitment_period__confirmation-dialog__content">
        <BigIcon variant="success" />
        <div className="bs-consumer__subscription__modal-dialog__content__commitment-period">
          <Typography align="center" variant="title-sm">
            {t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.modal.confirmationTitle',
            )}
          </Typography>
          <Typography align="center" variant="body-lg">
            {hasSubscriptionStarted && !!subscriptionForecastedExpirationDate
              ? t(
                  'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.modal.confirmationStarted',
                  {
                    expiration_date: formatAsDate(
                      subscriptionForecastedExpirationDate,
                    ),
                  },
                )
              : t(
                  'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.modal.confirmationNotStarted',
                )}
          </Typography>
        </div>
      </div>
    );
  }

  if (hasFailed) {
    return (
      <div className="bs-consumer__subscription__commitment_period__confirmation-dialog__content">
        <BigIcon variant="warning" />
        <div className="bs-consumer__subscription__modal-dialog__content__commitment-period">
          <Typography align="center" variant="title-sm">
            {t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.modal.failedTitle',
            )}
          </Typography>
          <Typography align="center" variant="body-lg">
            {t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.modal.failedMessage',
            )}
          </Typography>
        </div>
      </div>
    );
  }

  let commitmentPeriodText: string = '';

  if (hasSubscriptionStarted) {
    if (!!subscriptionForecastedExpirationDate) {
      commitmentPeriodText = t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.modal.explainStarted',
        {
          expiration_date: formatAsDate(subscriptionForecastedExpirationDate),
        },
      );
    } else {
      commitmentPeriodText = t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.modal.explainNoExpirationDate',
      );
    }
  } else {
    commitmentPeriodText = t(
      'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.modal.explainNotStarted',
    );
  }

  return (
    <div className="bs-consumer__subscription__modal-dialog__content__commitment-period">
      <Typography align="left" variant="body-lg">
        {commitmentPeriodText}
      </Typography>
      <Alert
        key="commitment-period-alert"
        className={clsx(
          'bs-consumer__subscription__modal-dialog__content__commitment-period__alert',
          {
            'bs-consumer__subscription__modal-dialog__content__commitment-period__alert--hidden':
              !hasSubscriptionStarted,
          },
        )}
        color="warning"
        variant="weak"
      >
        {t(
          'reworked.mySubscriptions.consumerSubscriptionCardDetails.commitmentPeriod.modal.alert',
        )}
      </Alert>
    </div>
  );
};

export default React.memo(ConsumerSubscriptionCommitmentPeriodContent);
