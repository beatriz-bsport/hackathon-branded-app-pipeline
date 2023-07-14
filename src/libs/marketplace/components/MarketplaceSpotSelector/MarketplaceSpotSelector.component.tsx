import React, { useState } from 'react';
import './MarketplaceSpotSelector.css';
import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { TFunction } from 'i18next';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { OptionCallback } from '../../../../state/types';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import OfferSummary from '#libs/offer/OfferSummary';
import { OfferStatus, Offer_FULL } from '#libs/offer/types';
import { CompanyTheme } from '#libs/theme/types';
import {
  AssetForBlueprint,
  RoomBlueprint,
  SpotType,
} from '#libs/spot-scheduling/types';
import CanvasSpotIcon from '#libs/spot-scheduling/CanvasSvg/CanvasSpotIcon.component';
import ToolTip from '#components/Tooltip.component';
import { MARKETPLACE_BREAKPOINT } from '#libs/marketplace/constants';
import SpotSelector from '#libs/spot-scheduling/component/SpotSelector/SpotSelector.component';
import { DEFAULT_SPOT_TYPE_ID } from '#libs/spot-scheduling/utils';

type SpotLegendProps = {
  spotTypes: SpotType[];
  t: TFunction;
};

const SpotLegend: React.FC<SpotLegendProps> = (props) => {
  const { t } = props;
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
              <CanvasSpotIcon spotType={spotType} size={40} />
              <div className="bs-marketplace-spot-selector__legend__row-text">
                {availableLegend}
              </div>
            </div>
            <div className="bs-marketplace-spot-selector__legend__row">
              <CanvasSpotIcon spotType={spotType} size={40} taken />
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

  const onSelectSpot = (spot: number) => {
    props.fetchOfferStatus(props.offer.id);
    props.updateSpotForOffer(props.offer.id, spot);
  };

  const onSelectSpotAndCloseSelector = (spot: number) => {
    onSelectSpot(spot);
    props.closeSpotSelector();
  };

  const roomBlueprint = props.roomBlueprintsById[props.offer.room_blueprint];
  const assets = props.assetByIdBlueprintByIdentifier[roomBlueprint?.id];
  const offerStatus = props.offerStatusById[props.offer.id];

  const takenSpots = offerStatus?.taken_spots || [];

  const spotTypesIdOfBlueprint = roomBlueprint?.canvas.elements
    .filter((element) => element.type === 'spot')
    .map((element) => element.data.spotTypeId || DEFAULT_SPOT_TYPE_ID);

  const spotTypesOfBlueprint = props.spotTypes.filter((spotType) =>
    spotTypesIdOfBlueprint?.includes(spotType.id),
  );
  return (
    <>
      <div className="bs-marketplace-spot-selector__header">
        {/* @ts-expect-error */}
        <OfferSummary
          metaActivity={props.offer?.meta_activity}
          establishment={props.offer?.establishment}
          offer={props.offer}
          variant="basket"
          theme={props.theme}
        />
        {!isMobile && (
          <div className="bs-marketplace-spot-selector__legend">
            <div className="bs-marketplace-spot-selector__legend-text">
              {t('spotSelectorDialog.legend')}
            </div>
            <SpotLegend spotTypes={spotTypesOfBlueprint.slice(0, 2)} t={t} />

            {spotTypesOfBlueprint.length > 2 && (
              <ToolTip
                style={{ backgroundColor: 'white', color: 'white' }}
                title={
                  <SpotLegend spotTypes={spotTypesOfBlueprint.slice(2)} t={t} />
                }
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
          roomBlueprint={roomBlueprint}
          assets={assets}
          takenSpot={takenSpots}
          onSelectSpot={onSelectSpotAndCloseSelector}
          selectedSpot={props.selectedSpot}
          fetchSpotForBlueprint={props.fetchSpotForBlueprint}
          spotTypesOfBlueprint={spotTypesOfBlueprint}
          coach={props.offer?.coach_override ?? props.offer?.coach}
          isMobile={isMobile}
          condensed
        />
      ) : (
        <TransformWrapper
          initialScale={1}
          panning={{ disabled: isPanningDisabled }}
          onZoomStop={(ref) => {
            setIsPanningDisabled(ref.state.scale < 1);
          }}
        >
          <TransformComponent>
            <SpotSelector
              roomBlueprint={roomBlueprint}
              assets={assets}
              takenSpot={takenSpots}
              onSelectSpot={onSelectSpot}
              selectedSpot={props.selectedSpot}
              fetchSpotForBlueprint={props.fetchSpotForBlueprint}
              spotTypesOfBlueprint={spotTypesOfBlueprint}
              coach={props.offer?.coach_override ?? props.offer?.coach}
              isMobile={isMobile}
              condensed
            />
          </TransformComponent>
        </TransformWrapper>
      )}
      {isMobile && (
        <div className="bs-marketplace-spot-selector__legend">
          <div className="bs-marketplace-spot-selector__legend-text">
            {t('spotSelectorDialog.legend')}
          </div>
          <SpotLegend spotTypes={spotTypesOfBlueprint} t={t} />
        </div>
      )}
    </>
  );
};

export default compose<Props, Props>(marketplaceCssHoc())(
  MarketplaceSpotSelector,
);
