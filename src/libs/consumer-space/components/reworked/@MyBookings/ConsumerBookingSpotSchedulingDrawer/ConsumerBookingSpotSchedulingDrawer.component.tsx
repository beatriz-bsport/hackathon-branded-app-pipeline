import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import BottomDrawer from '#Fabrique/BottomDrawer';
import MarketplaceSpotSelector from '#src/libs/marketplace/components/@SpotScheduling/MarketplaceSpotSelector';

import type {
  RoomBlueprint,
  SpotInformation,
  SpotType,
} from '#src/libs/spot-scheduling/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { OfferREST } from '#src/libs/offer/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';

const DEFAULT_SPOT_TYPE = { id: -1 };

type Props = {
  isOpen: boolean;
  bookingSpotDetails: {
    /** The spot informations related to the booking */
    spotInformation: SpotInformation;
    /** The room blueprint related to the booking's offer */
    roomBlueprint: RoomBlueprint;
    /** The establishment related to the booking */
    establishment: Establishment;
    /** The establishment related to the booking */
    metaActivity: MetaActivity;
  };
  spotTypes: SpotType[];
  companyTheme: CompanyTheme;
  bookingOffer: OfferREST;
  /** Handler function fired when clicking on blanket or back button */
  handleClose: () => void;
};

const ConsumerBookingSpotSchedulingDrawer: React.FC<Props> = ({
  isOpen,
  bookingSpotDetails,
  spotTypes,
  companyTheme,
  bookingOffer,
  handleClose,
}) => {
  const { t } = useTranslation('consumerSpace');
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const emptyFn = () => {};

  return (
    <BottomDrawer
      blanketProps={{ isOpen, onClick: handleClose }}
      className="bs-consumer-booking-spot-scheduling-drawer__root"
      modalDialogProps={{
        title: t('reworked.myBookings.spotSchedulingModal.title'),
        subtitle: t('reworked.myBookings.spotSchedulingModal.subtitle'),
        onClose: handleClose,
        onCancel: handleClose,
      }}
    >
      {isOpen && !!bookingSpotDetails && !!companyTheme && (
        <div ref={canvasContainerRef}>
          <MarketplaceSpotSelector
            assetByIdBlueprintByIdentifier={{}}
            closeSpotSelector={emptyFn}
            establishment={bookingSpotDetails?.establishment}
            expirationDatetime=""
            fetchOfferStatus={emptyFn}
            fetchSpotForBlueprint={emptyFn}
            goToCheckout={emptyFn}
            metaActivity={bookingSpotDetails?.metaActivity}
            offer={bookingOffer}
            offerRoomBlueprint={bookingSpotDetails?.roomBlueprint}
            offerStatusById={{}}
            roomBlueprintsById={{}}
            selectedSpot={bookingSpotDetails?.spotInformation?.indexType}
            spotTypes={[DEFAULT_SPOT_TYPE as SpotType].concat(spotTypes)}
            theme={companyTheme}
            updateSpotForOffer={emptyFn}
          />
        </div>
      )}
    </BottomDrawer>
  );
};

export default React.memo(ConsumerBookingSpotSchedulingDrawer);
