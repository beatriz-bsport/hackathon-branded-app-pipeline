import React from 'react';
import Chip from '#src/components/css-only/Chip';
import HourglassEmptyOutlined from '@material-ui/icons/HourglassEmptyOutlined';
import HourglassFullOutlined from '@material-ui/icons/HourglassFullOutlined';
import { useTranslation } from 'react-i18next';
import { OFFER_WAITING_LIST_STATUS_FULL } from '@bsport/common/master-data/error-codes/buyable-item-can-not-be-bought.js';

type Props = {
  classes?: { [key: string]: string | boolean };
  isRegisteredInWaitlist: boolean;
  isWaitlistFull: boolean;
  positionInWaitingList: number;
};

const WaitlistPositionChip: React.FC<Props> = ({
  classes,
  isRegisteredInWaitlist,
  isWaitlistFull,
  positionInWaitingList,
}) => {
  const { t } = useTranslation('booking');

  const getTextTranslationsPath = React.useCallback(() => {
    if (isWaitlistFull) {
      return t(
        `booking:offer.offerStatus.waiting_list_status.${OFFER_WAITING_LIST_STATUS_FULL}`,
      );
    }
    if (isRegisteredInWaitlist) {
      return t(
        `booking:offer.offerStatus.waiting_list_status.displayPosition`,
        {
          waitlistPosition: positionInWaitingList,
        },
      );
    }
    return t(
      `booking:offer.offerStatus.waiting_list_status.displayWaitlistSize`,
      {
        waitlistPosition: positionInWaitingList,
      },
    );
  }, [isWaitlistFull, isRegisteredInWaitlist, positionInWaitingList, t]);

  const waitlistText = getTextTranslationsPath();

  return (
    <Chip
      classes={{
        ...classes,
        'bs-booker-module-offer-summary-item__status-chips__waitlist': true,
        'bs-booker-module-offer-summary-item__status-chips__waitlist--full':
          isWaitlistFull,
      }}
      icon={
        isRegisteredInWaitlist ? (
          <HourglassFullOutlined fontSize="medium" />
        ) : (
          <HourglassEmptyOutlined fontSize="medium" />
        )
      }
      label={waitlistText}
    />
  );
};

export default React.memo(WaitlistPositionChip);
