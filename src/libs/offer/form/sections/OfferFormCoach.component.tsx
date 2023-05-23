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
  const { coach, coachPaymentRule, coachOverride } = values;

  const handleSelectCoach = useCallback(
    (newCoach: { value: number; label: string }) => {
      setFieldValue('coach', newCoach?.value ?? null);
    },
    [setFieldValue],
  );

  const handleSelectCoachOverride = useCallback(
    (newCoach: { value: number; label: string }) => {
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
      sectionTitle={t('form.section.coach.title')}
      sectionIcon={FitnessCenter}
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIconContainerStyle={classes.sectionIconContainer}
    >
      <OfferFormField
        id="offer-form-coach-field"
        label={t('form.section.coach.field.coach.title')}
        isRequired
        isError={!!errors.coach}
      >
        <div className={classes.errorContainer}>
          <CoachSelector
            id="offer-form-coach-selector"
            placeholder={t('form.section.coach.field.coach.placeholder')}
            coaches={coaches}
            noMulti
            closeMenuOnSelect
            selectedCoaches={selectedCoaches}
            selectOption={handleSelectCoach}
            onBlur={handleBlur}
            selectorClass={classes.bigWidth}
            isError={!!errors.coach && touched.coach}
            isDisabled={!!disabled}
          />

          {!!errors.coach && touched.coach && (
            <Typography variant="caption" color="error">
              {t(errors.coach)}
            </Typography>
          )}
        </div>
      </OfferFormField>

      {isEditOffer && (
        <OfferFormField
          id="offer-form-coach-override-field"
          label={t('form.section.coach.field.coachOverride.title')}
        >
          <CoachSelector
            id="offer-form-coach-override-selector"
            placeholder={t(
              'form.section.coach.field.coachOverride.placeholder',
            )}
            coaches={availableCoachOverride}
            noMulti
            isClearable
            closeMenuOnSelect
            selectedCoaches={selectedCoachOverride}
            selectOption={handleSelectCoachOverride}
            selectorClass={classes.xBigWidth}
            isDisabled={!!disabled}
          />
        </OfferFormField>
      )}

      {editableCoachPaymentRule && (
        <OfferFormField
          label={t('form.section.coach.field.coachPaymentRule.title')}
        >
          <CoachPaymentRuleSelectorStyled
            id="offer-form-coach-payment-rule-selector"
            coachPaymentRulesList={coachPaymentRulesList}
            selectedRules={selectedPaymentRule}
            placeholder={t(
              'form.section.coach.field.coachPaymentRule.placeholder',
            )}
            disabled={!coach || !!disabled}
            onChange={handleSelectPaymentRule}
            noMulti
            isClearable
            selectorClass={classes.bigWidth}
            closeMenuOnSelect
          />
        </OfferFormField>
      )}
    </FormSection>
  );
};

export default OfferFormCoach;
