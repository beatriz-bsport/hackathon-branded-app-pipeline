import React, { useCallback, useMemo } from 'react';

import { FitnessCenter } from '@material-ui/icons';
import { useFormikContext } from 'formik';
import { COACH_PAYMENT_RULE_FOR_SESSION } from '@bsport/common/lib/master-data/coach_payment_rule';
import { useTranslation } from 'react-i18next';
import { Typography, useMediaQuery, useTheme } from '@material-ui/core';

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
};

const OfferFormCoach = (props: Props) => {
  const { coaches, editableCoachPaymentRule, coachPaymentRulesByKind } = props;
  const classes = useOfferFormStyles();
  const { t } = useTranslation('offer');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const { values, errors, setFieldValue } = useFormikContext<OfferFormValues>();
  const { coach, coachPaymentRule } = values;

  const handleSelectCoach = useCallback(
    (newCoach: { value: number; label: string }) => {
      setFieldValue('coach', newCoach?.value ?? null);
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

  const selectedPaymentRule = useMemo(() => {
    const paymentRules: number[] = [];
    const selectedRule = coachPaymentRulesByKind[
      COACH_PAYMENT_RULE_FOR_SESSION
    ]?.find((rule) => rule?.id === coachPaymentRule);

    if (selectedRule) {
      paymentRules.push(selectedRule.id);
    }
    return paymentRules;
  }, [coachPaymentRule, coachPaymentRulesByKind]);

  return (
    <FormSection
      id="offer-form-coach-section"
      sectionTitle={t('offer:form.section.coach.title')}
      sectionIcon={FitnessCenter}
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIconContainerStyle={classes.sectionIconContainer}
    >
      <OfferFormField
        id="offer-form-coach-field"
        label={t('offer:form.section.coach.field.coach.title')}
        isRequired
        isError={!!errors.coach}
        isFlexColumn={isMobile}
      >
        <div className={classes.errorContainer}>
          <CoachSelector
            id="offer-form-coach-selector"
            placeholder={t('offer:form.section.coach.field.coach.placeholder')}
            coaches={coaches}
            noMulti
            closeMenuOnSelect
            selectedCoaches={selectedCoaches}
            selectOption={handleSelectCoach}
            selectorClass={classes.bigWidth}
            isError={!!errors.coach}
          />

          {!!errors.coach && (
            <Typography variant="caption" color="error">
              {t(errors.coach)}
            </Typography>
          )}
        </div>
      </OfferFormField>

      {editableCoachPaymentRule && (
        <OfferFormField
          label={t('offer:form.section.coach.field.coachPaymentRule.title')}
          isFlexColumn={isMobile}
        >
          <CoachPaymentRuleSelectorStyled
            id="offer-form-coach-payment-rule-selector"
            coachPaymentRulesList={
              coachPaymentRulesByKind[COACH_PAYMENT_RULE_FOR_SESSION]
            }
            selectedRules={selectedPaymentRule}
            placeholder={t(
              'offer:form.section.coach.field.coachPaymentRule.placeholder',
            )}
            disabled={!coach}
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
