import React from 'react';

import { FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/styles';

import SimilarOffersList from '#libs/offer/components/SimilarOffersList.component';

import { PropagateCoachOverrideToSimilarOffers } from '#libs/offer/constants';
import { Coach } from '#libs/associated-coach/types';
import { Offer } from '#libs/offer/types';

type Props = {
  similarOffers: Offer[];
  coaches: Coach[];
  similarOfferLoading: boolean;
  subTeacherEditPropagationMode: PropagateCoachOverrideToSimilarOffers;
  onRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const NO_PROPAGATION = PropagateCoachOverrideToSimilarOffers.NO_PROPAGATION;

const OfferEditSubteacherChangeSettings = (props: Props) => {
  const { t } = useTranslation('offer');
  const classes = useStyles();
  const {
    similarOffers,
    coaches,
    similarOfferLoading,
    subTeacherEditPropagationMode,
    onRadioChange,
  } = props;

  return (
    <>
      {subTeacherEditPropagationMode !== NO_PROPAGATION &&
        !!similarOffers.length && (
          <>
            <Alert severity="warning">
              {t(
                'liveOfferEdit.editSubteacher.propagateToSimilarOffers.warning',
              )}
            </Alert>

            <RadioGroup
              className={classes.radioGroup}
              onChange={onRadioChange}
              value={subTeacherEditPropagationMode}
            >
              <FormControlLabel
                control={<Radio />}
                label={t(
                  'liveOfferEdit.editSubteacher.propagateToSimilarOffers.mode.offersWithSameCoachOverrideOnly',
                )}
                value={
                  PropagateCoachOverrideToSimilarOffers.PROPAGATE_TO_OFFERS_WITH_SAME_COACH_OVERRIDE_ONLY
                }
              />
              <FormControlLabel
                control={<Radio />}
                label={t(
                  'liveOfferEdit.editSubteacher.propagateToSimilarOffers.mode.all',
                )}
                value={PropagateCoachOverrideToSimilarOffers.PROPAGATE_TO_ALL}
              />
            </RadioGroup>

            <SimilarOffersList
              isCoachOverrideWarning
              coaches={coaches}
              // @ts-expect-error
              similarOfferLoading={similarOfferLoading}
              similarOffers={similarOffers}
            />
          </>
        )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  radioGroup: {
    // @ts-expect-error
    marginTop: theme.spacing(2),
  },
}));

export default OfferEditSubteacherChangeSettings;
