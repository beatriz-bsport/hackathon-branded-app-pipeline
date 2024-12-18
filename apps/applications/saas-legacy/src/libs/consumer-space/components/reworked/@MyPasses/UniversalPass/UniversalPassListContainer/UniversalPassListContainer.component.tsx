import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ConsumerPassCard from '#src/libs/consumer-space/components/reworked/@MyPasses/ConsumerPassCard';
import UniversalPassDetailsCard from '#src/libs/consumer-space/components/reworked/@MyPasses/UniversalPass/UniversalPassDetailsCard';
import PageInnerContentLayout from '#src/libs/consumer-space/components/reworked/@Layout/PageInnerContentLayout';
import ConsumerSpaceList from '#src/libs/consumer-space/components/reworked/@Layout/ConsumerSpaceList';

import useUniversalPassData from '#src/libs/consumer-space/hooks/universalPassData.hook';
import { getCreditsDividedDisplay } from '#src/libs/theme/utils';

import type { UniversalPassReworked } from '#src/libs/universal-pass/types';
import type { PassFilterTab } from '#src/libs/consumer-space/components/reworked/@MyPasses/types';

// Common stylesheet
import '#src/libs/consumer-space/components/reworked/@MyPasses/GenericPass/ListContainer/styles.css';

type Props = {
  handleChangePage: (page: number) => void;
  isLoading?: boolean;
  isMetadataLoading?: boolean;
  isMobile?: boolean;
  onPassCardClick: (passId: number) => void;
  passList: UniversalPassReworked[];
  selectedFilterTab: PassFilterTab;
  selectedPass?: UniversalPassReworked;
  currentPage: number;
  currentCount: number;
};

type UniversalPassListContainerRowProps = {
  selectedPassId?: number;
  handleSeeDetails: (id: number) => () => void;
  item: UniversalPassReworked;
};

const UniversalPassListContainerRow: React.FC<
  UniversalPassListContainerRowProps
> = ({ selectedPassId, handleSeeDetails, item }) => {
  return (
    <ConsumerPassCard
      creditsLeft={getCreditsDividedDisplay(
        item?.consumer_payment_pack?.available_credits,
      )}
      expirationDate={item?.consumer_payment_pack?.ending_date}
      handleSeeDetails={handleSeeDetails(item?.id)}
      isMultistudio={
        !!item?.consumer_payment_pack
          ?.created_from_payment_pack_template_instance
      }
      isSelected={item.id === selectedPassId}
      isShared={
        !!item?.consumer_payment_pack?.src_consumer_payment_pack?.length ||
        !!item?.consumer_payment_pack?.dst_consumer_payment_pack
      }
      isSuspended={item?.consumer_payment_pack?.disabled}
      isUnlimited={!item?.consumer_payment_pack?.payment_pack?.credits}
      passName={item?.consumer_payment_pack?.payment_pack?.name}
      startDate={item?.consumer_payment_pack?.starting_date}
      totalCredits={getCreditsDividedDisplay(
        item?.consumer_payment_pack?.payment_pack?.credits,
      )}
    />
  );
};
export const UniversalPassListContainer: React.FC<Props> = ({
  isLoading,
  isMetadataLoading,
  isMobile,
  passList,
  selectedPass,
  onPassCardClick,
  handleChangePage,
  selectedFilterTab,
  currentPage,
  currentCount,
}) => {
  const { t } = useTranslation('consumerSpace');

  const isCurrentTabContentEmpty = !isLoading && !passList?.length;
  const {
    activityCompatibilities,
    appointmentCompatibilities,
    creditsLeft,
    isCompatibleWithBookingForGuest,
    description,
    expirationDate,
    isSuspended,
    isUnlimited,
    name,
    sharedBy,
    sharedWith,
    startDate,
    timeSlots,
    totalCredits,
    isCompatibleWithVod,
  } = useUniversalPassData(selectedPass);

  const handleSeeDetails = useCallback(
    (id: number) => () => onPassCardClick(id),
    [onPassCardClick],
  );

  return (
    <PageInnerContentLayout
      count={currentCount}
      DetailComponent={
        <UniversalPassDetailsCard
          activityCompatibilities={activityCompatibilities}
          appointmentCompatibilities={appointmentCompatibilities}
          className={
            (isCurrentTabContentEmpty || isMobile) &&
            'bs-universal-pass-details-card__root--hidden'
          }
          // TODO: Out of scope, needs product specs
          compatibleEstablishments={null}
          creditsLeft={creditsLeft}
          description={description}
          expirationDate={expirationDate}
          isCompatibleWithBookingForGuest={isCompatibleWithBookingForGuest}
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
          timeSlots={timeSlots}
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
        <ConsumerSpaceList<UniversalPassReworked>
          data={passList}
          isLoading={isLoading || isMetadataLoading}
          rowRenderer={({ item }) => (
            <UniversalPassListContainerRow
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

export default React.memo(UniversalPassListContainer);
