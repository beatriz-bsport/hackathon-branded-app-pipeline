import React from 'react';
import {
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import * as Yup from 'yup';
import { withFormik, Form, FormikProps, Field, FieldProps } from 'formik';

import { compose } from 'recompose';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import FilterListIcon from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import type { ImmutableArray } from 'seamless-immutable';
// @ts-ignore
import { Submit } from '#components/forms';
import type { OptionCallback } from '../../../../../state/types';
import { MaterialUiMultiSelectorField } from '#libs/custom-form/components/GenericFormik.input';
import { Coach } from '#libs/associated-coach/types';
import {
  CoachPaymentRuleGroup,
  CoachPaymentRulesByKind,
} from '#libs/coach-payment-rules/types';
import CoachPerformanceLocationEstablishmentFilter from './CoachPerformanceLocationEstablishmentFilter.component';
import type {
  Establishment,
  EstablishmentGroupAPI,
} from '#libs/establishment/types';

type InitialValues = {
  by_coach_payment_rule_group: boolean;
  coaches_selected: Array<number>;
  coach_payment_rule_groups: Array<number>;
  session_coach_payment_rules: Array<number>;
  workshop_coach_payment_rules: Array<number>;
  private_service_coach_payment_rules: Array<number>;
  byLocation: boolean;
  locationsSelected: number[];
  establishmentsSelected: number[];
};

type Props = {
  coaches: Array<Coach>;
  isSubmitting: boolean;
  disabled?: boolean;
  loading: boolean;
  coachPaymentRuleGroups: Array<CoachPaymentRuleGroup>;
  coachPaymentRulesByKind: CoachPaymentRulesByKind;
  isMultiLocalizationEnabled: boolean;
  establishments: ImmutableArray<Establishment>;
  setSelectedEstablishmentFilter: (
    selectedEstablishments: number[],
    selectedLocations: number[],
  ) => void;
  establishmentGroupList: EstablishmentGroupAPI[];
  establishmentsLoading: boolean;
  establishmentGroupListLoading: boolean;
} & FormikProps<InitialValues>;

type FormProps = {
  selectedLocations: number[];
  selectedEstablishments: number[];
  onSubmit: (
    data: {
      coaches: number[];
    },
    options: OptionCallback,
  ) => void;
};

export function CoachPerformanceForm(props: Props) {
  const [openSection, setOptionSection] = React.useState<boolean>(false);

  const {
    isSubmitting,
    isMultiLocalizationEnabled,
    establishments,
    establishmentsLoading,
    establishmentGroupList,
    establishmentGroupListLoading,
    resetForm,
    setSelectedEstablishmentFilter,
  } = props;

  const classes = useStyles();
  const { t } = useTranslation([
    'paymentRules',
    'coachPerformance',
    'translation',
  ]);

  const disableFilters = props.loading || props.disabled;
  React.useEffect(() => {
    if (disableFilters) {
      setOptionSection(false);
    }
  }, [setOptionSection, disableFilters]);

  const establishmentsOptions = React.useMemo(
    () =>
      ([...establishments] || []).map((establishment) => {
        return { value: establishment.id, label: establishment.title };
      }),
    [establishments],
  );

  const establishmentGroupLocationsOptions = React.useMemo(
    () =>
      ([...establishmentGroupList] || []).map((establishmentGroup) => {
        return { value: establishmentGroup.id, label: establishmentGroup.name };
      }),
    [establishmentGroupList],
  );

  const handleResetForm = React.useCallback(() => {
    resetForm();
    setSelectedEstablishmentFilter([], []);
  }, [resetForm, setSelectedEstablishmentFilter]);

  return (
    <div className={classes.outterContainer}>
      <Form>
        <ButtonBase
          disableRipple
          className={classes.flexHeader}
          disabled={!props.coaches?.length || disableFilters}
          onClick={() => setOptionSection(!openSection)}
        >
          <div className={classes.flexHeader}>
            <FilterListIcon color="primary" />
            <Typography variant="h6">
              {t('coachPerformance:advancedFilters.header')}
            </Typography>
            {openSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
        </ButtonBase>
        <Collapse in={openSection}>
          <div className={classes.innerContainer}>
            <Field name="by_coach_payment_rule_group">
              {(fieldProps: FieldProps) => (
                <RadioGroup
                  row
                  className={classes.radioGroup}
                  name="payment_rule_filter_radio_group"
                  value={fieldProps.field.value}
                >
                  <FormControlLabel
                    value
                    control={
                      <Radio
                        checked={fieldProps.field.value}
                        onClick={() =>
                          props.setFieldValue(
                            'by_coach_payment_rule_group',
                            true,
                          )
                        }
                      />
                    }
                    label={t(
                      'coachPerformance:advancedFilters.byCoachPaymentruleGroups',
                    )}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={!fieldProps.field.value}
                        onClick={() =>
                          props.setFieldValue(
                            'by_coach_payment_rule_group',
                            false,
                          )
                        }
                      />
                    }
                    label={t(
                      'coachPerformance:advancedFilters.byCoachPaymentRules',
                    )}
                    value={false}
                  />
                </RadioGroup>
              )}
            </Field>
            <Collapse in={props.values.by_coach_payment_rule_group}>
              <div className={classes.select}>
                <Typography variant="subtitle1">
                  {t(
                    'coachPerformance:advancedFilters.coachPaymentRuleGroupSelector',
                  )}
                </Typography>
                <MaterialUiMultiSelectorField
                  isMenuListVirtualized
                  isDisabled={disableFilters}
                  name="coach_payment_rule_groups"
                  options={[...(props?.coachPaymentRuleGroups || [])].map(
                    (group) => ({
                      label: group.name,
                      value: group.id,
                    }),
                  )}
                  placeholder={t('coachPerformance:form.ifEmptyAllowAll')}
                />
              </div>
            </Collapse>
            <Collapse in={!props.values.by_coach_payment_rule_group}>
              <div className={classes.select}>
                <Typography variant="subtitle1">
                  {t(
                    'coachPerformance:advancedFilters.sessionCoachPaymentRuleSelctor',
                  )}
                </Typography>
                <MaterialUiMultiSelectorField
                  isMenuListVirtualized
                  isDisabled={disableFilters}
                  name="session_coach_payment_rules"
                  options={[
                    ...(props?.coachPaymentRulesByKind[
                      COACH_PERFORMANCE_FOR_SESSION
                    ] || []),
                  ].map((rule) => ({
                    label: rule.name,
                    value: rule.id,
                  }))}
                  placeholder={t('coachPerformance:form.ifEmptyAllowAll')}
                />
              </div>

              <div className={classes.select}>
                <Typography variant="subtitle1">
                  {t(
                    'coachPerformance:advancedFilters.workshopCoachPaymentRuleSelctor',
                  )}
                </Typography>
                <MaterialUiMultiSelectorField
                  isMenuListVirtualized
                  isDisabled={disableFilters}
                  name="workshop_coach_payment_rules"
                  options={[
                    ...(props?.coachPaymentRulesByKind[
                      COACH_PERFORMANCE_FOR_SESSION
                    ] || []),
                  ].map((rule) => ({
                    label: rule.name,
                    value: rule.id,
                  }))}
                  placeholder={t('coachPerformance:form.ifEmptyAllowAll')}
                />
              </div>

              <div className={classes.select}>
                <Typography variant="subtitle1">
                  {t(
                    'coachPerformance:advancedFilters.privateserviceCoachPaymentRuleSelector',
                  )}
                </Typography>
                <MaterialUiMultiSelectorField
                  isMenuListVirtualized
                  isDisabled={disableFilters}
                  name="private_service_coach_payment_rules"
                  options={[
                    ...(props?.coachPaymentRulesByKind[
                      COACH_PERFORMANCE_FOR_APPOINTMENT
                    ] || []),
                  ].map((rule) => ({
                    label: rule.name,
                    value: rule.id,
                  }))}
                  placeholder={t('coachPerformance:form.ifEmptyAllowAll')}
                />
              </div>
            </Collapse>
            <div className={classes.select}>
              <Typography variant="subtitle1">
                {t('coachPerformance:advancedFilters.coachSelector')}
              </Typography>
              <MaterialUiMultiSelectorField
                isMenuListVirtualized
                isDisabled={disableFilters}
                name="coaches_selected"
                options={[...props.coaches].map((coach) => ({
                  label: coach.name,
                  value: coach.associated_coach_id,
                }))}
                placeholder={t('coachPerformance:form.ifEmptyAllowAll')}
              />
            </div>

            <Divider className={classes.divider} />

            <CoachPerformanceLocationEstablishmentFilter
              areFiltersDisabled={disableFilters}
              establishmentGroupListLoading={establishmentGroupListLoading}
              establishmentsLoading={establishmentsLoading}
              establishmentsOptions={establishmentsOptions}
              isMultiLocalizationEnabled={isMultiLocalizationEnabled}
              locationsOptions={establishmentGroupLocationsOptions}
            />

            <Divider className={classes.divider} />

            <div className={classes.bottomActions}>
              <Button
                color="secondary"
                disabled={isSubmitting || !!props.disabled || props.loading}
                onClick={handleResetForm}
                variant="outlined"
              >
                {t('coachPerformance:advancedFilters.reset')}
              </Button>
              <Submit
                color="primary"
                disabled={isSubmitting || !!props.disabled || props.loading}
                id="button_set_advanced_filters"
                variant="outlined"
              >
                {t('coachPerformance:advancedFilters.apply')}
              </Submit>
            </div>
          </div>
        </Collapse>
      </Form>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  outterContainer: {
    width: '100%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  innerContainer: {
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      paddingRight: theme.spacing(0),
      paddingLeft: theme.spacing(0),
    },
  },
  select: { flex: '1 0', minWidth: theme.spacing(30) },
  flexHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
    gap: theme.spacing(2),
  },
  bottomActions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  divider: { margin: theme.spacing(2, 0) },
  radioGroup: { paddingBottom: theme.spacing(2) },
}));

const CoachPerformanceSchema = Yup.object().shape({
  dateStart: Yup.date(),
});

export default compose<any, Props>(
  withFormik<Props & FormProps, InitialValues>({
    mapPropsToValues: ({
      selectedLocations,
      selectedEstablishments,
      isMultiLocalizationEnabled,
    }) => ({
      by_coach_payment_rule_group: true,
      coaches_selected: [],
      coach_payment_rule_groups: [],
      session_coach_payment_rules: [],
      workshop_coach_payment_rules: [],
      private_service_coach_payment_rules: [],
      establishmentsSelected: selectedEstablishments,
      locationsSelected: selectedLocations,
      byLocation: isMultiLocalizationEnabled
        ? selectedEstablishments?.length === 0
        : false,
    }),
    validationSchema: CoachPerformanceSchema,
    enableReinitialize: true,
    handleSubmit: (
      values,
      {
        props: { onSubmit, coaches, setSelectedEstablishmentFilter },
        setSubmitting,
      },
    ) => {
      let coachesFiltered = coaches;
      if (values.coaches_selected.length !== 0) {
        coachesFiltered = coachesFiltered.filter((coach) =>
          values.coaches_selected.includes(coach.associated_coach_id),
        );
      }
      if (values.by_coach_payment_rule_group) {
        if (values.coach_payment_rule_groups?.length !== 0) {
          coachesFiltered = coachesFiltered.filter((coach) =>
            values.coach_payment_rule_groups.includes(
              coach.coach_payment_rule_group_id,
            ),
          );
        }
      } else {
        coachesFiltered = coachesFiltered.filter(
          (coach) => !coach.coach_payment_rule_group_id,
        );
        if (values.session_coach_payment_rules?.length !== 0) {
          coachesFiltered = coachesFiltered.filter((coach) =>
            values.session_coach_payment_rules.includes(
              coach.coach_payment_rule_id,
            ),
          );
        }

        if (values.workshop_coach_payment_rules?.length !== 0) {
          coachesFiltered = coachesFiltered.filter((coach) =>
            values.workshop_coach_payment_rules.includes(
              coach.workshop_coach_payment_rule_id,
            ),
          );
        }

        if (values.private_service_coach_payment_rules?.length !== 0) {
          coachesFiltered = coachesFiltered.filter((coach) =>
            values.private_service_coach_payment_rules.includes(
              coach.private_coach_payment_rule_id,
            ),
          );
        }
      }

      if (!values.byLocation && values.establishmentsSelected?.length !== 0) {
        setSelectedEstablishmentFilter(values.establishmentsSelected, []);
      } else if (values.byLocation && values.locationsSelected?.length !== 0) {
        setSelectedEstablishmentFilter([], values.locationsSelected);
      } else {
        setSelectedEstablishmentFilter([], []);
      }

      onSubmit(
        {
          coaches:
            coachesFiltered?.map((coach) => coach.associated_coach_id) || [],
        },
        {
          onError: () => setSubmitting(false),
          onSuccess: () => {
            setSubmitting(false);
          },
        },
      );
    },
  }),
)(CoachPerformanceForm);
