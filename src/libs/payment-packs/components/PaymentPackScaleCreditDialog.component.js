// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose, withStateHandlers } from 'recompose';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

type Props = {
  open: boolean,
  toogleScaleDirection: () => void,
  scaleDirection: boolean,
  factor: number,
  onClose: () => void,
  onSubmit: (data: { factor: number }) => void,
  handleFactorChange: (e: SyntheticEvent<HTMLEelement>) => void,
  loading: boolean,
};

export const PaymentPackScaleCreditDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);
  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('scaleCredit.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{t('scaleCredit.explain')}</Typography>
        <fieldset className={classes.fieldset}>
          <legend>{t('scaleCredit.parameterLegend')}</legend>
          <div className={classes.scaleDirectionContainer}>
            <Typography variant="caption">
              {t('scaleCredit.scaleDown')}
            </Typography>
            <Switch
              onChange={props.toogleScaleDirection}
              checked={props.scaleDirection}
            />
            <Typography variant="caption">
              {t('scaleCredit.scaleUp')}
            </Typography>
          </div>
          <TextField
            onChange={props.handleFactorChange}
            value={props.factor}
            type="number"
            Start
            label={t('scaleCredit.factor.label')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {props.scaleDirection ? 'x' : '÷'}
                </InputAdornment>
              ),

              inputProps: { step: 1, min: 1 },
            }}
          />
        </fieldset>
      </DialogContent>
      <DialogActions>
        {props.loading ? (
          <CircularProgress />
        ) : (
          <React.Fragment>
            <Button onClick={props.onClose}>
              {t('scaleCredit.actions.cancel')}
            </Button>
            <Button
              color="primary"
              onClick={() =>
                props.onSubmit({
                  factor: props.scaleDirection ? props.factor : -props.factor,
                })
              }
            >
              {t('scaleCredit.actions.submit')}
            </Button>
          </React.Fragment>
        )}
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  scaleDirectionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  fieldset: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

export default compose(
  withStateHandlers(
    { factor: 2, scaleDirection: true },
    {
      toogleScaleDirection:
        ({ scaleDirection }) =>
        () => ({
          scaleDirection: !scaleDirection,
        }),
      handleFactorChange: () => (ev) => ({
        factor: parseInt(ev.target.value, 10),
      }),
    },
  ),
)(PaymentPackScaleCreditDialog);
