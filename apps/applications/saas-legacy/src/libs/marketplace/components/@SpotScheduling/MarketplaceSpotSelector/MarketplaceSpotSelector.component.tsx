import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { DateTime } from 'luxon';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useMediaQuery, useTheme } from '@material-ui/core';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import {
  OfferREST,
  type OfferStatus,
  type Offer_FULL,
} from '#src/libs/offer/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { Establishment } from '#src/libs/establishment/types';
import type {
  AssetForBlueprint,
  RoomBlueprint,
  SpotType,
} from '#src/libs/spot-scheduling/types';
import CanvasSpotIcon from '#src/libs/spot-scheduling/CanvasSvg/CanvasSpotIcon.component';
import ToolTip from '#src/components/Tooltip.component';
import { MARKETPLACE_BREAKPOINT } from '#src/libs/marketplace/constants';
import SpotSelector from '#src/libs/spot-scheduling/component/SpotSelector/SpotSelector.component';
import { DEFAULT_SPOT_TYPE_ID } from '#src/libs/spot-scheduling/utils';
import { CanvasElement } from '#src/libs/spot-scheduling/CanvasSvg/tools/BaseClasses/Base.tool';
import BookerModuleOfferSummary from '#src/libs/marketplace/components/@Offer/BookerModuleOfferSummary';
import Countdown from '#src/components/time/CountDown.component';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { OptionCallback } from '../../../../../state/types';

import { trackSpotSchedulingViewedEvent } from '#src/events/booking/trackers';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';

import './styles.css';

const SPOT_LEGEND_ICON_SIZE = 40;

type SpotLegendProps = {
  spotTypes: SpotType[];
};

const SpotLegend: React.FC<SpotLegendProps> = (props) => {
  const { t } = useTranslation('spotScheduling');
  return (
    <>
      {props.spotTypes.map((spotType: SpotType) => {
        let availableLegend = t('spotSelector.available');

        let unavailableLegend = t('spotSelector.unavailable');

        if (props.spotTypes.length > 1) {
          availableLegend = t('spotSelector.availableSpot');
          unavailableLegend = t('spotSelector.unavailableSpot');
        }

        if (spotType?.name) {
          availableLegend = t('spotSelector.availablePersonalizedSpot', {
            spotName: spotType.name,
          });
          unavailableLegend = t('spotSelector.unavailablePersonalizedSpot', {
            spotName: spotType.name,
          });
        }

        return (
          <div key={`spot-type-${spotType.id}`}>
            <div className="bs-marketplace-spot-selector__legend__row">
              <CanvasSpotIcon
                size={SPOT_LEGEND_ICON_SIZE}
                spotType={spotType}
              />
              <div className="bs-marketplace-spot-selector__legend__row-text">
                {availableLegend}
              </div>
            </div>
            <div className="bs-marketplace-spot-selector__legend__row">
              <CanvasSpotIcon
                taken
                size={SPOT_LEGEND_ICON_SIZE}
                spotType={spotType}
              />
              <div className="bs-marketplace-spot-selector__legend__row-text">
                {unavailableLegend}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

type Props = {
  offer: Offer_FULL | OfferREST;
  theme: CompanyTheme;
  roomBlueprintsById: { [key: string]: RoomBlueprint };
  assetByIdBlueprintByIdentifier: {
    [key: string]: {
      [key: string]: AssetForBlueprint;
    };
  };
  updateSpotForOffer: (offer: number, index: number) => void;
  fetchOfferStatus: (offerId: number) => void;
  offerStatusById: {
    [key: string]: OfferStatus;
  };
  fetchSpotForBlueprint: (
    data: { company: number },
    options?: OptionCallback,
  ) => void;
  spotTypes: SpotType[];
  selectedSpot: number;
  closeSpotSelector: () => void;
  expirationDatetime?: string;
  spotCurrentlyInBasket?: string;
  goToCheckout?: () => void;
  forceCloseOnSelectForMobile?: boolean;
  /** optional props to avoid passing state/actions */
  offerRoomBlueprint?: RoomBlueprint;
  establishment?: Establishment;
  metaActivity?: MetaActivity;
  assetForBlueprint?: {
    [identifier: string]: AssetForBlueprint;
  };
};

const MarketplaceSpotSelector: React.FC<Props> = (props) => {
  const { t } = useTranslation('spotScheduling');
  const hasTrackedSpotSchedulingViewed = useRef(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
  );

  const { offer, fetchOfferStatus, updateSpotForOffer, closeSpotSelector } =
    props;

  const metaActivityToTrack =
    typeof props.offer.meta_activity === 'object' &&
    props.offer.meta_activity !== null
      ? props.offer.meta_activity
      : props.metaActivity;

  useEffect(() => {
    if (!hasTrackedSpotSchedulingViewed.current) {
      analyticsClientB2C.track(
        trackSpotSchedulingViewedEvent({
          activity_id: props.offer.activity,
          activity_name: metaActivityToTrack?.name || '',
          offer_id: props.offer.id,
        }),
      );
      hasTrackedSpotSchedulingViewed.current = true;
    }
  }, [props.offer, metaActivityToTrack]);

  const onSelectSpot = useCallback(
    (spot: number) => {
      fetchOfferStatus(offer.id);
      updateSpotForOffer(offer.id, spot);
    },
    [offer, fetchOfferStatus, updateSpotForOffer],
  );

  const onMouseOverSpot = useCallback(
    (spot: CanvasElement<any>) => {
      updateSpotForOffer(offer.id, spot.data.index);
    },
    [offer, updateSpotForOffer],
  );

  const onSelectSpotAndCloseSelector = useCallback(
    (spot: number) => {
      onSelectSpot(spot);
      closeSpotSelector();
    },
    [onSelectSpot, closeSpotSelector],
  );

  const roomBlueprint =
    props.offerRoomBlueprint ||
    props.roomBlueprintsById[props.offer.room_blueprint];
  const assets =
    props.assetForBlueprint ||
    props.assetByIdBlueprintByIdentifier[roomBlueprint?.id];
  const offerStatus = props.offerStatusById[props.offer.id];

  const takenSpots = offerStatus?.taken_spots || [];

  const spotTypesIdOfBlueprint = roomBlueprint?.canvas.elements
    .filter((element) => element.type === 'spot')
    .map((element) => element.data.spotTypeId || DEFAULT_SPOT_TYPE_ID);

  const spotTypesOfBlueprint = useMemo(
    () =>
      props.spotTypes.filter((spotType) =>
        spotTypesIdOfBlueprint?.includes(spotType.id),
      ),
    [props.spotTypes, spotTypesIdOfBlueprint],
  );
  const firstSpotTypes = spotTypesOfBlueprint.slice(0, 2);

  const lastSpotTypes = spotTypesOfBlueprint.slice(2);

  return (
    <div className="bs-marketplace-spot-selector">
      <div className="bs-marketplace-spot-selector__header">
        <BookerModuleOfferSummary
          fromSpotSelector
          noStyledContainer
          companyTheme={props.theme}
          // @ts-expect-error
          establishment={props.establishment || props.offer?.establishment}
          expirationDatetime={props.expirationDatetime}
          goToCheckout={props.goToCheckout}
          // @ts-expect-error
          metaActivity={props.metaActivity || props.offer?.meta_activity}
          offer={props.offer}
          spotId={props.spotCurrentlyInBasket}
        />

        {!isMobile && (
          <div className="bs-marketplace-spot-selector__legend">
            <div className="bs-marketplace-spot-selector__legend-text">
              {t('spotSelector.legend')}
            </div>
            <SpotLegend spotTypes={firstSpotTypes} />

            {spotTypesOfBlueprint.length > 2 && (
              <ToolTip
                style={{ backgroundColor: 'white', color: 'white' }}
                title={<SpotLegend spotTypes={lastSpotTypes} />}
              >
                <div className="bs-marketplace-spot-selector__legend__row">
                  <VisibilityIcon className="bs-marketplace-spot-selector__legend__icon" />
                  <div className="bs-marketplace-spot-selector__legend__icon-text">
                    {t('spotSelector.seeAll')}
                  </div>
                </div>
              </ToolTip>
            )}
          </div>
        )}
      </div>

      {!!props.expirationDatetime && (
        <Countdown
          timestamp={DateTime.fromISO(props.expirationDatetime).toUnixInteger()}
        >
          {(countdown: string) => {
            if (countdown)
              return (
                <div className="bs-marketplace-spot-selector__select-other-spot">
                  <div className="bs-marketplace-spot-selector__select-other-spot__title">
                    {t('spotSelector.selectOtherSpot.title')}
                  </div>
                  <div className="bs-marketplace-spot-selector__select-other-spot__message">
                    {t('spotSelector.selectOtherSpot.message')}
                  </div>
                </div>
              );
            return null;
          }}
        </Countdown>
      )}

      <SpotSelector
        isBoutiqueDisplay
        assets={assets}
        coach={props.offer?.coach_override ?? props.offer?.coach}
        coachDisplay={props.theme?.coach_display}
        fetchSpotForBlueprint={props.fetchSpotForBlueprint}
        isMobile={isMobile}
        onMouseOverSpot={onMouseOverSpot}
        onSelectSpot={
          isMobile && !props.forceCloseOnSelectForMobile
            ? onSelectSpot
            : onSelectSpotAndCloseSelector
        }
        roomBlueprint={roomBlueprint}
        selectedSpot={props.selectedSpot}
        spotTypesOfBlueprint={spotTypesOfBlueprint}
        takenSpot={takenSpots}
      />
      {isMobile && (
        <div
          className={clsx(
            'bs-marketplace-spot-selector__legend',
            'bs-marketplace-spot-selector__legend--mobile',
          )}
        >
          <div className="bs-marketplace-spot-selector__legend-text">
            {t('spotSelector.legend')}
          </div>
          <SpotLegend spotTypes={spotTypesOfBlueprint} />
        </div>
      )}
    </div>
  );
};

export const MarketplaceSpotSelectorForStorybook = marketplaceCssHoc()(
  MarketplaceSpotSelector,
);

export default React.memo(MarketplaceSpotSelector);
