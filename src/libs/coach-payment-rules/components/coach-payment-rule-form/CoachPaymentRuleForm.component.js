import lodash from 'lodash';
import React, { useState } from 'react';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { withFormik, FieldArray } from 'formik';

import withStyles from '@material-ui/core/styles/withStyles';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import ButtonBase from '@material-ui/core/ButtonBase';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  FIXED_BASE_REMUNERATION,
  PERCENTAGE_BASE_REMUNERATION,
  BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
  BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING,
  BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING,
  BONUS_COACH_PAYMENT_RULE_MARGIN_VALUE,
  COACH_PAYMENT_RULE_FOR_SESSION,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule';
import {
  TextField,
  PriceField,
  PercentField,
  CheckboxField,
  AlertError,
} from '../../../../components/forms';
import PopoverCoachPaymentRuleForm from '../PopoverCoachPaymentRuleForm.component';
import PaymentPackSelector from '../../../payment-packs/components/PaymentPackSelector.component';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';
import type { CoachPaymentRule } from '../../types';

import {
  bonusCoachPaymentRuleConstructor,
  TestBonusesIntervalConformity,
} from '../../utils';
import coachPaymentRuleFieldsSchema from './schemaValidation';
import mapInitalPropsToValues from './mapPropsToValues';

type Props = { t: TFunction, classes: * } & CoachPaymentRule & {
    onSubmit: (CoachPaymentRule) => void,
  };
export function CoachPaymentRuleFields(props: Props) {
  const { t, classes, setFieldValue } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [bonusCreationApplicability, setBonusCreationApplicability] = useState(
    null,
  );
  const handlePopover = (event, applicability) => {
    if (
      anchorEl === null ||
      (anchorEl !== null && anchorEl !== event.currentTarget)
    ) {
      setAnchorEl(event.currentTarget);
      setBonusCreationApplicability(applicability);
    } else {
      setAnchorEl(null);
      setBonusCreationApplicability(null);
    }
  };
  const bonusesSortByApplicability = {
    [BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING]:
      props.values.bonus_for_confirmed_bookings,
    [BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING]:
      props.values.bonus_for_cancelled_bookings,
  };
  return (
    <div>
      <PopoverCoachPaymentRuleForm
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        bonusesSortByApplicability={bonusesSortByApplicability}
        bonusCreationApplicability={bonusCreationApplicability}
        id={props.values.id}
        t={t}
      />
      <TextField
        id="textfield_coach_payment_rule_name"
        name="name"
        label={t('coach_payment_rules.name')}
        fullWidth
        required
      />
      <AlertError name="name" />
      <Typography variant="h6">
        {t('coach_payment_rules.forConfirmedBookings')}
      </Typography>
      <Typography variant="subtitle1">
        {t('coach_payment_rules.calculationMethod')}
      </Typography>
      <FormControlLabel
        control={
          <Radio
            id="checkbox_base_remuneration"
            checked={
              props.values.base_remuneration_type_confirmed ===
              FIXED_BASE_REMUNERATION
            }
            onClick={() => {
              setFieldValue(
                'base_remuneration_type_confirmed',
                FIXED_BASE_REMUNERATION,
              );
              setFieldValue('percentage_base_confirmed_bookings', 0);
            }}
          />
        }
        label={t('coach_payment_rules.base_remuneration')}
      />

      <Collapse
        in={
          props.values.base_remuneration_type_confirmed ===
          FIXED_BASE_REMUNERATION
        }
      >
        <PriceField
          id="pricefield_base_remuneration"
          name="base_remuneration"
          fullWidth
        />
        <AlertError name="base_remuneration" />
      </Collapse>
      <FormControlLabel
        control={
          <Radio
            id="checkbox_percentage_base"
            checked={
              props.values.base_remuneration_type_confirmed ===
              PERCENTAGE_BASE_REMUNERATION
            }
            onClick={() => {
              setFieldValue(
                'base_remuneration_type_confirmed',
                PERCENTAGE_BASE_REMUNERATION,
              );
              setFieldValue('base_remuneration', 0);
            }}
          />
        }
        label={t('coach_payment_rules.percentage_base')}
      />
      <Collapse
        in={
          props.values.base_remuneration_type_confirmed ===
          PERCENTAGE_BASE_REMUNERATION
        }
      >
        <PercentField
          step={0.1}
          id="percentfield_percentage_base"
          name="percentage_base_confirmed_bookings"
          fullWidth
        />
        <AlertError name="percentage_base_confirmed_bookings" />
      </Collapse>

      {props.values.kind === COACH_PAYMENT_RULE_FOR_SESSION && (
        <React.Fragment>
          <Typography variant="subtitle2">
            {t('coach_payment_rules.Bonuses.bonus_rules')}
          </Typography>
          <FieldArray name="bonus_for_confirmed_bookings">
            {({
              remove,
              replace,
              form: {
                values: { bonus_for_confirmed_bookings },
              },
            }) => (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow classes={lodash.pick(classes, ['root'])}>
                      <TableCell colSpan={2} className={classes.dense}>
                        {t('coach_payment_rules.Bonuses.bookingsThresholds')}
                      </TableCell>
                      <TableCell colSpan={2} className={classes.dense}>
                        {t('coach_payment_rules.Bonuses.bonus')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bonus_for_confirmed_bookings.map((bonus, i) => (
                      <React.Fragment>
                        <TableRow
                          key={bonus.id}
                          classes={lodash.pick(classes, ['root'])}
                        >
                          <TableCell
                            align="left"
                            padding="none"
                            size="small"
                            className={classes.dense}
                          >
                            <TextField
                              type="number"
                              name={`bonus_for_confirmed_bookings.${i}.lower_interval`}
                              onBlur={() =>
                                replace(i, bonus_for_confirmed_bookings[i])
                              }
                              InputProps={{
                                inputProp: {
                                  min:
                                    i - 1 > 0
                                      ? bonus_for_confirmed_bookings[i - 1]
                                          .lower_interval
                                      : 0,
                                },
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {t('coach_payment_rules.Bonuses.from')}
                                  </InputAdornment>
                                ),
                              }}
                              margin="none"
                              className={classes.tableCell}
                              size="small "
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            padding="none"
                            size="small"
                            className={classes.dense}
                          >
                            <TextField
                              type="number"
                              name={`bonus_for_confirmed_bookings.${i}.upper_interval`}
                              onBlur={() =>
                                replace(i, bonus_for_confirmed_bookings[i])
                              }
                              InputProps={{
                                inputProp: {
                                  min: bonus.lower_interval + 1,
                                },
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {t('coach_payment_rules.Bonuses.to')}
                                  </InputAdornment>
                                ),
                              }}
                              margin="none"
                              className={classes.tableCell}
                              size="small"
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            padding="none"
                            size="small"
                            className={classes.dense}
                          >
                            <PriceField
                              name={`bonus_for_confirmed_bookings.${i}.bonus`}
                              margin="none"
                              className={classes.tableCell}
                              size="small "
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            padding="none"
                            size="small"
                            className={classes.dense}
                          >
                            {bonus.kind ===
                            BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING ? (
                              <Typography variant="subtitle2">
                                {t(
                                  'coach_payment_rules.Bonuses.forEachBooking',
                                )}
                              </Typography>
                            ) : null}
                          </TableCell>
                          <TableCell
                            align="left"
                            padding="none"
                            size="small"
                            className={classes.dense}
                          >
                            <IconButton
                              onClick={() => remove(i)}
                              aria-label="Delete"
                            >
                              <ClearIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow key={`error${bonus.id}`}>
                          {props.errors.bonus_for_confirmed_bookings &&
                          props.errors.bonus_for_confirmed_bookings[i] ? (
                            <TableCell
                              key={`error${bonus.id}`}
                              align="center"
                              padding="none"
                              size="small"
                              colSpan={5}
                              className={classes.dense}
                            >
                              <AlertError
                                name={`bonus_for_confirmed_bookings.${i}.lower_interval`}
                              />
                              <AlertError
                                name={`bonus_for_confirmed_bookings.${i}.upper_interval`}
                              />
                              <AlertError
                                name={`bonus_for_confirmed_bookings.${i}.interval`}
                              />
                              <AlertError
                                name={`bonus_for_confirmed_bookings.${i}.bonus`}
                              />
                            </TableCell>
                          ) : null}
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableCell colSpan={5}>
                      {!TestBonusesIntervalConformity(
                        bonus_for_confirmed_bookings,
                      ) ? (
                        <Typography variant="body2" color="error">
                          {t('coach_payment_rules.Errors.invalideIntervals')}
                        </Typography>
                      ) : null}
                    </TableCell>
                  </TableFooter>
                  <ButtonBase
                    aria-haspopup="true"
                    aria-owns={anchorEl ? 'bonus-popover' : undefined}
                    onClick={(event) =>
                      handlePopover(
                        event,
                        BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
                      )
                    }
                    className={classes.footerAddButton}
                  >
                    <AddIcon color="secondary" />
                    <Typography variant="subtitle2" color="secondary">
                      {t('coach_payment_rules.Bonuses.addBonus')}
                    </Typography>
                  </ButtonBase>
                </Table>
              </TableContainer>
            )}
          </FieldArray>
        </React.Fragment>
      )}

      <CheckboxField
        id="checkbox_add_remuneration_on_cancellation"
        name="remuneration_on_cancellation"
        label={t('coach_payment_rules.addRemunerationOnCancellation')}
        checked={props.values.remuneration_on_cancellation}
        onClick={() => {
          setFieldValue(
            'remuneration_on_cancellation',
            !props.values.remuneration_on_cancellation,
          );
          setFieldValue('exclude_cancelled_from_confirmed_bookings', false);
          setFieldValue('bonus_for_cancelled_bookings', []);
          setFieldValue('percentage_base_cancelled_bookings', 0);
          setFieldValue(
            'base_remuneration_type_cancellation',
            FIXED_BASE_REMUNERATION,
          );
          setFieldValue('base_remuneration_for_cancellation', 0);
        }}
      />
      <CheckboxField
        id="checkbox_exclude_cancelled_from_confirmed_bookings"
        name="exclude_cancelled_from_confirmed_bookings"
        label={t('coach_payment_rules.differentRemunerationForCancellation')}
        disabled={!props.values.remuneration_on_cancellation}
        checked={
          props.values.exclude_cancelled_from_confirmed_bookings &&
          props.values.remuneration_on_cancellation
        }
        onClick={() => {
          setFieldValue(
            'exclude_cancelled_from_confirmed_bookings',
            !props.values.exclude_cancelled_from_confirmed_bookings,
          );
          if (!props.values.exclude_cancelled_from_confirmed_bookings) {
            setFieldValue('bonus_for_cancelled_bookings', []);
          }
        }}
      />
      <Collapse
        in={
          props.values.exclude_cancelled_from_confirmed_bookings &&
          props.values.remuneration_on_cancellation
        }
      >
        <AlertError name="exclude_cancelled_from_confirmed_bookings" />
        <Typography className={classes.cancellationTitle} variant="h6">
          {t('coach_payment_rules.forCancelledBookings')}
        </Typography>
        <Typography variant="subtitle1">
          {t('coach_payment_rules.calculationMethod')}
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Radio
                id="checkbox_base_remuneration"
                checked={
                  props.values.base_remuneration_type_cancellation ===
                  FIXED_BASE_REMUNERATION
                }
                onClick={() => {
                  setFieldValue(
                    'base_remuneration_type_cancellation',
                    FIXED_BASE_REMUNERATION,
                  );
                  setFieldValue('percentage_base_cancelled_bookings', 0);
                }}
              />
            }
            label={t('coach_payment_rules.base_remuneration')}
          />

          {props.values.kind === COACH_PAYMENT_RULE_FOR_SESSION && (
            <FormHelperText>
              {t('coach_payment_rules.cancellationBaseHelper')}
            </FormHelperText>
          )}

          {props.values.kind === COACH_PAYMENT_RULE_FOR_APPOINTMENT && (
            <Collapse
              in={
                props.values.base_remuneration_type_cancellation ===
                FIXED_BASE_REMUNERATION
              }
            >
              <PriceField
                id="pricefield_base_remuneration_for_cancellation"
                name="base_remuneration_for_cancellation"
                fullWidth
              />
              <AlertError name="base_remuneration_for_cancellation" />
            </Collapse>
          )}
        </FormGroup>
        <FormControlLabel
          control={
            <Radio
              id="checkbox_percentage_base"
              name="percentage_base"
              checked={
                props.values.base_remuneration_type_cancellation ===
                PERCENTAGE_BASE_REMUNERATION
              }
              onClick={() => {
                setFieldValue(
                  'base_remuneration_type_cancellation',
                  PERCENTAGE_BASE_REMUNERATION,
                );
                setFieldValue('base_remuneration_for_cancellation', 0);
              }}
            />
          }
          label={t('coach_payment_rules.percentage_base')}
        />
        <Collapse
          in={
            props.values.base_remuneration_type_cancellation ===
            PERCENTAGE_BASE_REMUNERATION
          }
        >
          <PercentField
            step={0.1}
            id="percentfield_percentage_base_cancellation"
            name="percentage_base_cancelled_bookings"
            fullWidth
          />
        </Collapse>
        {props.values.kind === COACH_PAYMENT_RULE_FOR_SESSION && (
          <React.Fragment>
            <Typography variant="subtitle2">
              {t('coach_payment_rules.Bonuses.bonus_rules')}
            </Typography>
            <FieldArray name="bonus_for_cancelled_bookings">
              {({
                remove,
                replace,
                form: {
                  values: { bonus_for_cancelled_bookings },
                },
              }) => (
                <div>
                  <Table size="small">
                    <TableHead>
                      <TableRow classes={lodash.pick(classes, ['root'])}>
                        <TableCell colSpan={2} className={classes.dense}>
                          {t('coach_payment_rules.Bonuses.bookingsThresholds')}
                        </TableCell>
                        <TableCell colSpan={2} className={classes.dense}>
                          {t('coach_payment_rules.Bonuses.bonus')}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bonus_for_cancelled_bookings.map((bonus, i) => (
                        <React.Fragment>
                          <TableRow
                            key={bonus.id}
                            classes={lodash.pick(classes, ['root'])}
                          >
                            <TableCell
                              align="left"
                              padding="none"
                              size="small"
                              className={classes.dense}
                            >
                              <TextField
                                type="number"
                                name={`bonus_for_cancelled_bookings.${i}.lower_interval`}
                                onBlur={() =>
                                  replace(i, bonus_for_cancelled_bookings[i])
                                }
                                InputProps={{
                                  inputProp: {
                                    min:
                                      i - 1 > 0
                                        ? bonus_for_cancelled_bookings[i - 1]
                                            .lower_interval
                                        : 0,
                                  },
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      {t('coach_payment_rules.Bonuses.from')}
                                    </InputAdornment>
                                  ),
                                }}
                                margin="none"
                                className={classes.tableCell}
                                size="small "
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              padding="none"
                              size="small"
                              className={classes.dense}
                            >
                              <TextField
                                type="number"
                                name={`bonus_for_cancelled_bookings.${i}.upper_interval`}
                                onBlur={() =>
                                  replace(i, bonus_for_cancelled_bookings[i])
                                }
                                InputProps={{
                                  inputProp: { min: bonus.lower_interval + 1 },
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      {t('coach_payment_rules.Bonuses.to')}
                                    </InputAdornment>
                                  ),
                                }}
                                margin="none"
                                className={classes.tableCell}
                                size="small"
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              padding="none"
                              size="small"
                              className={classes.dense}
                            >
                              <PriceField
                                name={`bonus_for_cancelled_bookings.${i}.bonus`}
                                margin="dense"
                                fullWidth
                                onBlur={() =>
                                  replace(i, bonus_for_cancelled_bookings[i])
                                }
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              padding="none"
                              size="small"
                              className={classes.dense}
                            >
                              {bonus.kind ===
                              BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING ? (
                                <Typography variant="subtitle2">
                                  {t(
                                    'coach_payment_rules.Bonuses.forEachBooking',
                                  )}
                                </Typography>
                              ) : null}
                            </TableCell>
                            <TableCell
                              align="left"
                              padding="none"
                              size="small"
                              className={classes.dense}
                            >
                              <IconButton
                                onClick={() => remove(i)}
                                aria-label="Delete"
                              >
                                <ClearIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          <TableRow key={`error${bonus.id}`}>
                            {props.errors.bonus_for_cancelled_bookings &&
                            props.errors.bonus_for_cancelled_bookings[i] ? (
                              <TableCell
                                key={`error${bonus.id}`}
                                align="center"
                                padding="none"
                                size="small"
                                colSpan={5}
                                className={classes.dense}
                              >
                                <AlertError
                                  name={`bonus_for_cancelled_bookings.${i}.lower_interval`}
                                />
                                <AlertError
                                  name={`bonus_for_cancelled_bookings.${i}.upper_interval`}
                                />
                                <AlertError
                                  name={`bonus_for_cancelled_bookings.${i}.interval`}
                                />
                                <AlertError
                                  name={`bonus_for_cancelled_bookings.${i}.bonus`}
                                />
                              </TableCell>
                            ) : null}
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableCell colSpan={5}>
                        {!TestBonusesIntervalConformity(
                          bonus_for_cancelled_bookings,
                        ) ? (
                          <Typography variant="body2" color="error">
                            {t('coach_payment_rules.Errors.invalideIntervals')}
                          </Typography>
                        ) : null}
                      </TableCell>
                    </TableFooter>
                    <ButtonBase
                      aria-haspopup="true"
                      aria-owns={anchorEl ? 'bonus-popover' : undefined}
                      onClick={(event) =>
                        handlePopover(
                          event,
                          BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING,
                        )
                      }
                      className={classes.footerAddButton}
                    >
                      <AddIcon color="secondary" />
                      <Typography variant="subtitle2" color="secondary">
                        {t('coach_payment_rules.Bonuses.addBonus')}
                      </Typography>
                    </ButtonBase>
                  </Table>
                </div>
              )}
            </FieldArray>
          </React.Fragment>
        )}
      </Collapse>
      <Typography className={classes.limitsTitle} variant="h6">
        {t('coach_payment_rules.remunerationLimits')}
      </Typography>
      <PriceField
        id="min_remuneration"
        name="min_remuneration"
        label={t('coach_payment_rules.min_remuneration')}
        required
        fullWidth
      />
      <AlertError name="min_remuneration" />
      <PriceField
        id="max_remuneration"
        name="max_remuneration"
        label={t('coach_payment_rules.max_remuneration')}
        required
        fullWidth
      />
      <AlertError name="max_remuneration" />
      <FormGroup>
        <CheckboxField
          id="checkbox_taxe_rate"
          name="checkbox_taxe_rate"
          label={t('coach_payment_rules.taxe_rate')}
          checked={props.values.include_taxe}
          onClick={() =>
            setFieldValue('include_taxe', !props.values.include_taxe)
          }
        />
        {!props.values.include_taxe && (
          <FormHelperText>
            {t('coach_payment_rules.taxeConciseHelper')}
          </FormHelperText>
        )}
      </FormGroup>
      <Collapse in={props.values.include_taxe}>
        <PercentField
          step={0.1}
          id="percentageField_taxe_rate"
          name="tax_rate"
          label={t('coach_payment_rules.add_taxe_rate')}
          fullWidth
        />
        <AlertError name="tax_rate" />
        <FormHelperText>
          {t('coach_payment_rules.taxeLongHelper')}
        </FormHelperText>
      </Collapse>
      {props.values.kind === COACH_PAYMENT_RULE_FOR_SESSION && (
        <React.Fragment>
          <Typography className={classes.limitsTitle} variant="h6">
            {t('coach_payment_rules.excludePaymentPack')}
          </Typography>
          <FieldArray name="excluded_payment_packs">
            {({
              push,
              remove,
              form: {
                values: { excluded_payment_packs },
              },
            }) => (
              <div>
                <PaymentPackSelector
                  paymentPacks={props.paymentPackList}
                  nullCurrentValue
                  helperText={props.t(
                    'coach_payment_rules.paymentPackPlaceHolder',
                  )}
                  onChange={(id) => {
                    if (id) push(id);
                  }}
                />
                {excluded_payment_packs.map((id, i) => (
                  <PaymentPackListItem
                    key={`${id}-${i}`}
                    dense
                    pack={props.paymentPackList.find((pp) => pp.id === id)}
                    onDelete={() => remove(i)}
                  />
                ))}
              </div>
            )}
          </FieldArray>
        </React.Fragment>
      )}
    </div>
  );
}

const styles = (theme) => ({
  containe: {
    padding: theme.spacing(1),
  },
  footerAddButton: {
    padding: theme.spacing(1),
  },
  cancellationTitle: {
    paddingTop: theme.spacing(1),
  },
  limitsTitle: {
    paddingTop: theme.spacing(1),
  },
  flexFooter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tableCell: {
    width: '50%',
  },
  dense: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

export const CoachPaymentRuleFormHoc = withFormik({
  mapPropsToValues: ({ initial, ruleTypeCreation }) =>
    mapInitalPropsToValues(initial, ruleTypeCreation),
  validationSchema: coachPaymentRuleFieldsSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting }) => {
    const valuesWithConcatBonuses = {
      ...values,
      ...(!values.exclude_cancelled_from_confirmed_bookings &&
      !values.remuneration_on_cancellation
        ? {
            exclude_cancelled_from_confirmed_bookings: true,
          }
        : {
            exclude_cancelled_from_confirmed_bookings:
              values.exclude_cancelled_from_confirmed_bookings,
          }),
      ...(values.exclude_cancelled_from_confirmed_bookings &&
      values.remuneration_on_cancellation
        ? {
            bonus_coach_payment: values.bonus_for_cancelled_bookings.concat(
              values.kind === COACH_PAYMENT_RULE_FOR_SESSION
                ? values.bonus_for_confirmed_bookings
                : [],
            ),
          }
        : {
            bonus_coach_payment:
              values.kind === COACH_PAYMENT_RULE_FOR_SESSION
                ? values.bonus_for_confirmed_bookings
                : [],
          }),
    };
    if (
      values.base_remuneration_type_confirmed === PERCENTAGE_BASE_REMUNERATION
    ) {
      valuesWithConcatBonuses.base_remuneration = 0;
      valuesWithConcatBonuses.bonus_coach_payment.push(
        bonusCoachPaymentRuleConstructor(values.id, {
          // eslint-disable-next-line
          applicability:
            BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
          kind: BONUS_COACH_PAYMENT_RULE_MARGIN_VALUE,
          bonus: values.percentage_base_confirmed_bookings,
          lower_interval: 1,
        }),
      );
    }
    if (
      values.base_remuneration_type_cancellation ===
        PERCENTAGE_BASE_REMUNERATION &&
      values.exclude_cancelled_from_confirmed_bookings
    ) {
      valuesWithConcatBonuses.bonus_coach_payment.push(
        bonusCoachPaymentRuleConstructor(values.id, {
          // eslint-disable-next-line
          applicability:
            BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING,
          kind: BONUS_COACH_PAYMENT_RULE_MARGIN_VALUE,
          bonus: values.percentage_base_cancelled_bookings,
          lower_interval: 1,
        }),
      );
    }
    if (values.include_taxe === false) {
      valuesWithConcatBonuses.tax_rate = 0;
    }
    if (values.kind === COACH_PAYMENT_RULE_FOR_SESSION) {
      valuesWithConcatBonuses.base_remuneration_for_cancellation = 0;
    }
    const {
      base_remuneration_type_confirmed,
      base_remuneration_type_cancellation,
      remuneration_on_cancellation,
      include_taxe,
      bonus_for_confirmed_bookings,
      bonus_for_cancelled_bookings,
      coaches,
      percentage_base_confirmed_bookings,
      ...cleanedValue
    } = valuesWithConcatBonuses;
    onSubmit(cleanedValue, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
    });
  },
});

export default compose(
  withTranslation(['paymentRules']),
  withStyles(styles),
)(CoachPaymentRuleFields);
