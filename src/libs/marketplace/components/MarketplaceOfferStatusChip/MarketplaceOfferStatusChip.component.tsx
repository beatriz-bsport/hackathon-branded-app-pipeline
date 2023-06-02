import React from 'react';
import { useTranslation } from 'react-i18next';

import DoneAllIcon from '@material-ui/icons/DoneAll';
import CancelIcon from '@material-ui/icons/Cancel';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import UpdateIcon from '@material-ui/icons/Update';

import './styles.css';

import { getOfferStatus } from '#libs/marketplace/utils';
import PopOver from '#components/Popover';
import Chip from '#components/css-only/Chip';

import { MarketplaceOfferStatus, Offer } from '#libs/offer/types';
import { CompanyTheme } from '#libs/theme/types';

import { MetaActivity } from '#libs/meta-activity/types';

export type Props = {
  offer: Offer;
  isRegistered: boolean;
  showLabel: boolean;
  metaActivity: MetaActivity;
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
            label={showLabel && t('marketplace.bookButton.alreadyRegistered')}
            icon={<DoneAllIcon fontSize="small" />}
            classes={{
              'bs-offer-status-chip': 'bs-offer-status-chip',
              '--booked': '--booked',
            }}
          />
        </PopOver>
      );
    case MarketplaceOfferStatus.CANCELLED:
      return (
        <PopOver title={t('marketplace.bookButton.popOverTitle.notAvailable')}>
          <Chip
            label={showLabel && t('marketplace.bookButton.notAvailable')}
            icon={<CancelIcon fontSize="small" />}
            classes={{
              'bs-offer-status-chip': 'bs-offer-status-chip',
              '--cancelled': '--cancelled',
            }}
          />
        </PopOver>
      );
    case MarketplaceOfferStatus.COMPLETED:
      return (
        <Chip
          label={showLabel && t('marketplace.bookButton.isPast')}
          icon={<AlarmOnIcon fontSize="small" />}
          classes={{
            'bs-offer-status-chip': 'bs-offer-status-chip',
            '--completed': '--completed',
          }}
        />
      );
    case MarketplaceOfferStatus.SOON:
      return (
        <PopOver
          title={t('marketplace.bookButton.popOverTitle.notBookableYet')}
        >
          <Chip
            label={showLabel && t('marketplace.bookButton.notBookableYet')}
            icon={<UpdateIcon fontSize="small" />}
            classes={{
              'bs-offer-status-chip': 'bs-offer-status-chip',
              '--primary': '--primary',
            }}
          />
        </PopOver>
      );
    case MarketplaceOfferStatus.WAITING_LIST:
      return (
        <PopOver title={t('marketplace.bookButton.popOverTitle.bookOption')}>
          <Chip
            label={showLabel && t('marketplace.bookButton.bookOption')}
            icon={<HourglassFullIcon fontSize="small" />}
            classes={{
              'bs-offer-status-chip': 'bs-offer-status-chip',
              '--primary': '--primary',
            }}
          />
        </PopOver>
      );
    default:
      return null;
  }
};

export default React.memo(MarketplaceOfferStatusChip);
