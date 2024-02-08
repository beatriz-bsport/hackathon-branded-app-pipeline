import React from 'react';
import { useTranslation } from 'react-i18next';

import { getCurrencyDisplay } from '#libs/theme/selectors';
import { formatAsDatetimeAdapted } from '#utils/datetime';

import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Typography from '#Fabrique/Typography';
import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';

import type { ConsumerSubscriptionDetailsCardProps } from '..';
import type { SubscriptionsInvoicesDetailsREST } from '#libs/subscription/types';

type Props = Pick<
  ConsumerSubscriptionDetailsCardProps,
  | 'areDetailsLoading'
  | 'handleInvoiceDetailsPaginationFetchMore'
  | 'hasDetailsNextPage'
  | 'selectedSubscriptionInvoiceDetails'
>;

const ConsumerSubscriptionDetailsCardBillingHistory: React.FC<Props> = ({
  areDetailsLoading,
  selectedSubscriptionInvoiceDetails,
  handleInvoiceDetailsPaginationFetchMore,
  hasDetailsNextPage,
}) => {
  const { t } = useTranslation('consumerSpace');

  return (
    <ConsumerCardSection
      className="bs-consumer__subscription-details-card__description__section"
      title={t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.billingHistory',
      )}
    >
      <List>
        {selectedSubscriptionInvoiceDetails?.length && !areDetailsLoading ? (
          <GenericInfiniteScrollEnhancedCssOnly<
            Omit<SubscriptionsInvoicesDetailsREST, 'billing_plan_id'>
          >
            fetchMoreData={handleInvoiceDetailsPaginationFetchMore}
            items={selectedSubscriptionInvoiceDetails}
            hasMore={hasDetailsNextPage}
            // TO MODIFY ASAP
            height="240px"
            renderItem={({ item }) => (
              <ListItem
                captionText={`${(
                  parseFloat(item.amount_paid_cts) / 100
                ).toFixed(2)}${getCurrencyDisplay()}`}
                classes={{
                  label:
                    'bs-consumer__subscription-details-card__failed_payments__section__list-item__title',
                  captionText:
                    'bs-consumer__subscription-details-card__failed_payments__section__list-item__caption-text',
                }}
                className="bs-consumer__subscription-details-card__failed_payments__section__list-item"
                label={formatAsDatetimeAdapted(item.date, 'L')}
              />
            )}
          />
        ) : (
          <Typography variant="body-md">
            {t(
              'reworked.mySubscriptions.consumerSubscriptionCardDetails.emptyInvoices',
            )}
          </Typography>
        )}
      </List>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSubscriptionDetailsCardBillingHistory);
