import React, { ChangeEvent, useCallback, useMemo } from 'react';

import FitnessCenter from '@material-ui/icons/FitnessCenter';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import Alert from '@material-ui/lab/Alert';

import FormSection from '#components/forms/FormSection';
import { useOfferFormStyles } from '#libs/offer/hooks';
import SimilarOffersList from '#libs/offer/components/SimilarOffersList.component';

import { Coach } from '#libs/associated-coach/types';
import { Offer, OfferFormValues } from '#libs/offer/types';
import { PropagateCoachOverrideToSimilarOffers } from '#libs/offer/constants';

type Props = {
  similarOffers: Offer[];
  coaches: Coach[];
  similarOffersLoading: boolean;
  offerId?: number;
  offerCoachOverrideId?: number;
};

const OfferFormEditCoachOverride = (props: Props) => {
  const {
    similarOffers,
    coaches,
    similarOffersLoading,
    offerId,
    offerCoachOverrideId,
  } = props;
  const classes = useOfferFormStyles();
  const { values, handleChange, setFieldValue } =
    useFormikContext<OfferFormValues>();
  const {
    isCoachOverridePropagate,
    coachOverridePropagateMode,
    selectedSimilarOffers,
  } = values;
  const { t } = useTranslation('offer');

  const similarSessionsWithCoachOverride = useMemo(
    () =>
      similarOffers?.filter(
        (similarOffer) =>
          !!similarOffer.coach_override &&
          similarOffer.coach_override !== offerCoachOverrideId &&
          similarOffer.id !== offerId &&
          selectedSimilarOffers.includes(similarOffer.id),
      ) ?? [],
    [offerCoachOverrideId, offerId, selectedSimilarOffers, similarOffers],
  );

  const handleCoachOverridePropagateMode = useCallback(
    (_: ChangeEvent<HTMLInputElement>, value: string) => {
      setFieldValue('coachOverridePropagateMode', parseInt(value));
    },
    [setFieldValue],
  );

  return (
    <FormSection
      id="offer-form-settings-section"
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIcon={FitnessCenter}
      sectionIconContainerStyle={classes.sectionIconContainer}
      sectionTitle={t('form.section.coachOverride.title')}
    >
      <div className={classes.settingsFields}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isCoachOverridePropagate}
              color="secondary"
              id="offer-form-edit-"
              name="isCoachOverridePropagate"
              onChange={handleChange}
            />
          }
          label={t('form.section.coachOverride.field.isCoachOverridePropagate')}
        />

        <Alert id="offer-form-edit-coach-override-info" severity="info">
          {t('form.section.coachOverride.info')}
        </Alert>
      </div>

      {isCoachOverridePropagate && similarSessionsWithCoachOverride.length > 0 && (
        <>
          <Alert severity="warning">
            {t('liveOfferEdit.editSubteacher.propagateToSimilarOffers.warning')}
          </Alert>

          <RadioGroup
            className={classes.coachOverrideModeRadioGroup}
            name="coachOverridePropagateMode"
            onChange={handleCoachOverridePropagateMode}
            value={coachOverridePropagateMode}
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
            similarOffers={similarSessionsWithCoachOverride}
            similarOffersLoading={similarOffersLoading}
          />
        </>
      )}
    </FormSection>
  );
};

export default OfferFormEditCoachOverride;
