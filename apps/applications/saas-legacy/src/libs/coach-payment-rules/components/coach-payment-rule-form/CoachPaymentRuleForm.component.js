import pick from 'lodash/pick';
import React, { useState } from 'react';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import { withFormik, FieldArray } from 'formik';

import withStyles from '@material-ui/core/styles/withStyles';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
import Button from '@material-ui/core/Button';
import CheckBox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  FIXED_BASE_REMUNERATION,
  BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
  BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING,
  BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING,
  BONUS_COACH_PAYMENT_RULE_MARGIN_VALUE,
  COACH_PAYMENT_RULE_FOR_APPOINTMENT,
} from '@bsport/common/lib/master-data/coach_payment_rule.js';
import InfoBox from '#src/components/box/InfoBox.component';
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
import { COACH_PAYMENT_RULE_FOR_ACTIVITIES } from '../../constants';

type Props = { t: TFunction, classes: any } & CoachPaymentRule & {
    onSubmit: (CoachPaymentRule) => void,
  };

export function CoachPaymentRuleFields(props: Props) {
  const { t, classes, setFieldValue } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [bonusCreationApplicability, setBonusCreationApplicability] =
    useState(null);
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

  const [openLimitSection, setOpenLimitSection] = React.useState(false);
  const [openExcludePaymentPack, setOpenExcludePaymentPack] =
    React.useState(false);
  const toogleLimitSection = () => setOpenLimitSection(!openLimitSection);
  const toogleExcludePaymentPack = () =>
    setOpenExcludePaymentPack(!openExcludePaymentPack);
  return (
    <div>
      <PopoverCoachPaymentRuleForm
        anchorEl={anchorEl}
        bonusCreationApplicability={bonusCreationApplicability}
        bonusesSortByApplicability={bonusesSortByApplicability}
        id={props.values.id}
        setAnchorEl={setAnchorEl}
      />
      <TextField
        fullWidth
        required
        id="textfield_coach_payment_rule_name"
        label={t('coach_payment_rules.name')}
        name="name"
      />
      <AlertError name="name" />
      {COACH_PAYMENT_RULE_FOR_ACTIVITIES.includes(props.values.kind) && (
        <React.Fragment>
          <FormControlLabel
            control={
              <CheckBox
                checked={props.values.add_overall_base_remuneration}
                id="checkbox_base_remuneration"
                name="add_overall_base_remuneration"
                onClick={() => {
                  setFieldValue(
                    'add_overall_base_remuneration',
                    !props.values.add_overall_base_remuneration,
                  );
                  setFieldValue('base_remuneration', 0);
                }}
              />
            }
            label={t('coach_payment_rules.set_base_remuneration')}
          />
          <FormHelperText>
            {t('coach_payment_rules.base_remuneration_helper')}
          </FormHelperText>
          <Collapse in={props.values.add_overall_base_remuneration}>
            <PriceField
              fullWidth
              id="pricefield_base_remuneration"
              name="base_remuneration"
            />
            <AlertError name="base_remuneration" />
          </Collapse>
        </React.Fragment>
      )}
      <div className={classes.spaceDivider} />
      <Typography variant="h6">
        {t('coach_payment_rules.forConfirmedBookings')}
      </Typography>
      {props.values.kind === COACH_PAYMENT_RULE_FOR_APPOINTMENT && (
        <React.Fragment>
          <FormControlLabel
            control={
              <CheckBox
                checked={props.values.add_overall_base_remuneration}
                id="checkbox_base_remuneration"
                name="add_overall_base_remuneration"
                onClick={() => {
                  setFieldValue(
                    'add_overall_base_remuneration',
                    !props.values.add_overall_base_remuneration,
                  );
                  setFieldValue('base_remuneration', 0);
                }}
              />
            }
            label={t('coach_payment_rules.set_base_remuneration')}
          />
          <Collapse in={props.values.add_overall_base_remuneration}>
            <PriceField
              fullWidth
              id="pricefield_base_remuneration"
              name="base_remuneration"
            />
            <AlertError name="base_remuneration" />
          </Collapse>
        </React.Fragment>
      )}
      <FormControlLabel
        control={
          <CheckBox
            checked={props.values.add_percentage_base_confirmed_bookings}
            id="checkbox_percentage_base"
            name="add_percentage_base_confirmed_bookings"
            onClick={() => {
              setFieldValue(
                'add_percentage_base_confirmed_bookings',
                !props.values.add_percentage_base_confirmed_bookings,
              );
              setFieldValue('percentage_base_confirmed_bookings', 0);
            }}
          />
        }
        label={t('coach_payment_rules.percentage_base')}
      />
      <Collapse in={props.values.add_percentage_base_confirmed_bookings}>
        <PercentField
          fullWidth
          id="percentfield_percentage_base"
          name="percentage_base_confirmed_bookings"
          step={0.1}
        />
        <AlertError name="percentage_base_confirmed_bookings" />
      </Collapse>

      {COACH_PAYMENT_RULE_FOR_ACTIVITIES.includes(props.values.kind) && (
        <React.Fragment>
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
                  {bonus_for_confirmed_bookings.length > 0 && (
                    <React.Fragment>
                      <Typography variant="subtitle2">
                        {t('coach_payment_rules.Bonuses.bonus_rules')}
                      </Typography>
                      <TableHead>
                        <TableRow classes={pick(classes, ['root'])}>
                          <TableCell className={classes.dense} colSpan={2}>
                            {t(
                              'coach_payment_rules.Bonuses.bookingsThresholds',
                            )}
                          </TableCell>
                          <TableCell className={classes.dense} colSpan={2}>
                            {t('coach_payment_rules.Bonuses.bonus')}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bonus_for_confirmed_bookings.map((bonus, i) => (
                          <React.Fragment>
                            <TableRow
                              key={bonus.id}
                              classes={pick(classes, ['root'])}
                            >
                              <TableCell
                                align="left"
                                className={classes.dense}
                                padding="none"
                                size="small"
                              >
                                <TextField
                                  className={classes.tableCell}
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
                                  name={`bonus_for_confirmed_bookings.${i}.lower_interval`}
                                  onBlur={() =>
                                    replace(i, bonus_for_confirmed_bookings[i])
                                  }
                                  size="small "
                                  type="number"
                                />
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.dense}
                                padding="none"
                                size="small"
                              >
                                <TextField
                                  className={classes.tableCell}
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
                                  name={`bonus_for_confirmed_bookings.${i}.upper_interval`}
                                  onBlur={() =>
                                    replace(i, bonus_for_confirmed_bookings[i])
                                  }
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.dense}
                                padding="none"
                                size="small"
                              >
                                <PriceField
                                  className={classes.tableCell}
                                  margin="none"
                                  name={`bonus_for_confirmed_bookings.${i}.bonus`}
                                  size="small "
                                />
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.dense}
                                padding="none"
                                size="small"
                              >
                                {bonus.kind ===
                                BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING ? (
                                  <Typography variant="subtitle2">
                                    {t(
                                      'coach_payment_rules.Bonuses.forEachBooking',
                                    )}
                                  </Typography>
                                ) : (
                                  <Typography variant="subtitle2">
                                    {t(
                                      'coach_payment_rules.Bonuses.forInterval',
                                    )}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.dense}
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
                            <TableRow key={`error${bonus.id}`}>
                              {props.errors.bonus_for_confirmed_bookings &&
                              props.errors.bonus_for_confirmed_bookings[i] ? (
                                <TableCell
                                  key={`error${bonus.id}`}
                                  align="center"
                                  className={classes.dense}
                                  colSpan={5}
                                  padding="none"
                                  size="small"
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
                            <Typography color="error" variant="body2">
                              {t(
                                'coach_payment_rules.Errors.invalideIntervals',
                              )}
                            </Typography>
                          ) : null}
                        </TableCell>
                      </TableFooter>
                    </React.Fragment>
                  )}
                </Table>
                <Button
                  aria-haspopup="true"
                  aria-owns={anchorEl ? 'bonus-popover' : undefined}
                  className={classes.footerAddButton}
                  color="primary"
                  onClick={(event) =>
                    handlePopover(
                      event,
                      BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
                    )
                  }
                  variant="outlined"
                >
                  <AddIcon color="secondary" />
                  {t('coach_payment_rules.Bonuses.addBonus')}
                </Button>
              </TableContainer>
            )}
          </FieldArray>
        </React.Fragment>
      )}
      <div className={classes.spaceDivider} />

      <CheckboxField
        checked={props.values.remuneration_on_cancellation}
        id="checkbox_add_remuneration_on_cancellation"
        label={t('coach_payment_rules.addRemunerationOnCancellation')}
        name="remuneration_on_cancellation"
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
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={
                props.values.exclude_cancelled_from_confirmed_bookings &&
                props.values.remuneration_on_cancellation
              }
              disabled={!props.values.remuneration_on_cancellation}
              id="checkbox_exclude_cancelled_from_confirmed_bookings"
              name="exclude_cancelled_from_confirmed_bookings"
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
          }
          label={t('coach_payment_rules.differentRemunerationForCancellation')}
        />
      </FormGroup>
      <div className={classes.spaceDivider} />
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
        <FormGroup>
          {props.values.kind === COACH_PAYMENT_RULE_FOR_APPOINTMENT && (
            <React.Fragment>
              <FormControlLabel
                control={
                  <CheckBox
                    checked={
                      props.values.add_base_remuneration_for_cancellation
                    }
                    id="checkbox_base_remuneration"
                    name="add_base_remuneration_for_cancellation"
                    onClick={() => {
                      setFieldValue(
                        'add_base_remuneration_for_cancellation',
                        !props.values.add_base_remuneration_for_cancellation,
                      );
                      setFieldValue('base_remuneration_for_cancellation', 0);
                    }}
                  />
                }
                label={t('coach_payment_rules.set_base_remuneration')}
              />
              <Collapse
                in={props.values.add_base_remuneration_for_cancellation}
              >
                <PriceField
                  fullWidth
                  id="pricefield_base_remuneration_for_cancellation"
                  name="base_remuneration_for_cancellation"
                />
                <AlertError name="base_remuneration_for_cancellation" />
              </Collapse>
            </React.Fragment>
          )}
        </FormGroup>
        <FormControlLabel
          control={
            <CheckBox
              checked={props.values.add_percentage_base_cancelled_bookings}
              id="checkbox_percentage_base"
              name="add_percentage_base_cancelled_bookings"
              onClick={() => {
                setFieldValue(
                  'add_percentage_base_cancelled_bookings',
                  !props.values.add_percentage_base_cancelled_bookings,
                );
                setFieldValue('percentage_base_cancelled_bookings', 0);
              }}
            />
          }
          label={t('coach_payment_rules.percentage_base')}
        />
        <Collapse in={props.values.add_percentage_base_cancelled_bookings}>
          <PercentField
            fullWidth
            id="percentfield_percentage_base_cancellation"
            name="percentage_base_cancelled_bookings"
            step={0.1}
          />
        </Collapse>
        {COACH_PAYMENT_RULE_FOR_ACTIVITIES.includes(props.values.kind) && (
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
                  {bonus_for_cancelled_bookings.length > 0 && (
                    <React.Fragment>
                      <Typography variant="subtitle2">
                        {t('coach_payment_rules.Bonuses.bonus_rules')}
                      </Typography>
                      <TableHead>
                        <TableRow classes={pick(classes, ['root'])}>
                          <TableCell className={classes.dense} colSpan={2}>
                            {t(
                              'coach_payment_rules.Bonuses.bookingsThresholds',
                            )}
                          </TableCell>
                          <TableCell className={classes.dense} colSpan={2}>
                            {t('coach_payment_rules.Bonuses.bonus')}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bonus_for_cancelled_bookings.map((bonus, i) => (
                          <React.Fragment>
                            <TableRow
                              key={bonus.id}
                              classes={pick(classes, ['root'])}
                            >
                              <TableCell
                                align="left"
                                className={classes.dense}
                                padding="none"
                                size="small"
                              >
                                <TextField
                                  className={classes.tableCell}
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
                                  name={`bonus_for_cancelled_bookings.${i}.lower_interval`}
                                  onBlur={() =>
                                    replace(i, bonus_for_cancelled_bookings[i])
                                  }
                                  size="small "
                                  type="number"
                                />
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.dense}
                                padding="none"
                                size="small"
                              >
                                <TextField
                                  className={classes.tableCell}
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
                                  name={`bonus_for_cancelled_bookings.${i}.upper_interval`}
                                  onBlur={() =>
                                    replace(i, bonus_for_cancelled_bookings[i])
                                  }
                                  size="small"
                                  type="number"
                                />
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.dense}
                                padding="none"
                                size="small"
                              >
                                <PriceField
                                  fullWidth
                                  margin="dense"
                                  name={`bonus_for_cancelled_bookings.${i}.bonus`}
                                  onBlur={() =>
                                    replace(i, bonus_for_cancelled_bookings[i])
                                  }
                                />
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.dense}
                                padding="none"
                                size="small"
                              >
                                {bonus.kind ===
                                BONUS_COACH_PAYMENT_RULE_EVERY_BOOKING ? (
                                  <Typography variant="subtitle2">
                                    {t(
                                      'coach_payment_rules.Bonuses.forEachBooking',
                                    )}
                                  </Typography>
                                ) : (
                                  <Typography variant="subtitle2">
                                    {t(
                                      'coach_payment_rules.Bonuses.forInterval',
                                    )}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.dense}
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
                            <TableRow key={`error${bonus.id}`}>
                              {props.errors.bonus_for_cancelled_bookings &&
                              props.errors.bonus_for_cancelled_bookings[i] ? (
                                <TableCell
                                  key={`error${bonus.id}`}
                                  align="center"
                                  className={classes.dense}
                                  colSpan={5}
                                  padding="none"
                                  size="small"
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
                            <Typography color="error" variant="body2">
                              {t(
                                'coach_payment_rules.Errors.invalideIntervals',
                              )}
                            </Typography>
                          ) : null}
                        </TableCell>
                      </TableFooter>
                    </React.Fragment>
                  )}
                </Table>
                <Button
                  aria-haspopup="true"
                  aria-owns={anchorEl ? 'bonus-popover' : undefined}
                  className={classes.footerAddButton}
                  color="primary"
                  onClick={(event) =>
                    handlePopover(
                      event,
                      BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING,
                    )
                  }
                  variant="outlined"
                >
                  <AddIcon color="secondary" />
                  {t('coach_payment_rules.Bonuses.addBonus')}
                </Button>
              </div>
            )}
          </FieldArray>
        )}
      </Collapse>
      <div className={classes.spaceDivider} />
      <div className={classes.row}>
        <Typography className={classes.limitsTitle} variant="h6">
          {t('coach_payment_rules.remunerationLimits')}
        </Typography>
        <IconButton onClick={toogleLimitSection}>
          <ExpandMoreIcon />
        </IconButton>
      </div>
      <Collapse in={openLimitSection}>
        <PriceField
          fullWidth
          required
          id="min_remuneration"
          label={t('coach_payment_rules.min_remuneration')}
          name="min_remuneration"
        />
        <AlertError name="min_remuneration" />
        <PriceField
          fullWidth
          required
          id="max_remuneration"
          label={t('coach_payment_rules.max_remuneration')}
          name="max_remuneration"
        />
        <AlertError name="max_remuneration" />
      </Collapse>
      <Collapse
        in={
          props.values.percentage_base_cancelled_bookings ||
          props.values.percentage_base_confirmed_bookings
        }
      >
        <FormGroup>
          <CheckboxField
            checked={props.values.exclude_default_tax_rate_from_margin_value}
            id="checkbox_taxe_rate"
            label={t('coach_payment_rules.taxe_rate')}
            name="checkbox_taxe_rate"
            onClick={() =>
              setFieldValue(
                'exclude_default_tax_rate_from_margin_value',
                !props.values.exclude_default_tax_rate_from_margin_value,
              )
            }
          />
          <FormHelperText>
            {t('coach_payment_rules.taxeConciseHelper')}
          </FormHelperText>
        </FormGroup>
      </Collapse>
      {COACH_PAYMENT_RULE_FOR_ACTIVITIES.includes(props.values.kind) && (
        <React.Fragment>
          <div className={classes.row}>
            <Typography className={classes.limitsTitle} variant="h6">
              {t('coach_payment_rules.excludePaymentPack.title')}
            </Typography>
            <IconButton onClick={toogleExcludePaymentPack}>
              <ExpandMoreIcon />
            </IconButton>
          </div>
          <Collapse in={openExcludePaymentPack}>
            <InfoBox
              content={t('coach_payment_rules.excludePaymentPack.warning')}
              variant="contained"
            />
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
                    nullCurrentValue
                    helperText={props.t(
                      'coach_payment_rules.paymentPackPlaceHolder',
                    )}
                    onChange={(id) => {
                      if (id) push(id);
                    }}
                    paymentPacks={props.enabledPaymentPacks}
                  />
                  {excluded_payment_packs.map((id, i) => (
                    <PaymentPackListItem
                      key={`${id}-${i}`}
                      dense
                      onDelete={() => remove(i)}
                      pack={props.getPaymentPack(id)}
                    />
                  ))}
                </div>
              )}
            </FieldArray>
          </Collapse>
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  spaceDivider: {
    marginTop: theme.spacing(3),
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
              COACH_PAYMENT_RULE_FOR_ACTIVITIES.includes(values.kind)
                ? values.bonus_for_confirmed_bookings
                : [],
            ),
          }
        : {
            bonus_coach_payment: COACH_PAYMENT_RULE_FOR_ACTIVITIES.includes(
              values.kind,
            )
              ? values.bonus_for_confirmed_bookings
              : [],
          }),
    };
    if (values.percentage_base_confirmed_bookings !== 0) {
      valuesWithConcatBonuses.bonus_coach_payment.push(
        bonusCoachPaymentRuleConstructor(values.id, {
          applicability:
            BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CONFIRMED_BOOKING,
          kind: BONUS_COACH_PAYMENT_RULE_MARGIN_VALUE,
          bonus: values.percentage_base_confirmed_bookings,
          lower_interval: 1,
        }),
      );
    }
    if (values.percentage_base_cancelled_bookings !== 0) {
      valuesWithConcatBonuses.bonus_coach_payment.push(
        bonusCoachPaymentRuleConstructor(values.id, {
          applicability:
            BONUS_COACH_PAYMENT_RULE_APPLICABILITY_CANCELLED_BOOKING,
          kind: BONUS_COACH_PAYMENT_RULE_MARGIN_VALUE,
          bonus: values.percentage_base_cancelled_bookings,
          lower_interval: 1,
        }),
      );
    }
    if (COACH_PAYMENT_RULE_FOR_ACTIVITIES.includes(values.kind)) {
      valuesWithConcatBonuses.base_remuneration_for_cancellation = 0;
    }
    const {
      add_base_remuneration_for_cancellation,
      add_overall_base_remuneration,
      add_percentage_base_cancelled_bookings,
      add_percentage_base_confirmed_bookings,
      percentage_base_cancelled_bookings,
      percentage_base_confirmed_bookings,
      base_remuneration_type_cancellation,
      remuneration_on_cancellation,
      bonus_for_confirmed_bookings,
      bonus_for_cancelled_bookings,
      coaches,
      tax_rate,

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
