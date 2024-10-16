import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CellMeasurerCache } from 'react-virtualized';

import ConsumerPassCard from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import PrivateConsumerPassDetailsCard from '#src/libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/PrivateConsumerPassDetailsCard';
import PageInnerContentLayout from '#src/libs/consumer-space/components/reworked/@Layout/PageInnerContentLayout';
import ConsumerSpaceVirtualizedList from '#src/libs/consumer-space/components/reworked/@Layout/ConsumerSpaceVirtualizedList';

import { parsePrivateConsumerPassData } from '#src/libs/consumer-space/components/reworked/@MyPasses/PrivateConsumerPass/utils';
import { getExpirationDate } from '#src/libs/private-service/utils';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';

import type { PrivateConsumerPassReworked } from '#src/libs/private-service/types';
import type { PassFilterTab } from '#src/libs/consumer-space/components/reworked/@MyPasses/types';

// Common stylesheet
import '#src/libs/consumer-space/components/reworked/@MyPasses/GenericPass/ListContainer/styles.css';

type Props = {
  handleChangePage: (page: number) => void;
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  isMobile?: boolean;
  onPassCardClick: (passId: number) => void;
  passList: PrivateConsumerPassReworked[];
  selectedFilterTab: PassFilterTab;
  selectedPass?: PrivateConsumerPassReworked;
  cache: CellMeasurerCache;
  currentPage: number;
  currentCount: number;
};

type ConsumerPassListContainerRowProps = {
  selectedPassId?: number;
  handleSeeDetails: (id: number) => () => void;
  item: PrivateConsumerPassReworked;
};

const PrivateConsumerPassListContainerRow: React.FC<
  ConsumerPassListContainerRowProps
> = ({ selectedPassId, handleSeeDetails, item }) => {
  return (
    <ConsumerPassCard
      creditsLeft={getCreditsDividedDisplay(
        item?.private_pass?.credits - item?.used_credits,
      )}
      expirationDate={item ? getExpirationDate(item) : null}
      handleSeeDetails={handleSeeDetails(item.id)}
      isMultistudio={null}
      isSelected={item.id === selectedPassId}
      isShared={
        !!item?.dst_private_consumer_pass ||
        !!item?.src_private_consumer_pass?.length
      }
      isSuspended={item.disabled}
      isUnlimited={!item?.private_pass?.credits}
      passName={item?.private_pass?.name}
      startDate={item?.date_bought}
      totalCredits={getCreditsDividedDisplay(item?.private_pass?.credits)}
    />
  );
};

export const ConsumerPassListContainer: React.FC<Props> = ({
  isLoading,
  isMetadataLoading,
  isMobile,
  passList,
  selectedPass,
  onPassCardClick,
  handleChangePage,
  selectedFilterTab,
  cache,
  currentPage,
  currentCount,
}) => {
  const {
    appointmentCompatibilities,
    creditsLeft,
    description,
    expirationDate,
    isCompatibleWithVod,
    isSuspended,
    isUnlimited,
    name,
    sharedBy,
    sharedWith,
    startDate,
    totalCredits,
  } = parsePrivateConsumerPassData(selectedPass);

  const { t } = useTranslation('consumerSpace');

  const isCurrentTabContentEmpty = !isLoading && !passList?.length;

  const handleSeeDetails = useCallback(
    (id: number) => () => onPassCardClick(id),
    [onPassCardClick],
  );

  return (
    <PageInnerContentLayout
      count={currentCount}
      DetailComponent={
        <PrivateConsumerPassDetailsCard
          appointmentCompatibilities={appointmentCompatibilities}
          // TODO: Out of scope, needs product specs
          className={
            (isMobile || isCurrentTabContentEmpty) &&
            'bs-private-consumer-pass-details-card__root--hidden'
          }
          compatibleEstablishments={null}
          creditsLeft={creditsLeft}
          description={description}
          expirationDate={expirationDate}
          isCompatibleWithVod={isCompatibleWithVod}
          isLoading={isLoading || isMetadataLoading}
          isMobile={isMobile}
          isSuspended={isSuspended}
          isUnlimited={isUnlimited}
          name={name}
          sharedBy={sharedBy}
          sharedWith={sharedWith}
          showPlaceholder={!selectedPass}
          startDate={startDate}
          totalCredits={totalCredits}
        />
      }
      emptyPlaceholder={t(
        `consumerSpace:reworked.myBookings.listContainer.placeholder.pass.${selectedFilterTab}`,
      )}
      isEmpty={isCurrentTabContentEmpty}
      isLoading={isLoading || isMetadataLoading}
      onPageChange={handleChangePage}
      page={currentPage}
      VirtualizedListComponent={
        <ConsumerSpaceVirtualizedList<PrivateConsumerPassReworked>
          cache={cache}
          data={passList}
          isLoading={isLoading || isMetadataLoading}
          rowCount={passList?.length ?? 0}
          rowRenderer={({ item }) => (
            <PrivateConsumerPassListContainerRow
              handleSeeDetails={handleSeeDetails}
              item={item}
              selectedPassId={selectedPass?.id}
            />
          )}
        />
      }
    />
  );
};

export default React.memo(ConsumerPassListContainer);
