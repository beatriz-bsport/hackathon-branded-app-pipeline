import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { makeStyles } from '@material-ui/core/styles';
import { ListItem, Avatar, Checkbox, ListItemText } from '@material-ui/core';

import { formatAsDatetime, formatMinutes } from '#src/utils/datetime';
import DEFAULT_PROFILE_PICTURE_URL from '#src/assets/constants';
import SimilarOffersListSkeleton from '#src/libs/offer/components/SimilarOffersListSkeleton.component';

import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Offer, OfferSaas } from '#src/libs/offer/types';
import type { WellhubProductSelectionFormValues } from '#src/libs/wellhub/types';

type Props = {
  offer: OfferSaas;
  similarOffers: Offer<Coach, Establishment>[];
  similarOffersLoading: boolean;
};

type SimilarOfferCheckboxProps = {
  isDisabled?: boolean;
  isOfferChecked: boolean;
  similarOfferId: number;
  deselectSimilarOffer: (offerId: number) => void;
  selectSimilarOffer: (offerId: number) => void;
};

const SimilarOfferCheckbox: React.FC<SimilarOfferCheckboxProps> = React.memo(
  ({
    isDisabled,
    isOfferChecked,
    similarOfferId,
    deselectSimilarOffer,
    selectSimilarOffer,
  }) => {
    const handleCheckSimilarOffer = useCallback(
      (_: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => {
        isChecked
          ? selectSimilarOffer?.(similarOfferId)
          : deselectSimilarOffer?.(similarOfferId);
      },
      [deselectSimilarOffer, selectSimilarOffer, similarOfferId],
    );

    return (
      <Checkbox
        checked={isOfferChecked}
        disabled={isDisabled}
        onChange={handleCheckSimilarOffer}
      />
    );
  },
);

const WellhubProductSimilarOfferList: React.FC<Props> = ({
  offer,
  similarOffers,
  similarOffersLoading,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();

  const [similarOffersList, setSimilarOffersList] = useState<
    Offer<Coach, Establishment>[]
  >([]);

  const { values, setFieldValue } =
    useFormikContext<WellhubProductSelectionFormValues>();

  const isOfferChecked = useCallback(
    (offerId: number) => values.selectedSimilarOffers.includes(offerId),
    [values.selectedSimilarOffers],
  );

  const handleSelectOffer = useCallback(
    (offerId: number) => () =>
      setFieldValue('selectedSimilarOffers', [
        ...values.selectedSimilarOffers,
        offerId,
      ]),
    [setFieldValue, values.selectedSimilarOffers],
  );

  const handleDeselectOffer = useCallback(
    (offerId: number) => () =>
      setFieldValue(
        'selectedSimilarOffers',
        values.selectedSimilarOffers.filter((id) => id !== offerId),
      ),
    [setFieldValue, values.selectedSimilarOffers],
  );

  useEffect(() => {
    similarOffers && setSimilarOffersList(similarOffers);
    return () => setSimilarOffersList([]);
  }, [similarOffers]);

  if (similarOffersLoading) {
    return <SimilarOffersListSkeleton />;
  }

  return (
    <div>
      {!!similarOffersList.length &&
        similarOffersList.map((similarOffer) => (
          <ListItem
            key={similarOffer.id}
            dense
            divider
            className={classNames(classes.listItem, {
              [classes.disabled]: similarOffer.id === offer.id,
            })}
          >
            <SimilarOfferCheckbox
              deselectSimilarOffer={handleDeselectOffer(similarOffer.id)}
              isDisabled={similarOffer.id === offer.id}
              isOfferChecked={isOfferChecked(similarOffer.id)}
              selectSimilarOffer={handleSelectOffer(similarOffer.id)}
              similarOfferId={similarOffer.id}
            />
            <div className={classes.item}>
              {similarOffer.coach_override ? (
                <Avatar
                  src={
                    similarOffer.coach_override?.photo ||
                    DEFAULT_PROFILE_PICTURE_URL
                  }
                />
              ) : (
                <Avatar
                  src={similarOffer.coach?.photo || DEFAULT_PROFILE_PICTURE_URL}
                />
              )}
              <div className={classes.spaceBetween}>
                <ListItemText
                  primary={similarOffer.name_override || offer.name}
                  secondary={`${formatAsDatetime(
                    similarOffer.date_start,
                    similarOffer.timezone_name,
                  )} - ${formatMinutes(similarOffer.duration_minute, t)}`}
                />
                <div>
                  <ListItemText
                    primary={similarOffer.establishment.title}
                    secondary={
                      similarOffer.coach_override?.name ||
                      similarOffer.coach?.name
                    }
                  />
                </div>
              </div>
            </div>
          </ListItem>
        ))}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  listItem: {
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing(1),
    width: '100%',
  },
  item: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    gap: theme.spacing(2),
  },
  spaceBetween: {
    display: 'flex',
    width: '100%',
  },
  disabled: {
    backgroundColor: theme.palette.grey[200],
    opacity: 0.6,
  },
}));

export default React.memo(WellhubProductSimilarOfferList);
