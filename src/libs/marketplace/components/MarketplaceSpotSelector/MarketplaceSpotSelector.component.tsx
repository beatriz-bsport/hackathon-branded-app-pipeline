import React, { useCallback, useMemo, useState } from 'react';
import './MarketplaceSpotSelector.css';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import type { OptionCallback } from '../../../../state/types';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import OfferSummary from '#libs/offer/OfferSummary';
import type { OfferStatus, Offer_FULL } from '#libs/offer/types';
import type { CompanyTheme } from '#libs/theme/types';
import type {
  AssetForBlueprint,
  RoomBlueprint,
  SpotType,
} from '#libs/spot-scheduling/types';
import CanvasSpotIcon from '#libs/spot-scheduling/CanvasSvg/CanvasSpotIcon.component';
import ToolTip from '#components/Tooltip.component';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
import SpotSelector from '#libs/spot-scheduling/component/SpotSelector/SpotSelector.component';
import { DEFAULT_SPOT_TYPE_ID } from '#libs/spot-scheduling/utils';
import { CanvasElement } from '#libs/spot-scheduling/CanvasSvg/tools/BaseClasses/Base.tool';

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
  offer: Offer_FULL;
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
};

const MarketplaceSpotSelector: React.FC<Props> = (props) => {
  const { t } = useTranslation('spotScheduling');
  const theme = useTheme();
  const isMobile = useMediaQuery(
    theme.breakpoints.down(MARKETPLACE_BREAKPOINT.SM),
  );
  const [isPanningDisabled, setIsPanningDisabled] = useState(true);

  const { offer, fetchOfferStatus, updateSpotForOffer, closeSpotSelector } =
    props;

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

  const roomBlueprint = props.roomBlueprintsById[props.offer.room_blueprint];
  const assets = props.assetByIdBlueprintByIdentifier[roomBlueprint?.id];
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

  const onZoomStop = useCallback((ref) => {
    setIsPanningDisabled(ref.state.scale < 1);
  }, []);

  return (
    <div className="bs-marketplace-spot-selector">
      <div className="bs-marketplace-spot-selector__header">
        {/* @ts-expect-error */}
        <OfferSummary
          establishment={props.offer?.establishment}
          metaActivity={props.offer?.meta_activity}
          offer={props.offer}
          theme={props.theme}
          variant="basket"
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
      {!isMobile ? (
        <SpotSelector
          isBoutiqueDisplay
          assets={assets}
          coach={props.offer?.coach_override ?? props.offer?.coach}
          fetchSpotForBlueprint={props.fetchSpotForBlueprint}
          isMobile={isMobile}
          onMouseOverSpot={onMouseOverSpot}
          onSelectSpot={onSelectSpotAndCloseSelector}
          roomBlueprint={roomBlueprint}
          selectedSpot={props.selectedSpot}
          spotTypesOfBlueprint={spotTypesOfBlueprint}
          takenSpot={takenSpots}
        />
      ) : (
        <TransformWrapper
          initialScale={1}
          minScale={1}
          onZoomStop={onZoomStop}
          panning={{ disabled: isPanningDisabled }}
        >
          <TransformComponent>
            <SpotSelector
              isBoutiqueDisplay
              assets={assets}
              coach={props.offer?.coach_override ?? props.offer?.coach}
              fetchSpotForBlueprint={props.fetchSpotForBlueprint}
              isMobile={isMobile}
              onSelectSpot={onSelectSpot}
              roomBlueprint={roomBlueprint}
              selectedSpot={props.selectedSpot}
              spotTypesOfBlueprint={spotTypesOfBlueprint}
              takenSpot={takenSpots}
            />
          </TransformComponent>
        </TransformWrapper>
      )}
      {isMobile && (
        <div className="bs-marketplace-spot-selector__legend">
          <div className="bs-marketplace-spot-selector__legend-text">
            {t('spotSelector.legend')}
          </div>
          <SpotLegend spotTypes={spotTypesOfBlueprint} />
        </div>
      )}
    </div>
  );
};

export default compose<Props, Props>(
  marketplaceCssHoc(),
  React.memo,
)(MarketplaceSpotSelector);
