import React, { memo, useCallback } from 'react';

import type { CallHistoryMethodAction } from 'connected-react-router';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import type { Offer } from '#src/libs/offer/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { OffersGroup } from '#src/libs/group-offer/types';
import type { Level } from '#src/libs/level/types';
import OfferCardStatistics from '#src/libs/offer/components/OfferCardStatistics.component';
import OfferDetail from '#src/components/offer/OfferDetail.component';

type Props = {
  offer: Offer<
    Coach,
    Establishment,
    number,
    number,
    number,
    OffersGroup,
    Level
  > & { customLevel: Level };
  goToOfferPage?: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
  showOfferGender: boolean;
};

const InboxPanelOffer: React.FC<Props> = ({
  offer,
  goToOfferPage,
  showOfferGender,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('communication');

  // @ts-expect-error
  const numberOfBookings = offer.nb_bookings || offer.bookings?.length;

  const handleClickOfferRedirection = useCallback(
    () => goToOfferPage(offer?.id),
    [goToOfferPage, offer],
  );

  return (
    <div className={classes.container}>
      <OfferCardStatistics
        effectif={offer.effectif}
        female={offer.female}
        male={offer.male}
        nbOptions={offer.nb_option}
        numberOfBookings={numberOfBookings}
        other={offer.other}
        showOfferGender={showOfferGender}
        waitingListMaxSize={offer.waiting_list_max_size}
      />

      <div className={classes.offerDetailContainer}>
        <OfferDetail offer={offer} />
      </div>

      <div className={classes.sectionContainer}>
        <ButtonBase onClick={handleClickOfferRedirection}>
          <Typography color="primary">
            {t(
              `thread.panel.navigation.${ChatThreadKinds.Offer}`,
            ).toUpperCase()}
          </Typography>
          <ArrowForwardIcon className={classes.arrowIcon} color="primary" />
        </ButtonBase>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(4),
  },
  offerDetailContainer: {
    paddingTop: theme.spacing(4),
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: theme.spacing(4),
  },
  arrowIcon: {
    paddingLeft: theme.spacing(1),
  },
}));

export default memo(InboxPanelOffer);
