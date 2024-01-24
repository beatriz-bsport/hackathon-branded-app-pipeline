import React from 'react';

import ConsumerSubscriptionCard from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionCard';
import ConsumerSubscriptionDetailsCard from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionDetailsCard';
import Typography from '#Fabrique/Typography';

import { GenericInfiniteScrollEnhancedCssOnly } from '#components/InfiniteScroll/GenericInfiniteScrollCssOnly.component';
import { formatAsDatetimeAdapted } from '../../../../../../utils/datetime';

import type { SubscriptionREST } from '#libs/subscription/types';
import type { SubscriptionTab } from '#libs/consumer-space/components/reworked/@MySubscriptions/types';
import {
  MY_BOOKINGS_LIST_CONTAINER_HEIGHT,
  MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT,
} from '#libs/consumer-space/components/reworked/@MyBookings/constants';
import './styles.css';

type Props = {
  handlePaginationFetchMore: () => void;
  handleSetSelectedSubscriptions: (subscriptionId: number) => void;
  hasNextPage: boolean;
  isLoading: boolean;
  isMobile: boolean;
  onSeeTermsClick: () => void;
  selectedSubscription: SubscriptionREST;
  selectedTab: SubscriptionTab;
  subscriptionsList: SubscriptionREST[];
};

export const ConsumerSubscriptionsListContainer: React.FC<Props> = ({
  handlePaginationFetchMore,
  handleSetSelectedSubscriptions,
  hasNextPage,
  isLoading,
  isMobile,
  onSeeTermsClick,
  selectedSubscription,
  selectedTab,
  subscriptionsList,
}) => {
  // TODO: placeholder and loading logic to improve
  const showEmptyPlaceholder = !isLoading && subscriptionsList?.length === 0;
  const onCardDetailsClick = React.useCallback(
    (id: number) => () => handleSetSelectedSubscriptions(id),
    [handleSetSelectedSubscriptions],
  );

  return (
    <div className="bs-consumer-page-root__subscription">
      {showEmptyPlaceholder && (
        <Typography variant="body-lg">{selectedTab}</Typography>
      )}

      <ul className="bs-consumer-page-root__subscriptions_list">
        <GenericInfiniteScrollEnhancedCssOnly<SubscriptionREST>
          fetchMoreData={handlePaginationFetchMore}
          hasMore={hasNextPage}
          // TODO: height needs to be set to trigger fetchMoreData..
          // @ts-expect-error
          height={
            isMobile
              ? MY_BOOKINGS_MOBILE_LIST_CONTAINER_HEIGHT
              : MY_BOOKINGS_LIST_CONTAINER_HEIGHT
          }
          items={subscriptionsList}
          // TODO: see if i need to add a ConsumerSubscriptionCardListItem with integration
          // @ts-expect-error
          loader={<ConsumerSubscriptionCard isLoading />}
          renderItem={({ item }) => (
            <ConsumerSubscriptionCard
              key={item.id}
              // TODO
              isDetailsDisabled={false}
              isLoading={isLoading}
              isSelected={item.id === selectedSubscription?.id}
              onDetailsClick={onCardDetailsClick(item.id)}
              price={item?.recurrent_price}
              recurrence={item?.recurrence_basis}
              subscriptionDate={formatAsDatetimeAdapted(
                item?.first_billing_date,
                'LL',
              )}
              subscriptionInterval={item?.interval}
              subscriptionName={item?.name_without_member_name}
            />
          )}
        />
      </ul>
      <ConsumerSubscriptionDetailsCard
        description={selectedSubscription?.description}
        isLoading={isLoading}
        onSeeClick={onSeeTermsClick}
        price={selectedSubscription?.recurrent_price}
        recurrence={selectedSubscription?.recurrence_basis}
        showPlaceholder={!selectedSubscription}
        subscriptionInterval={selectedSubscription?.interval}
        subscriptionName={selectedSubscription?.name_without_member_name}
        subscriptionNextPaymentDate={formatAsDatetimeAdapted(
          selectedSubscription?.next_billing_date,
          'LL',
        )}
        subtitleDate={formatAsDatetimeAdapted(
          selectedSubscription?.first_billing_date,
          'LL',
        )}
        termsDate={formatAsDatetimeAdapted(
          selectedSubscription?.contract_terms_date_accepted,
          'LL',
        )}
      />
    </div>
  );
};

export default React.memo(ConsumerSubscriptionsListContainer);
