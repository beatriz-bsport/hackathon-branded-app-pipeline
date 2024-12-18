import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, LinearProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';

// @ts-expect-error
import OfferMinimalSummary from '#src/components/offer/OfferMinimalSummary.component';

import type { Coach } from '#src/libs/associated-coach/types';
import type { OfferSaas } from '#src/libs/offer/types';

type Props = {
  coaches: Coach[];
  currentPage: number;
  isLoading: boolean;
  offers: OfferSaas[];
  totalOffers: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onOfferClick: (offerId: number) => void;
};

const WellhubProductSelectionOfferList: React.FC<Props> = ({
  coaches,
  currentPage,
  isLoading,
  offers,
  totalOffers,
  totalPages,
  onChangePage,
  onOfferClick,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();

  // Note: We need to handle this as typing is currently quite messy for offers...
  const offersWithAssociatedCoach = React.useMemo(
    () =>
      offers.map((offer) => ({
        ...offer,
        coach:
          coaches.find((coach) => offer.coach && coach.id === offer.coach.id) ||
          offer.coach,
        coach_override:
          coaches.find(
            (coach) =>
              offer.coach_override && coach.id === offer.coach_override.id,
          ) || offer.coach_override,
      })),
    [coaches, offers],
  );

  const handleOnChange = useCallback(
    (_: React.ChangeEvent<unknown>, newPage: number) => onChangePage?.(newPage),
    [onChangePage],
  );

  const handleOnOfferClick = useCallback(
    (offerId: number) => () => onOfferClick(offerId),
    [onOfferClick],
  );

  return (
    <div className={classes.container}>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <div>
          {offersWithAssociatedCoach.map((offer) => (
            <OfferMinimalSummary
              key={offer.id}
              fixedHeight
              hideFillingInfo
              withoutPadding
              offer={offer}
              overrideClickAction={handleOnOfferClick(offer.id)}
            />
          ))}
        </div>
      )}
      <div className={classes.footer}>
        <Pagination
          count={totalPages}
          onChange={handleOnChange}
          page={currentPage}
          size="small"
        />
        <Typography color="textSecondary" variant="caption">
          {t('wellhub.productSelection.drawer.element', { count: totalOffers })}
        </Typography>
      </div>
      <Divider />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  footer: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: theme.spacing(1),
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
  },
}));

export default React.memo(WellhubProductSelectionOfferList);
