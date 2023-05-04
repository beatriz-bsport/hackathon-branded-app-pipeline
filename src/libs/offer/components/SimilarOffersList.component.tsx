import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTheme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { useFormikContext } from 'formik';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import moment, { Moment } from 'moment-timezone';
import classNames from 'classnames';

import { formatAsDatetimeAdapted } from '../../../utils/datetime';

import { Coach } from '#libs/associated-coach/types';
import { SIMILAR_OFFERS_PAGE_SIZE } from '#libs/offer/constants';
import { Offer, OfferFormValues } from '#libs/offer/types';
import SimilarOffersListSkeleton from './SimilarOffersListSkeleton.component';

type Props = {
  similarOffers: Offer[];
  similarOffersLoading: boolean;
  coaches: Coach[];
  offerCoach?: Coach;
  offerId?: number;
  isCoachOverrideWarning?: boolean;
};

type OfferItemProps = {
  date: string;
  coachName: string;
  coachPicture?: string;
  isAlignItemsEnd?: boolean;
};

type SimilarOfferCheckboxProps = {
  similarOfferId: number;
  isDisabled?: boolean;
};

const OfferItem = React.memo((props: OfferItemProps) => {
  const classes = useStyles();
  const { date, coachName, coachPicture, isAlignItemsEnd } = props;

  return (
    <ListItemText
      className={classNames(classes.flexAuto, {
        [classes.alignItemsEnd]: isAlignItemsEnd,
      })}
      primary={
        <Typography variant="caption" className={classes.offerDate}>
          {date}
        </Typography>
      }
      secondary={
        <CardHeader
          className={classes.noPadding}
          avatar={
            <Avatar className={classes.avatarContainer} src={coachPicture} />
          }
          title={<Typography variant="caption">{coachName}</Typography>}
        />
      }
    />
  );
});

const SimilarOfferCheckbox = (props: SimilarOfferCheckboxProps) => {
  const classes = useStyles();
  const { values, setFieldValue } = useFormikContext<OfferFormValues>();
  const { selectedSimilarOffers } = values;
  const { similarOfferId, isDisabled } = props;

  const handleCheckSimilarOffer = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => {
      if (isChecked) {
        return setFieldValue('selectedSimilarOffers', [
          ...selectedSimilarOffers,
          similarOfferId,
        ]);
      }
      return setFieldValue(
        'selectedSimilarOffers',
        selectedSimilarOffers.filter((offer) => offer !== similarOfferId),
      );
    },
    [selectedSimilarOffers, setFieldValue, similarOfferId],
  );

  const getIsOfferChecked = useCallback(() => {
    return selectedSimilarOffers.includes(similarOfferId);
  }, [selectedSimilarOffers, similarOfferId]);

  return (
    <div className={classes.alignCenter}>
      <Checkbox
        checked={getIsOfferChecked()}
        onChange={handleCheckSimilarOffer}
        disabled={isDisabled}
      />
    </div>
  );
};

const SimilarOffersList = (props: Props) => {
  const {
    similarOffers,
    similarOffersLoading,
    coaches,
    offerCoach,
    offerId,
    isCoachOverrideWarning,
  } = props;
  const [similarOffersList, setSimilarOffersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { values } = useFormikContext<OfferFormValues>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { coachOverride, dateIntervalStart } = values;
  const classes = useStyles();

  useEffect(() => {
    if (similarOffers) {
      return setSimilarOffersList(
        similarOffers.slice(0, SIMILAR_OFFERS_PAGE_SIZE),
      );
    }
    return () => {
      setSimilarOffersList([]);
    };
  }, [similarOffers]);

  const pageCount = useMemo(() => {
    if (similarOffers?.length > 1) {
      return Math.ceil((similarOffers.length - 1) / SIMILAR_OFFERS_PAGE_SIZE);
    }
    return 1;
  }, [similarOffers?.length]);

  const getCoachName = useCallback(
    (coachId: number) => {
      if (coachId && coaches) {
        return coaches.find((coach) => coach.id === coachId)?.name;
      }
      return '';
    },
    [coaches],
  );

  const getCoachPhoto = useCallback(
    (coachId: number) => {
      if (coachId && coaches) {
        return coaches.find((coach) => coach.id === coachId)?.photo;
      }
      return '';
    },
    [coaches],
  );

  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, page: number) => {
      if (
        similarOffersList &&
        (page >= 1 || page <= similarOffersList?.length)
      ) {
        const a = similarOffers.slice(
          page * SIMILAR_OFFERS_PAGE_SIZE - SIMILAR_OFFERS_PAGE_SIZE,
          page * SIMILAR_OFFERS_PAGE_SIZE,
        );
        setSimilarOffersList(a);
        setCurrentPage(page);
      }
    },
    [similarOffers, similarOffersList],
  );

  const getInitialOfferDate = useCallback((date: string) => {
    return formatAsDatetimeAdapted(date, 'ddd D MMM YYYY LT');
  }, []);

  const getNewOfferDate = useCallback(
    (initialDate: string) => {
      let newDate: string | Moment = initialDate;
      if (initialDate !== moment(dateIntervalStart).format()) {
        newDate = moment(initialDate)
          .hours(moment(dateIntervalStart).hours())
          .minutes(moment(dateIntervalStart).minutes());
      }
      return formatAsDatetimeAdapted(newDate, 'ddd D MMM YYYY LT');
    },
    [dateIntervalStart],
  );

  return (
    <>
      {similarOffersLoading && <SimilarOffersListSkeleton />}

      {!!similarOffersList.length && (
        <>
          <List component="ul" className={classes.list}>
            {similarOffersList.map((similarOffer) => (
              <li
                className={classNames(classes.offerItem, {
                  [classes.disabled]: similarOffer.id === offerId,
                })}
                key={similarOffer.id}
              >
                {!isCoachOverrideWarning && (
                  <SimilarOfferCheckbox
                    similarOfferId={similarOffer.id}
                    isDisabled={similarOffer.id === offerId}
                  />
                )}

                <div className={classes.flexBetween}>
                  <OfferItem
                    date={getInitialOfferDate(similarOffer.date_start)}
                    coachName={
                      isCoachOverrideWarning
                        ? getCoachName(similarOffer.coach_override)
                        : getCoachName(offerCoach.id)
                    }
                    coachPicture={
                      isCoachOverrideWarning
                        ? getCoachPhoto(similarOffer.coach_override)
                        : getCoachPhoto(offerCoach.id)
                    }
                  />

                  {!isCoachOverrideWarning && !isMobile && (
                    <>
                      <ArrowForwardIcon className={classes.arrow} />

                      <OfferItem
                        date={getNewOfferDate(similarOffer.date_start)}
                        coachName={getCoachName(coachOverride)}
                        coachPicture={getCoachPhoto(coachOverride)}
                        isAlignItemsEnd
                      />
                    </>
                  )}
                </div>
              </li>
            ))}
          </List>

          <div className={classes.paginationIndicator}>
            <Pagination
              disabled={similarOffersLoading}
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  list: {
    padding: 0,
    paddingInlineStart: 0,
  },
  offerItem: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    paddingLeft: 0,
  },
  paginationIndicator: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  avatarContainer: {
    width: 20,
    height: 20,
  },
  avatarSpacing: {
    marginRight: theme.spacing(1),
  },
  noPadding: {
    padding: 0,
  },
  offerDate: {
    display: 'block',
    marginBottom: theme.spacing(0.5),
  },
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    padding: theme.spacing(1),
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  arrow: {
    flexGrow: 1,
  },
  flexAuto: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  alignItemsEnd: {
    alignItems: 'flex-end',
  },
  disabled: {
    opacity: 0.5,
  },
}));

export default SimilarOffersList;
