// @ts-nocheck
import React from 'react';
import {
  Typography,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  CircularProgress,
} from '@material-ui/core';
import { FitnessCenter } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';

import { PropagateCoachOverrideToSimilarOffers } from '#libs/offer/constants';
import SimilarOffersList from '#libs/offer/components/SimilarOffersList.component';
import { Coach } from '#libs/associated-coach/types';
import { Offer } from '#libs/offer/types';

type Props = {
  classes: {
    advancedOptionsHeader: string;
    settings: string;
    propagateInfo: string;
    fieldGroup: string;
    field: string;
    fieldLeft: string;
  };
  similarOffers: Offer[];
  coaches: Coach[];
  similarOfferLoading: boolean;
  similarOffersCount: number;
  similarOffersPage: number;
  subTeacherEditPropagationMode: PropagateCoachOverrideToSimilarOffers;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (
    ev: React.ChangeEvent<HTMLButtonElement>,
    page_number: number,
  ) => void;
};

const NO_PROPAGATION = PropagateCoachOverrideToSimilarOffers.NO_PROPAGATION;

const OfferEditSubteacherChangeSettings = (props: Props) => {
  const { t } = useTranslation('offer');
  const {
    classes,
    similarOffers,
    coaches,
    similarOfferLoading,
    similarOffersCount,
    similarOffersPage,
    subTeacherEditPropagationMode,
    onCheckboxChange,
    onRadioChange,
    onPageChange,
  } = props;

  return (
    <>
      <div className={classes.advancedOptionsHeader}>
        <FitnessCenter className={classes.settings} />
        <Typography variant="h6">
          {t('liveOfferEdit.editSubteacher.title')}
        </Typography>
      </div>

      <div className={classes.fieldGroup}>
        <FormControlLabel
          className={classes.field}
          control={
            <Checkbox
              onChange={onCheckboxChange}
              checked={subTeacherEditPropagationMode !== NO_PROPAGATION}
              color="primary"
            />
          }
          label={t(
            'liveOfferEdit.editSubteacher.propagateToSimilarOffers.checkboxLabel',
          )}
        />
        <Alert
          severity="info"
          variant="outlined"
          className={classes.propagateInfo}
        >
          {t(
            'liveOfferEdit.editSubteacher.propagateToSimilarOffers.checkboxInfo',
          )}
        </Alert>
      </div>

      {similarOfferLoading && <CircularProgress />}

      {subTeacherEditPropagationMode !== NO_PROPAGATION &&
        similarOffersCount > 0 && (
          <>
            <div>
              <Alert severity="warning">
                {t(
                  'liveOfferEdit.editSubteacher.propagateToSimilarOffers.warning',
                )}
              </Alert>
              <RadioGroup
                value={subTeacherEditPropagationMode}
                onChange={onRadioChange}
              >
                <FormControlLabel
                  className={classes.field}
                  control={<Radio />}
                  label={t(
                    'liveOfferEdit.editSubteacher.propagateToSimilarOffers.mode.offersWithSameCoachOverrideOnly',
                  )}
                  value={
                    PropagateCoachOverrideToSimilarOffers.PROPAGATE_TO_OFFERS_WITH_SAME_COACH_OVERRIDE_ONLY
                  }
                />
                <FormControlLabel
                  className={classes.fieldLeft}
                  control={<Radio />}
                  label={t(
                    'liveOfferEdit.editSubteacher.propagateToSimilarOffers.mode.all',
                  )}
                  value={PropagateCoachOverrideToSimilarOffers.PROPAGATE_TO_ALL}
                />
              </RadioGroup>
            </div>

            <SimilarOffersList
              similarOffers={similarOffers}
              similarOfferLoading={similarOfferLoading}
              similarOffersCount={similarOffersCount}
              similarOffersPage={similarOffersPage}
              coaches={coaches}
              handlePageChange={onPageChange}
            />
          </>
        )}
    </>
  );
};
export default OfferEditSubteacherChangeSettings;
