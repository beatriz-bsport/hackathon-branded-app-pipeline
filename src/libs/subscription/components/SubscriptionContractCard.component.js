// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LuxonUtils from '@date-io/luxon';
import { DateTime, Settings } from 'luxon';
import { compose, withState } from 'recompose';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';

import { withTranslation, TFunction } from 'react-i18next';

import TypographyMultiline from '../../../components/typo/TypographyMultiline.component';

type Props = {
  t: TFunction,
  contract: ?Contract,
  classes: Object,
  acceptContract: boolean,
  setAcceptContract: (boolean) => void,
  hideConditions: boolean,

  date: string,
  setDate: (string) => void,

  onPayRequest: (date: string) => void,
};
export const SubscriptionContractCard = (props: Props) => {
  if (!props.contract) return <div />;
  return (
    <div className={props.classes.container}>
      <Typography variant="h6">{props.contract.name}</Typography>
      <TypographyMultiline className={props.classes.textBlock}>
        {props.contract.description}
      </TypographyMultiline>
      <Typography variant="h6">{props.t('contract.legal')}</Typography>
      <TypographyMultiline
        className={props.classes.textBlock}
        color="textSecondary"
      >
        {props.contract.contract}
      </TypographyMultiline>
      {!props.hideConditions && (
        <>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.acceptContract}
                  onChange={(ev) => props.setAcceptContract(ev.target.checked)}
                />
              }
              label={props.t('contract.actions.iAcceptCondition')}
            />
          </FormControl>

          {!props.contract.month_billing_day && (
            <div className={props.classes.buttonDateBlock}>
              <Typography className={props.classes.buttonLeftText}>
                {props.t('contract.actions.iwanttostarton')}
              </Typography>
              <div className={props.classes.column}>
                <MuiPickersUtilsProvider
                  locale={Settings.defaultLocale}
                  utils={LuxonUtils}
                >
                  <DatePicker
                    disablePast
                    required
                    format="D"
                    onChange={props.setDate}
                    returnMoment={false}
                    value={props.date}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>
          )}
        </>
      )}
      <Button
        color="primary"
        disabled={!props.acceptContract && !props.hideConditions}
        onClick={() => props.onPayRequest(props.date.toISO())}
        style={{ width: '100%' }}
        variant="contained"
      >
        {props.t('contract.actions.subscribe')}
      </Button>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(2),
  },
  buttonDateBlock: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  textBlock: {
    marginBottom: theme.spacing(1),
  },
  buttonLeftText: {
    marginRight: theme.spacing(1),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
});

export default compose(
  withTranslation(['subscription']),
  withStyles(styles),
  withState('date', 'setDate', DateTime.now()),
  withState('acceptContract', 'setAcceptContract', false),
)(SubscriptionContractCard);
