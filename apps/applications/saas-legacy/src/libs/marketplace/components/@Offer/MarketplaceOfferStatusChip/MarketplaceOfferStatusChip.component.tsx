import React from 'react';
import { useTranslation } from 'react-i18next';

import DoneAllIcon from '@material-ui/icons/DoneAll';
import CancelIcon from '@material-ui/icons/Cancel';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import UpdateIcon from '@material-ui/icons/Update';

import { getOfferStatus } from '#src/libs/marketplace/utils';
import PopOver from '#src/components/Popover';
import Chip from '#src/components/css-only/Chip';

import { MarketplaceOfferStatus, OfferREST } from '#src/libs/offer/types';
import { CompanyTheme } from '#src/libs/theme/types';

import { MetaActivity } from '#src/libs/meta-activity/types';

import './styles.css';
import { ImmutableObject } from 'seamless-immutable';

export type Props = {
  offer: OfferREST;
  isRegistered: boolean;
  showLabel?: boolean;
  metaActivity: MetaActivity | ImmutableObject<MetaActivity>;
  companyTheme: CompanyTheme;
};

const MarketplaceOfferStatusChip: React.FC<Props> = ({
  offer,
  isRegistered,
  showLabel,
  metaActivity,
  companyTheme,
}) => {
  const { t } = useTranslation('translation');

  const offerStatus = getOfferStatus(offer, metaActivity, isRegistered);

  if (!companyTheme?.hide_book_button) return null;

  switch (offerStatus) {
    case MarketplaceOfferStatus.BOOKED:
      return (
        <PopOver
          title={t('marketplace.bookButton.popOverTitle.alreadyRegistered')}
        >
          <Chip
            classes={{
              'bs-offer-status-chip': 'bs-offer-status-chip',
              '--booked': '--booked',
            }}
            icon={<DoneAllIcon fontSize="small" />}
            label={showLabel && t('marketplace.bookButton.alreadyRegistered')}
          />
        </PopOver>
      );
    case MarketplaceOfferStatus.CANCELLED:
      return (
        <PopOver title={t('marketplace.bookButton.popOverTitle.notAvailable')}>
          <Chip
            classes={{
              'bs-offer-status-chip': 'bs-offer-status-chip',
              '--cancelled': '--cancelled',
            }}
            icon={<CancelIcon fontSize="small" />}
            label={showLabel && t('marketplace.bookButton.notAvailable')}
          />
        </PopOver>
      );
    case MarketplaceOfferStatus.COMPLETED:
      return (
        <Chip
          classes={{
            'bs-offer-status-chip': 'bs-offer-status-chip',
            '--completed': '--completed',
          }}
          icon={<AlarmOnIcon fontSize="small" />}
          label={showLabel && t('marketplace.bookButton.isPast')}
        />
      );
    case MarketplaceOfferStatus.SOON:
      return (
        <PopOver
          title={t('marketplace.bookButton.popOverTitle.notBookableYet')}
        >
          <Chip
            classes={{
              'bs-offer-status-chip': 'bs-offer-status-chip',
              '--primary': '--primary',
            }}
            icon={<UpdateIcon fontSize="small" />}
            label={showLabel && t('marketplace.bookButton.notBookableYet')}
          />
        </PopOver>
      );
    case MarketplaceOfferStatus.WAITING_LIST:
      return (
        <PopOver title={t('marketplace.bookButton.popOverTitle.bookOption')}>
          <Chip
            classes={{
              'bs-offer-status-chip': 'bs-offer-status-chip',
              '--primary': '--primary',
            }}
            icon={<HourglassFullIcon fontSize="small" />}
            label={showLabel && t('marketplace.bookButton.bookOption')}
          />
        </PopOver>
      );
    default:
      return null;
  }
};

export default React.memo(MarketplaceOfferStatusChip);
