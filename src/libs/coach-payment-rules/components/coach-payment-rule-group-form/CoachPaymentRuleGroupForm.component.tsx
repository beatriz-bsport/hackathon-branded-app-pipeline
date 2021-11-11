import React from 'react';
import lodash from 'lodash';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { withFormik, FieldArray } from 'formik';
import { Theme as MaterialTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ClearIcon from '@material-ui/icons/Clear';

import {
  COACH_PERFORMANCE_FOR_SESSION,
  COACH_PERFORMANCE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import { TextField, AlertError } from '../../../../components/forms';

import CoachPaymentRuleGroupSchema from './schemaValidation';
import CoachSelector from '../../../associated-coach/components/coach-selector/CoachSelector.component';
import CoachListItem from '../../../associated-coach/components/CoachListItem.component';
import type { Coach } from '../../../associated-coach/types';
import type { CoachPaymentRule } from '../../types';
import type { MaterialStyleType } from '../../../../utils/types';
import { PrivateServiceWithSlots } from '../../../private-service/types';
import CoachPaymentRuleSelectorStyled from '../coach-payment-rule-selector/CoachPaymentRuleSelectorStyled.component';
import PrivateSlotSelectorStyled from '../PrivateSlotSelectorStyled.component';

type OwnProps = {
  associated_coaches: Array<Coach>;
  privateServices: Array<PrivateServiceWithSlots>;
  rulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  setFieldValue: (key: string, value: any) => void;
  errors: any;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

export function CoachPaymentRuleGroupFormFields(props: Props) {
  const { t, classes } = props;
  const { rulesByKind, setFieldValue, privateServices, associated_coaches } =
    props;

  const [openPrivateSlotSection, setOpenPrivateSlotSection] =
    React.useState(false);
  const [openCoachSection, setOpenCoachSection] = React.useState(false);
  const tooglePrivateSlotSection = () =>
    setOpenPrivateSlotSection(!openPrivateSlotSection);
  const toogleCoachSection = () => setOpenCoachSection(!openCoachSection);
  return (
    <>
      <Grid container spacing={2}>
        <div className={classes.container}>
          <Typography variant="body1">
            {t('coach_payment_rule_groups.subtitle.helper')}
          </Typography>
          <div className={classes.spaceDivider} />
          <TextField
            id="textfield_coach_payment_rule_group"
            name="name"
            label={t('coach_payment_rules.name')}
            fullWidth
            required
          />
          <AlertError name="name" />
        </div>

        <Grid item xs={12}>
          <Typography variant="h6">
            {t('coach_payment_rule_groups.subtitle.default')}
          </Typography>
          <Grid container>
            <Grid item xs={8} className={classes.paymentRuleRow}>
              <FieldArray name="session_coach_payment_rule">
                {({
                  form: {
                    values: { session_coach_payment_rule },
                  },
                }) => (
                  <Grid
                    container
                    direction="row"
                    spacing={2}
                    style={{ alignItems: 'center' }}
                  >
                    <Grid item xs={4}>
                      <Typography>
                        {t('coach_payment_rule_groups.fields.activity')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <CoachPaymentRuleSelectorStyled
                        id="session_coach_payment_rule"
                        coachPaymentRulesList={
                          rulesByKind[COACH_PERFORMANCE_FOR_SESSION]
                        }
                        selectedRules={[session_coach_payment_rule]}
                        placeholder={t('paymentRules:label')}
                        onChange={(item: { value: number; label: string }) => {
                          setFieldValue(
                            'session_coach_payment_rule',
                            item ? item.value : null,
                          );
                        }}
                        noMulti
                        isClearable
                      />
                    </Grid>
                  </Grid>
                )}
              </FieldArray>
            </Grid>
            <Grid item xs={8} className={classes.paymentRuleRow}>
              <FieldArray name="workshop_coach_payment_rule">
                {({
                  form: {
                    values: { workshop_coach_payment_rule },
                  },
                }) => (
                  <Grid
                    container
                    direction="row"
                    spacing={2}
                    style={{ alignItems: 'center' }}
                  >
                    <Grid item xs={4}>
                      <Typography>
                        {t('coach_payment_rule_groups.fields.workshop')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <CoachPaymentRuleSelectorStyled
                        id="workshop_coach_payment_rule"
                        coachPaymentRulesList={
                          rulesByKind[COACH_PERFORMANCE_FOR_SESSION]
                        }
                        selectedRules={[workshop_coach_payment_rule]}
                        placeholder={t('paymentRules:label')}
                        onChange={(item: { value: number; label: string }) => {
                          setFieldValue(
                            'workshop_coach_payment_rule',
                            item ? item.value : null,
                          );
                        }}
                        noMulti
                        isClearable
                      />
                    </Grid>
                  </Grid>
                )}
              </FieldArray>
            </Grid>

            <Grid item xs={8}>
              <FieldArray name="private_service_coach_payment_rule">
                {({
                  form: {
                    values: { private_service_coach_payment_rule },
                  },
                }) => (
                  <Grid
                    container
                    direction="row"
                    spacing={2}
                    style={{ alignItems: 'center' }}
                  >
                    <Grid item xs={4}>
                      <Typography>
                        {t('coach_payment_rule_groups.fields.private_service')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <CoachPaymentRuleSelectorStyled
                        id="private_service_coach_payment_rule"
                        coachPaymentRulesList={
                          rulesByKind[COACH_PERFORMANCE_FOR_APPOINTMENT]
                        }
                        selectedRules={[private_service_coach_payment_rule]}
                        placeholder={t('paymentRules:label')}
                        onChange={(item: { value: number; label: string }) => {
                          setFieldValue(
                            'private_service_coach_payment_rule',
                            item ? item.value : null,
                          );
                        }}
                        noMulti
                        isClearable
                      />
                    </Grid>
                  </Grid>
                )}
              </FieldArray>
            </Grid>
          </Grid>
          <AlertError name="session_coach_payment_rule" />
          <Grid item xs={12}>
            <div className={classes.spaceDivider} />
            <div className={classes.row}>
              <Typography variant="h6">
                {t('coach_payment_rule_groups.subtitle.specfic_private_slot')}
              </Typography>

              <IconButton onClick={tooglePrivateSlotSection}>
                {openPrivateSlotSection ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </div>
            <Collapse in={openPrivateSlotSection}>
              <FieldArray name="private_slots_coach_payment_rules">
                {({
                  remove,
                  form: {
                    values: { private_slots_coach_payment_rules },
                  },
                }) => (
                  <TableContainer>
                    <Table size="small">
                      <>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              {t(
                                'coach_payment_rule_groups.fields.private_service_name',
                              )}
                            </TableCell>
                            <TableCell>
                              {t(
                                'coach_payment_rule_groups.fields.coach_payment_rule',
                              )}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {private_slots_coach_payment_rules.map(
                            (
                              privateSlot: {
                                private_slot: number;
                                coach_payment_rule: number;
                              },
                              i: number,
                            ) => (
                              <>
                                <TableRow>
                                  <TableCell>
                                    <PrivateSlotSelectorStyled
                                      id={`private_slots_coach_payment_rules.${i}.private_slot`}
                                      privateServiceList={privateServices}
                                      selectedServices={[
                                        privateSlot.private_slot,
                                      ]}
                                      placeholder={t(
                                        'coach_payment_rule_groups.fields.private_service_name',
                                      )}
                                      onChange={(item: {
                                        value: number;
                                        label: string;
                                      }) => {
                                        setFieldValue(
                                          `private_slots_coach_payment_rules.${i}.private_slot`,
                                          item.value,
                                        );
                                      }}
                                      noMulti
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <CoachPaymentRuleSelectorStyled
                                      id="private_service_coach_payment_rule"
                                      coachPaymentRulesList={
                                        rulesByKind[
                                          COACH_PERFORMANCE_FOR_APPOINTMENT
                                        ]
                                      }
                                      selectedRules={[
                                        privateSlot.coach_payment_rule,
                                      ]}
                                      placeholder={t('paymentRules:label')}
                                      onChange={(item: {
                                        value: number;
                                        label: string;
                                      }) => {
                                        setFieldValue(
                                          `private_slots_coach_payment_rules.${i}.coach_payment_rule`,
                                          item.value,
                                        );
                                      }}
                                      noMulti
                                    />
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    padding="none"
                                    size="small"
                                  >
                                    <IconButton
                                      onClick={() => remove(i)}
                                      aria-label="Delete"
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>

                                {props.errors &&
                                  (props.errors
                                    .private_slots_coach_payment_rules ||
                                    (props.errors.private_slot_unicity &&
                                      props.errors.private_slot_unicity[
                                        i
                                      ])) && (
                                    <TableRow>
                                      <TableCell>
                                        {!props.errors.private_slot_unicity && (
                                          <AlertError
                                            name={`private_slots_coach_payment_rules.${i}.private_slot`}
                                          />
                                        )}
                                        {props.errors.private_slot_unicity && (
                                          <Typography
                                            variant="caption"
                                            color="error"
                                          >
                                            {t(
                                              props.errors.private_slot_unicity[
                                                i
                                              ],
                                            )}
                                          </Typography>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {!props.errors.private_slot_unicity && (
                                          <AlertError
                                            name={`private_slots_coach_payment_rules.${i}.coach_payment_rule`}
                                          />
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  )}
                              </>
                            ),
                          )}
                        </TableBody>
                        <TableFooter>
                          <Button
                            aria-haspopup="true"
                            color="secondary"
                            onClick={() => {
                              setFieldValue(
                                `private_slots_coach_payment_rules`,
                                private_slots_coach_payment_rules.concat({
                                  private_slot: null,
                                  coach_payment_rule: null,
                                }),
                              );
                            }}
                          >
                            <AddIcon color="secondary" />
                            {t(
                              'coach_payment_rule_groups.fields.addPrivateSlot',
                            )}
                          </Button>
                        </TableFooter>
                      </>
                    </Table>
                  </TableContainer>
                )}
              </FieldArray>
            </Collapse>
          </Grid>

          <Grid item xs={12}>
            <div className={classes.spaceDivider} />
            <div className={classes.row}>
              <Typography variant="h6">
                {t('coach_payment_rule_groups.subtitle.coaches')}
              </Typography>
              <IconButton onClick={toogleCoachSection}>
                {openCoachSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>
            <Collapse in={openCoachSection}>
              <FieldArray name="associated_coach">
                {({
                  push,
                  remove,
                  form: {
                    values: { associated_coach },
                  },
                }) => (
                  <>
                    <CoachSelector
                      coaches={associated_coaches.filter(
                        (coach) =>
                          !associated_coach.includes(
                            coach.associated_coach_id,
                          ) && !coach.coach_payment_rule_group_id,
                      )}
                      nullCurrentValue
                      selectedCoaches={[]}
                      selectOption={(ev) => {
                        if (ev.length) push(ev[0].value);
                      }}
                      isMulti
                      isClearable
                      associatedCoachOutput
                    />
                    <List>
                      {associated_coach.map(
                        (associatedCoachId: number, i: number) => (
                          <CoachListItem
                            divider
                            coach={associated_coaches.find(
                              (coach: Coach) =>
                                coach.associated_coach_id === associatedCoachId,
                            )}
                            deleteCoach={() => remove(i)}
                          />
                        ),
                      )}
                    </List>
                  </>
                )}
              </FieldArray>
            </Collapse>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export const CoachPaymentRuleGroupFormHOC = withFormik({
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
        private_slots_coach_payment_rules: lodash.compact(
          initial.private_slots_coach_payment_rules,
        ),
        associated_coach: lodash.compact(
          initial.associated_coach.map((ass: Coach) => ass.associated_coach_id),
        ),
        session_coach_payment_rule: initial.session_coach_payment_rule
          ? initial.session_coach_payment_rule.id
          : null,
        workshop_coach_payment_rule: initial.workshop_coach_payment_rule
          ? initial.workshop_coach_payment_rule.id
          : null,
        private_service_coach_payment_rule:
          initial.private_service_coach_payment_rule
            ? initial.private_service_coach_payment_rule.id
            : null,
      };
    }
    return {
      name: '',
      session_coach_payment_rule: null,
      workshop_coach_payment_rule: null,
      private_service_coach_payment_rule: null,
      private_slots_coach_payment_rules: [],
      associated_coach: [],
    };
  },
  validationSchema: CoachPaymentRuleGroupSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    onSubmit(values, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});
const styles = (theme: MaterialTheme) => ({
  container: {
    padding: theme.spacing(1),
  },
  spaceDivider: {
    marginTop: theme.spacing(3),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  paymentRuleRow: {
    marginBottom: theme.spacing(1),
  },
  errorCell: {
    padding: 0,
    display: 'flex',
  },
});
export default compose<any, OwnProps>(
  withTranslation(['paymentRules']),
  withStyles(styles),
)(CoachPaymentRuleGroupFormFields);
