import React, { useCallback, useMemo, useState } from 'react';
import compact from 'lodash/compact';
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
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY,
  COACH_PAYMENT_RULE_FOR_WORKSHOP,
} from '@bsport/common/lib/master-data/coach_payment_rule.js';
// @ts-expect-error
import { TextField, AlertError } from '../../../../components/forms';

// @ts-expect-error
import CoachPaymentRuleGroupSchema from './schemaValidation';
import CoachListItem from '../../../associated-coach/components/CoachListItem.component';
import type { Coach } from '../../../associated-coach/types';
import type {
  CoachPaymentRule,
  CoachPaymentRuleGroup,
  CoachPaymentRuleGroupAPI,
} from '../../types';
import type { MaterialStyleType } from '../../../../utils/types';
import type { PrivateServiceWithSlots } from '../../../private-service/types';
import CoachPaymentRuleSelectorStyled from '../coach-payment-rule-selector/CoachPaymentRuleSelectorStyled.component';
import PrivateSlotSelectorStyled from '../PrivateSlotSelectorStyled.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';

type OwnProps = {
  initial: CoachPaymentRuleGroupAPI & CoachPaymentRuleGroup;
  privateServices: Array<PrivateServiceWithSlots>;
  rulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  setFieldValue: (key: string, value: any) => void;
  errors: any;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type CoachOption = {
  label: string;
  onCoachSelected?: (coachId: number) => void;
  coach: Coach;
  value: number;
};

const CoachOptionItem: React.FC<OptionPropsWithData<CoachOption>> = (props) => (
  <CoachListItem divider {...props.data} />
);

export function CoachPaymentRuleGroupFormFields({
  t,
  classes,
  errors,
  rulesByKind,
  setFieldValue,
  privateServices,
  initial,
}: Props) {
  const initialAssociatedCoaches = useMemo(
    () => initial?.associated_coach?.flat() ?? [],
    [initial?.associated_coach],
  );

  const [associatedCoachesState, setAssociatedCoaches] = useState(
    initialAssociatedCoaches,
  );
  const [archivedCoachesState, setArchivedCoaches] = useState([]);
  // Used to close the menu on selection
  const [isCoachMenuOpen, setIsCoachMenuOpen] = useState(false);
  const [openPrivateSlotSection, setOpenPrivateSlotSection] = useState(false);
  const [openCoachSection, setOpenCoachSection] = useState(false);

  const tooglePrivateSlotSection = useCallback(
    () => setOpenPrivateSlotSection(!openPrivateSlotSection),
    [openPrivateSlotSection],
  );
  const toogleCoachSection = useCallback(
    () => setOpenCoachSection(!openCoachSection),
    [openCoachSection],
  );
  const closeCoachMenu = useCallback(() => {
    setIsCoachMenuOpen(false);
  }, []);
  const openCoachMenu = useCallback(() => {
    setIsCoachMenuOpen(true);
  }, []);

  const removeCoaches = useCallback(
    (
        removeFromForm: (index: number) => void,
        associatedCoach: Coach,
        index: number,
      ) =>
      () => {
        removeFromForm(index);
        setArchivedCoaches((previousCoaches) => {
          return [...previousCoaches, associatedCoach];
        });
        setAssociatedCoaches((previousCoaches) =>
          previousCoaches.filter(
            (coach: Coach) =>
              coach.associated_coach_id !== associatedCoach.associated_coach_id,
          ),
        );
      },
    [],
  );

  const restoreCoaches = useCallback(
    (pushIntoForm: (archivedCoachId: number) => void, archivedCoach: Coach) =>
      () => {
        pushIntoForm(archivedCoach.associated_coach_id);
        setAssociatedCoaches((previousCoaches) => {
          return [...previousCoaches, archivedCoach];
        });
        setArchivedCoaches((previousCoaches) =>
          previousCoaches.filter(
            (coach: Coach) =>
              coach.associated_coach_id !== archivedCoach.associated_coach_id,
          ),
        );
      },
    [],
  );

  const onCoachSelected = useCallback(
    (coach: Coach, pushIntoForm: (associatedCoachId: number) => void) => () => {
      setAssociatedCoaches((previousCoaches) => [...previousCoaches, coach]);
      pushIntoForm(coach.associated_coach_id);
      setIsCoachMenuOpen(false);
    },
    [],
  );

  const coachOptionsFormatter = useCallback(
    (pushIntoForm: (associatedCoachId: number) => void) =>
      (coaches: Coach[]): CoachOption[] =>
        coaches.map((coach) => {
          return {
            label: coach.name,
            coach,
            onCoachSelected: onCoachSelected(coach, pushIntoForm),
            value: coach.id,
          };
        }),
    [onCoachSelected],
  );
  return (
    <>
      <Grid container spacing={2}>
        <div className={classes.container}>
          <Typography variant="body1">
            {t('coach_payment_rule_groups.subtitle.helper')}
          </Typography>
          <div className={classes.spaceDivider} />
          <TextField
            fullWidth
            required
            id="textfield_coach_payment_rule_group"
            label={t('coach_payment_rules.name')}
            name="name"
          />
          <AlertError name="name" />
        </div>

        <Grid item xs={12}>
          <Typography variant="h6">
            {t('coach_payment_rule_groups.subtitle.default')}
          </Typography>
          <Grid container>
            <Grid item className={classes.paymentRuleRow} xs={8}>
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
                      {/* @ts-expect-error */}
                      <CoachPaymentRuleSelectorStyled
                        isClearable
                        noMulti
                        coachPaymentRulesList={rulesByKind[
                          COACH_PAYMENT_RULE_FOR_SESSION
                        ].concat(
                          rulesByKind[COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY],
                        )}
                        id="session_coach_payment_rule"
                        onChange={(item: { value: number; label: string }) => {
                          setFieldValue(
                            'session_coach_payment_rule',
                            item ? item.value : null,
                          );
                        }}
                        placeholder={t('paymentRules:label')}
                        selectedRules={[session_coach_payment_rule]}
                      />
                    </Grid>
                  </Grid>
                )}
              </FieldArray>
            </Grid>
            <Grid item className={classes.paymentRuleRow} xs={8}>
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
                      {/* @ts-expect-error */}
                      <CoachPaymentRuleSelectorStyled
                        isClearable
                        noMulti
                        coachPaymentRulesList={rulesByKind[
                          COACH_PAYMENT_RULE_FOR_SESSION
                        ].concat(rulesByKind[COACH_PAYMENT_RULE_FOR_WORKSHOP])}
                        id="workshop_coach_payment_rule"
                        onChange={(item: { value: number; label: string }) => {
                          setFieldValue(
                            'workshop_coach_payment_rule',
                            item ? item.value : null,
                          );
                        }}
                        placeholder={t('paymentRules:label')}
                        selectedRules={[workshop_coach_payment_rule]}
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
                      {/* @ts-expect-error */}
                      <CoachPaymentRuleSelectorStyled
                        isClearable
                        noMulti
                        coachPaymentRulesList={
                          rulesByKind[COACH_PAYMENT_RULE_FOR_APPOINTMENT]
                        }
                        id="private_service_coach_payment_rule"
                        onChange={(item: { value: number; label: string }) => {
                          setFieldValue(
                            'private_service_coach_payment_rule',
                            item ? item.value : null,
                          );
                        }}
                        placeholder={t('paymentRules:label')}
                        selectedRules={[private_service_coach_payment_rule]}
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
                                      noMulti
                                      // @ts-expect-error
                                      id={`private_slots_coach_payment_rules.${i}.private_slot`}
                                      onChange={(item: {
                                        value: number;
                                        label: string;
                                      }) => {
                                        setFieldValue(
                                          `private_slots_coach_payment_rules.${i}.private_slot`,
                                          item.value,
                                        );
                                      }}
                                      placeholder={t(
                                        'coach_payment_rule_groups.fields.private_service_name',
                                      )}
                                      privateServiceList={privateServices}
                                      selectedServices={[
                                        privateSlot.private_slot,
                                      ]}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {/* @ts-expect-error */}
                                    <CoachPaymentRuleSelectorStyled
                                      noMulti
                                      coachPaymentRulesList={
                                        rulesByKind[
                                          COACH_PAYMENT_RULE_FOR_APPOINTMENT
                                        ]
                                      }
                                      id="private_service_coach_payment_rule"
                                      onChange={(item: {
                                        value: number;
                                        label: string;
                                      }) => {
                                        setFieldValue(
                                          `private_slots_coach_payment_rules.${i}.coach_payment_rule`,
                                          item.value,
                                        );
                                      }}
                                      placeholder={t('paymentRules:label')}
                                      selectedRules={[
                                        privateSlot.coach_payment_rule,
                                      ]}
                                    />
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    padding="none"
                                    size="small"
                                  >
                                    <IconButton
                                      aria-label="Delete"
                                      onClick={() => remove(i)}
                                    >
                                      <ClearIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>

                                {errors &&
                                  (errors.private_slots_coach_payment_rules ||
                                    (errors.private_slot_unicity &&
                                      errors.private_slot_unicity[i])) && (
                                    <TableRow>
                                      <TableCell>
                                        {!errors.private_slot_unicity && (
                                          <AlertError
                                            name={`private_slots_coach_payment_rules.${i}.private_slot`}
                                          />
                                        )}
                                        {errors.private_slot_unicity && (
                                          <Typography
                                            color="error"
                                            variant="caption"
                                          >
                                            {t(errors.private_slot_unicity[i])}
                                          </Typography>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {!errors.private_slot_unicity && (
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
                {({ push, remove }) => (
                  <>
                    <ObjectSearchComponent
                      additionalParams={{
                        disabled: false,
                        id__not_in: associatedCoachesState
                          .map((coach) => coach.associated_coach_id)
                          .concat(
                            archivedCoachesState.map(
                              (coach) => coach.associated_coach_id,
                            ),
                          ),
                        has_coach_payment_rule_group: false,
                      }}
                      components={{
                        Option: CoachOptionItem,
                      }}
                      menuIsOpen={isCoachMenuOpen}
                      onMenuClose={closeCoachMenu}
                      onMenuOpen={openCoachMenu}
                      optionsFormatter={coachOptionsFormatter(push)}
                      placeholder={t('coach:search')}
                      searchedObjectType="associated_coach"
                      variant="default"
                    />
                    <List>
                      {associatedCoachesState.map(
                        (associatedCoach: Coach, index: number) => (
                          <CoachListItem
                            key={associatedCoach.id}
                            divider
                            coach={associatedCoach}
                            deleteCoach={removeCoaches(
                              remove,
                              associatedCoach,
                              index,
                            )}
                          />
                        ),
                      )}
                    </List>

                    {(archivedCoachesState ?? []).length ? (
                      <List>
                        <Typography variant="h6">
                          {t(
                            'coach_payment_rule_groups.subtitle.removed_coaches',
                          )}
                        </Typography>
                        <List>
                          {archivedCoachesState.map((archivedCoach: Coach) => {
                            return (
                              <CoachListItem
                                key={archivedCoach.id}
                                divider
                                coach={archivedCoach}
                                isDisable={true}
                                restoreCoach={restoreCoaches(
                                  push,
                                  archivedCoach,
                                )}
                              />
                            );
                          })}
                        </List>
                      </List>
                    ) : null}
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
  // @ts-expect-error
  mapPropsToValues: ({ initial }) => {
    if (initial) {
      return {
        ...initial,
        private_slots_coach_payment_rules: compact(
          initial.private_slots_coach_payment_rules,
        ),
        associated_coach: compact(
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
  // @ts-expect-error
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
  // @ts-expect-error
  withStyles(styles),
)(CoachPaymentRuleGroupFormFields);
