import React, { useCallback, useMemo } from 'react';

import FitnessCenter from '@material-ui/icons/FitnessCenter';
import { useFormikContext } from 'formik';
import {
  COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY,
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_WORKSHOP,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import FormSection from '#components/forms/FormSection';
import OfferFormField from '#libs/offer/form/OfferFormField.component';
import { useOfferFormStyles } from '#libs/offer/hooks';
import CoachSelector from '#libs/associated-coach/components/coach-selector/CoachSelector.component';
import CoachPaymentRuleSelectorStyled from '#libs/coach-payment-rules/components/coach-payment-rule-selector/CoachPaymentRuleSelectorStyled.component';

import { OfferFormValues } from '#libs/offer/types';
import { Coach } from '#libs/associated-coach/types';
import { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import Config from '../../../../config';

type Props = {
  coaches: Coach[];
  editableCoachPaymentRule: boolean;
  coachPaymentRulesByKind: { [kind: number]: CoachPaymentRule[] };
  isEditOffer?: boolean;
  disabled?: boolean;
  isWorkshop?: boolean;
};

const OfferFormCoach = (props: Props) => {
  const {
    coaches,
    editableCoachPaymentRule,
    coachPaymentRulesByKind,
    isEditOffer,
    disabled,
    isWorkshop,
  } = props;
  const classes = useOfferFormStyles();
  const { t } = useTranslation('offer');
  const { values, touched, errors, setFieldValue, handleBlur } =
    useFormikContext<OfferFormValues>();
  const { coach, additionalCoaches, coachPaymentRule, coachOverride } = values;

  const handleSelectCoach = useCallback(
    (newCoach: { value: number; label: string }) => {
      setFieldValue('coach', newCoach?.value ?? null);
      /*
       * If the selected coach is already selected as coachOverride
       * we clear the value (prevents that coachOverride === coach)
       */
      if (newCoach.value === coachOverride) {
        setFieldValue('coachOverride', null);
      }
    },
    [setFieldValue, coachOverride],
  );

  const handleMultiSelectCoach = useCallback(
    (newCoaches: { value: number; label: string }[]) => {
      setFieldValue(
        'additionalCoaches',
        newCoaches
          .map((coachData) => coachData?.value ?? null)
          .filter((_coach) => !!_coach),
      );
    },
    [setFieldValue],
  );

  const handleSelectCoachOverride = useCallback(
    (newCoach?: { value: number; label: string }) => {
      setFieldValue('coachOverride', newCoach?.value ?? null);
    },
    [setFieldValue],
  );

  const handleSelectPaymentRule = useCallback(
    (item: { value: number; label: string }) => {
      setFieldValue('coachPaymentRule', item?.value ?? null);
    },
    [setFieldValue],
  );

  const selectedCoaches = useMemo(() => {
    if (coach && coaches) {
      return [coaches.find((coachValue) => coachValue.id === coach)?.id];
    }
    return null;
  }, [coach, coaches]);

  const availableMainCoaches = useMemo(() => {
    return coaches.filter((_coach) => !additionalCoaches.includes(_coach.id));
  }, [coaches, additionalCoaches]);

  const availableAdditionalCoaches = useMemo(() => {
    return coaches.filter((_coach) => _coach.id !== coach);
  }, [coaches, coach]);

  const selectedAdditionalCoaches = useMemo(() => {
    if (additionalCoaches && coaches) {
      return additionalCoaches.map(
        (coachId) =>
          coaches.find((coachValue) => coachValue.id === coachId)?.id,
      );
    }
    return null;
  }, [coaches, additionalCoaches]);

  const availableCoachOverride = useMemo(
    () =>
      coaches
        ? coaches.filter((currentCoach) => currentCoach.id !== coach)
        : null,
    [coach, coaches],
  );

  const selectedCoachOverride = useMemo(
    () =>
      coaches && coachOverride
        ? [coaches.find((coachValue) => coachValue.id === coachOverride)?.id]
        : null,
    [coachOverride, coaches],
  );

  const coachPaymentRulesList = useMemo(() => {
    if (coachPaymentRulesByKind) {
      if (isWorkshop === undefined) {
        return coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_SESSION].concat(
          coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY],
        ).concat(coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_WORKSHOP]);
      }
      if (isWorkshop) {
        return coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_SESSION].concat(
          coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_WORKSHOP],
        );
      }
      return coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_SESSION].concat(
        coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY],
      );
    }
    return [];
  }, [coachPaymentRulesByKind, isWorkshop]);

  const selectedPaymentRule = useMemo(() => {
    const paymentRules: number[] = [];
    const selectedRule = coachPaymentRulesList
      ? coachPaymentRulesList?.find((rule) => rule?.id === coachPaymentRule)
      : null;

    if (selectedRule) {
      paymentRules.push(selectedRule.id);
    }
    return paymentRules;
  }, [coachPaymentRule, coachPaymentRulesList]);

  return (
    <FormSection
      id="offer-form-coach-section"
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIcon={FitnessCenter}
      sectionIconContainerStyle={classes.sectionIconContainer}
      sectionTitle={t('form.section.coach.title')}
    >
      <OfferFormField
        isRequired
        id="offer-form-coach-field"
        isError={!!errors.coach}
        label={t('form.section.coach.field.coach.title')}
      >
        <div className={classes.errorContainer}>
          <CoachSelector
            closeMenuOnSelect
            noMulti
            coaches={availableMainCoaches}
            id="offer-form-coach-selector"
            isDisabled={!!disabled}
            isError={!!errors.coach && touched.coach}
            onBlur={handleBlur}
            placeholder={t('form.section.coach.field.coach.placeholder')}
            selectedCoaches={selectedCoaches}
            selectOption={handleSelectCoach}
            selectorClass={classes.bigWidth}
          />

          {!!errors.coach && touched.coach && (
            <Typography color="error" variant="caption">
              {t(errors.coach)}
            </Typography>
          )}
        </div>
      </OfferFormField>
      {!!coach && Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' && (
        <OfferFormField
          id="offer-form-coach-field"
          isError={!!errors.coach}
          label={t('form.section.coach.additionalCoaches.title')}
        >
          <div className={classes.errorContainer}>
            <CoachSelector
              closeMenuOnSelect
              coaches={availableAdditionalCoaches}
              id="offer-form-coach-selector"
              isDisabled={!!disabled}
              isError={!!errors.coach && touched.coach}
              onBlur={handleBlur}
              placeholder={t(
                'form.section.coach.additionalCoaches.field.placeHolder',
              )}
              selectedCoaches={selectedAdditionalCoaches}
              selectOption={handleMultiSelectCoach}
              selectorClass={classes.xBigWidth}
            />

            {!!errors.coach && touched.coach && (
              <Typography color="error" variant="caption">
                {t(errors.coach)}
              </Typography>
            )}
          </div>
        </OfferFormField>
      )}

      {isEditOffer && (
        <OfferFormField
          id="offer-form-coach-override-field"
          label={t('form.section.coach.field.coachOverride.title')}
        >
          <CoachSelector
            closeMenuOnSelect
            isClearable
            noMulti
            coaches={availableCoachOverride}
            id="offer-form-coach-override-selector"
            isDisabled={!!disabled}
            placeholder={t(
              'form.section.coach.field.coachOverride.placeholder',
            )}
            selectedCoaches={selectedCoachOverride}
            selectOption={handleSelectCoachOverride}
            selectorClass={classes.xBigWidth}
          />
        </OfferFormField>
      )}

      {editableCoachPaymentRule && (
        <OfferFormField
          label={t('form.section.coach.field.coachPaymentRule.title')}
        >
          <CoachPaymentRuleSelectorStyled
            closeMenuOnSelect
            isClearable
            noMulti
            coachPaymentRulesList={coachPaymentRulesList}
            disabled={!coach || !!disabled}
            id="offer-form-coach-payment-rule-selector"
            onChange={handleSelectPaymentRule}
            placeholder={t(
              'form.section.coach.field.coachPaymentRule.placeholder',
            )}
            selectedRules={selectedPaymentRule}
            selectorClass={classes.bigWidth}
          />
        </OfferFormField>
      )}
    </FormSection>
  );
};

export default React.memo(OfferFormCoach);
