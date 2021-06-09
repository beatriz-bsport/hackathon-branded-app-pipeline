import React, { useState } from 'react';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { COACH_PAYMENT_RULE_FOR_SESSION } from '@bsport/common/lib/master-data/coach_payment_rule';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
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
import { getCurrencyDisplay } from '../../theme/selectors';
import type { CoachPaymentRule } from '../types';
import Figure from '../../../components/graph/Figure.component';

type Props = {
  classes: Objects<any>,
  t: TFunction,
  open: Boolean,
  handleCloseSimulation: () => void,
  isSubmitting: Boolean,
  coachPaymentRule: CoachPaymentRule,
  onSubmit: (id: number, params: any) => void,
  simulationResult: object<any>,
  handlePrevious: (coachPaymentRule: coachPaymentRule) => void,
};

export const CoachPaymentRuleSimulationDialog = (props: Props) => {
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
  const initialFieldsState =
    coachPaymentRule.kind === COACH_PAYMENT_RULE_FOR_SESSION
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
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleCloseSimulation}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="form-dialog-title">
        {t('coach_payment_rules.Simulator.title')}
        <Typography variant="body2">
          {t('coach_payment_rules.Simulator.helper')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <div className={classes.dialogContent}>
          {coachPaymentRule.kind === COACH_PAYMENT_RULE_FOR_SESSION ? (
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
                        {t('coach_payment_rules.Simulator.for')}
                      </Typography>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography>
                        {t('coach_payment_rules.Simulator.students')}
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
                        {t('coach_payment_rules.Simulator.and')}
                      </Typography>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography>
                        {t('coach_payment_rules.Simulator.cancellations')}
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
                          'coach_payment_rules.Simulator.which',
                        )} ${getCurrencyDisplay()}`}
                      </Typography>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography>
                        {t('coach_payment_rules.Simulator.forEachBooking')}
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
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography>
                        {`${t(
                          'coach_payment_rules.Simulator.which',
                        )} ${getCurrencyDisplay()}`}
                      </Typography>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography>
                        {t('coach_payment_rules.Simulator.forEachBooking')}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          )}
          <div className={classes.resultSide}>
            <div className={classes.resultTitle}>
              <Typography variant="subtitle2">
                {t('coach_payment_rules.Simulator.resultTitle')}
              </Typography>
            </div>
            <div className={classes.result}>
              {props.simulationResult &&
                props.simulationResult[props.coachPaymentRule.id] && (
                  <Grid
                    container
                    spacing={2}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Grid item xs={6}>
                      <Figure
                        name={t('coach_payment_rules.Simulator.total_payment')}
                        count={`${getCurrencyDisplay()}
                      ${
                        props.simulationResult[props.coachPaymentRule.id]
                          .remuneration || 0
                      }`}
                        color="green"
                      />
                    </Grid>
                  </Grid>
                )}
            </div>
          </div>
        </div>
      </DialogContent>
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
    </Dialog>
  );
};

const styles = (theme) => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'row',
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  dialogFields: {
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
  },
  fieldContainer: {
    width: '10rem',
  },
  field: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  resultSide: {
    width: '50%',
    justifyContent: 'center',
  },
  resultTitle: {
    display: 'flex',
    margin: 'auto',
    justifyContent: 'center',
  },
  result: {
    height: '80%',
    display: 'flex',
    justifyContent: 'center',
    margin: '10',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['paymentRules']),
)(CoachPaymentRuleSimulationDialog);
