import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Blanket from '#Fabrique/Blanket';
import ModalDialog from '#Fabrique/ModalDialog';
import MarketplaceSpotSelector from '#marketplacecomponents/@SpotScheduling/MarketplaceSpotSelector';

import type {
  RoomBlueprint,
  SpotInformation,
  SpotType,
} from '#libs/spot-scheduling/types';
import type { CompanyTheme } from '#libs/theme/types';
import type { OfferREST } from '#libs/offer/types';
import type { Establishment } from '#libs/establishment/types';
import type { MetaActivity } from '#libs/meta-activity/types';

import './styles.css';

const DEFAULT_SPOT_TYPE = { id: -1 };

type Props = {
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
  onClose: () => void;
};

const ConsumerBookingSpotSchedulingModal: React.FC<Props> = ({
  bookingSpotDetails,
  spotTypes,
  companyTheme,
  bookingOffer,
  onClose,
}) => {
  const { t } = useTranslation(['consumerSpace', 'common']);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const emptyFn = () => {};

  return (
    <Blanket
      isOpen
      className="bs-consumer-booking-spot-scheduling-modal__blanket"
      onClick={onClose}
    >
      <ModalDialog
        cancelLabel={t('common:back')}
        className="bs-consumer-booking-spot-scheduling-modal__dialog"
        onCancel={onClose}
        onClose={onClose}
        size="lg"
        subtitle={t(
          'consumerSpace:reworked.myBookings.spotSchedulingModal.subtitle',
        )}
        title={t('consumerSpace:reworked.myBookings.spotSchedulingModal.title')}
      >
        <div ref={canvasContainerRef}>
          <MarketplaceSpotSelector
            assetByIdBlueprintByIdentifier={{}}
            closeSpotSelector={emptyFn}
            establishment={bookingSpotDetails.establishment}
            expirationDatetime=""
            fetchOfferStatus={emptyFn}
            fetchSpotForBlueprint={emptyFn}
            goToCheckout={emptyFn}
            metaActivity={bookingSpotDetails.metaActivity}
            offer={bookingOffer}
            offerRoomBlueprint={bookingSpotDetails.roomBlueprint}
            offerStatusById={{}}
            roomBlueprintsById={{}}
            selectedSpot={bookingSpotDetails.spotInformation.indexType}
            spotTypes={[DEFAULT_SPOT_TYPE as SpotType].concat(spotTypes)}
            theme={companyTheme}
            updateSpotForOffer={emptyFn}
          />
        </div>
      </ModalDialog>
    </Blanket>
  );
};
export default React.memo(ConsumerBookingSpotSchedulingModal);
