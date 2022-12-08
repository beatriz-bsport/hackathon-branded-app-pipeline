import React, { useCallback, useMemo } from 'react';
import {
  CircularProgress,
  Grid,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

import {
  formatAsDate,
  formatAsTime,
  formatMinutes,
} from '../../../utils/datetime';
import { Coach } from '#libs/associated-coach/types';
import { Offer } from '#libs/offer/types';
import { SIMILAR_OFFERS_PAGE_SIZE } from '#libs/offer/constants';

type Props = {
  similarOffers: Offer[];
  similarOfferLoading: boolean;
  similarOffersCount: number;
  similarOffersPage: number;
  coaches: Coach[];
  handlePageChange: (
    event: React.ChangeEvent<unknown>,
    page_number: number,
  ) => void;
};

const SimilarOffersList = (props: Props) => {
  const {
    similarOffers,
    similarOfferLoading,
    similarOffersCount,
    similarOffersPage,
    coaches,
    handlePageChange,
  } = props;
  const { t } = useTranslation();
  const classes = useStyles(props);

  const coachName = useMemo(() => {
    const namesByCoachId: { [key: number]: string } = coaches?.length
      ? coaches.reduce((acc, coach) => {
          return { ...acc, [coach.id]: coach.name };
        }, {})
      : {};
    return namesByCoachId;
  }, [coaches]);

  const getOfferTimeAndDuration = useCallback(
    (offer: Offer) => {
      const offerTime = formatAsTime(offer.date_start, offer.timezone_name);
      const offerDuration = formatMinutes(offer.duration_minute, t);

      return `${offerTime} - ${offerDuration}`;
    },
    [t],
  );

  const pageCount = Math.ceil(similarOffersCount / SIMILAR_OFFERS_PAGE_SIZE);
  const offersListStyle = similarOfferLoading
    ? classes.offersListLoading
    : classes.offersList;

  return (
    <>
      {similarOfferLoading && (
        <CircularProgress className={classes.loadingIndicator} />
      )}

      {!!similarOffers.length && (
        <>
          <ul className={offersListStyle}>
            {similarOffers.map((offer) => {
              return (
                <ListItem className={classes.offerItem} key={offer.id}>
                  <Grid container justifyContent="space-between">
                    <Grid item xs={5}>
                      <ListItemText
                        primary={coachName[offer.coach] ?? t('common.nothing')}
                        secondary={formatAsDate(offer.date_start)}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <ListItemText
                        primary="Professeur remplaçant"
                        secondary={
                          coachName[offer.coach_override] ?? t('common.nothing')
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        secondary={getOfferTimeAndDuration(offer)}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
          </ul>

          <div className={classes.paginationIndicator}>
            <Pagination
              disabled={similarOfferLoading}
              count={pageCount}
              page={similarOffersPage}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => {
  const offersList = {
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: 4,
    marginTop: theme.spacing(2),
    padding: 0,
  };

  return {
    loadingIndicator: {
      marginTop: theme.spacing(2),
    },
    offerItem: {
      borderLeft: `3px solid ${theme.palette.primary.main}`,
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    },
    paginationIndicator: {
      display: 'flex',
      justifyContent: 'center',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    offersList,
    offersListLoading: {
      ...offersList,
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  };
});

export default SimilarOffersList;
