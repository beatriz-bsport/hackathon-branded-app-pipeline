// @ts-nocheck
import React, { useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import ClearIcon from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Theme from '@material-ui/core';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { getCurrencyDisplay } from '../../theme/selectors';
import type { CoachPaymentRule } from '../types';
import Figure from '../../../components/graph/Figure.component';
import { MaterialStyleType } from '../../../utils/types';
import { COACH_PAYMENT_RULE_FOR_ACTIVITIES } from '#libs/coach-payment-rules/constants.ts';

type OwnProps = {
  open: boolean;
  handleCloseSimulation: () => void;
  isSubmitting: boolean;
  coachPaymentRule: CoachPaymentRule;
  onSubmit: (id: number, params: any) => void;
  simulationResult: any;
  handlePrevious: (coachPaymentRule: CoachPaymentRule) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type FieldsState =
  | {
      confirmed_bookings: number;
      cancelled_bookings: number;
      margin_value: number;
      student_was_here?: boolean;
    }
  | {
      student_was_here: boolean;
      margin_value: number;
      confirmed_bookings?: number;
      cancelled_bookings?: number;
    };

export const CoachPaymentRuleSimulationDrawer = (props: Props) => {
  const {
    t,
    open,
    handleCloseSimulation,
    handlePrevious,
    isSubmitting,
    onSubmit,
    classes,
    coachPaymentRule,
  } = props;
  const initialFieldsState: FieldsState =
    COACH_PAYMENT_RULE_FOR_ACTIVITIES.includes(coachPaymentRule.kind)
      ? {
          confirmed_bookings: 0,
          cancelled_bookings: 0,
          margin_value: 0,
        }
      : {
          student_was_here: true,
          margin_value: 0,
        };
  const [simulationParams, setSimulationParams] = useState(initialFieldsState);

  return (
    <GenericResponsiveDrawer
      open={open}
      onClose={handleCloseSimulation}
      title={t('coach_payment_rules.Simulator.title')}
    >
      <Typography variant="body2">
        {t('coach_payment_rules.Simulator.helper')}
      </Typography>
      <div className={classes.dialogContent}>
        {COACH_PAYMENT_RULE_FOR_ACTIVITIES.includes(coachPaymentRule.kind) ? (
          <div className={classes.dialogFields}>
            <TextField
              id="confirmed_bookings"
              className={classes.field}
              value={simulationParams.confirmed_bookings}
              defaultValue={0}
              onChange={(event) =>
                setSimulationParams({
                  ...simulationParams,
                  confirmed_bookings: parseInt(event.target.value),
                })
              }
              size="small"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                  style: { textAlign: 'right' },
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography>
                      {t('coach_payment_rules.Simulator.numberOfStudent')}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="cancelled_bookings"
              className={classes.field}
              value={simulationParams.cancelled_bookings}
              defaultValue={0}
              onChange={(event) =>
                setSimulationParams({
                  ...simulationParams,
                  cancelled_bookings: parseInt(event.target.value),
                })
              }
              size="small"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                  style: { textAlign: 'right' },
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography>
                      {t('coach_payment_rules.Simulator.numberOfCancellations')}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="margin_value"
              className={classes.field}
              value={simulationParams.margin_value}
              defaultValue={0}
              onChange={(event) =>
                setSimulationParams({
                  ...simulationParams,
                  margin_value: parseInt(event.target.value),
                })
              }
              size="small"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                  style: { textAlign: 'right' },
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography>
                      {`${t(
                        'coach_payment_rules.Simulator.marginalValueOfReservation',
                      )} (${getCurrencyDisplay()})`}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        ) : (
          <div className={classes.dialogFields}>
            <FormControlLabel
              control={
                <Switch
                  checked={simulationParams.student_was_here}
                  onChange={() =>
                    setSimulationParams({
                      ...simulationParams,
                      student_was_here: !simulationParams.student_was_here,
                    })
                  }
                  name="student_attendance"
                />
              }
              label={
                simulationParams.student_was_here
                  ? t('coach_payment_rules.Simulator.student_attended')
                  : t('coach_payment_rules.Simulator.student_did_not_attend')
              }
            />
            <TextField
              id="margin_value"
              className={classes.field}
              value={simulationParams.margin_value}
              defaultValue={0}
              onChange={(event) =>
                setSimulationParams({
                  ...simulationParams,
                  margin_value: parseInt(event.target.value),
                })
              }
              size="small"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                  style: { textAlign: 'right' },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography>
                      {`${t(
                        'coach_payment_rules.Simulator.which',
                      )} ${getCurrencyDisplay()}`}
                    </Typography>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography>
                      {t('coach_payment_rules.Simulator.forEachBooking')}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}

        <div className={classes.result}>
          {props.simulationResult &&
            props.simulationResult[props.coachPaymentRule.id] && (
              <div>
                <div className={classes.resultTitle}>
                  <Typography variant="subtitle2">
                    {t('coach_payment_rules.Simulator.resultTitle')}
                  </Typography>
                </div>
                <Grid container spacing={2} className={classes.gridContainer}>
                  <Grid item xs={12}>
                    <Figure
                      name={t('coach_payment_rules.Simulator.total_payment')}
                      count={`${getCurrencyDisplay()}
                      ${(
                        props.simulationResult[props.coachPaymentRule.id]
                          .remuneration || 0
                      ).toFixed(2)}`}
                      color="green"
                    />
                  </Grid>
                </Grid>
              </div>
            )}
        </div>
      </div>
      <DialogActions className={classes.dialogActions}>
        <Button
          onClick={() => handlePrevious(props.coachPaymentRule)}
          color="secondary"
          disabled={isSubmitting}
          startIcon={
            <DoubleArrowIcon style={{ transform: 'rotate(180deg)' }} />
          }
        >
          {t('previous')}
        </Button>
        <Button
          id="button_coach_remuneration_simulation"
          variant="contained"
          type="submit"
          color="primary"
          onClick={() => onSubmit(props.coachPaymentRule.id, simulationParams)}
          disabled={isSubmitting}
        >
          {t('simulate')}
        </Button>
        <Button
          onClick={handleCloseSimulation}
          color="secondary"
          disabled={isSubmitting}
          startIcon={<ClearIcon />}
        >
          {t('close')}
        </Button>
      </DialogActions>
    </GenericResponsiveDrawer>
  );
};

const styles = (theme: Theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(3),
  },
  dialogFields: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  fieldContainer: {
    width: '10rem',
  },
  field: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
  },
  resultTitle: {
    display: 'flex',
    margin: 'auto',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  result: {
    height: '80%',
    display: 'flex',
    justifyContent: 'center',
    margin: '10',
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default compose<any, Props>(
  withStyles(styles),
  withTranslation(['paymentRules']),
)(CoachPaymentRuleSimulationDrawer);
