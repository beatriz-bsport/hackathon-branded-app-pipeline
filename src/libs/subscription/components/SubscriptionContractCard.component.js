// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { compose, withState } from 'recompose';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import moment from 'moment-timezone';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Moment } from '../../../i18n';

import TypographyMultiline from '../../../components/TypographyMultiline.component';

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
              label={props.t('contract.actions.iAcceptCondition')}
              control={
                <Checkbox
                  checked={props.acceptContract}
                  onChange={(ev) => props.setAcceptContract(ev.target.checked)}
                />
              }
            />
          </FormControl>

          <div className={props.classes.buttonDateBlock}>
            <Typography className={props.classes.buttonLeftText}>
              {props.t('contract.actions.iwanttostarton')}
            </Typography>
            <div className={props.classes.column}>
              <MuiPickersUtilsProvider
                utils={MomentUtils}
                moment={Moment}
                locale={Moment.locale()}
              >
                <DatePicker
                  value={props.date}
                  onChange={props.setDate}
                  format="L"
                  required
                  mask={(value) => {
                    if (value) {
                      return [
                        /\d/,
                        /\d/,
                        '/',
                        /\d/,
                        /\d/,
                        '/',
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                      ];
                    }
                    return [];
                  }}
                  returnMoment={false}
                  disablePast
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </>
      )}
      <Button
        variant="contained"
        color="primary"
        disabled={!props.acceptContract && !props.hideConditions}
        style={{ width: '100%' }}
        onClick={() => props.onPayRequest(props.date)}
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
  withState('date', 'setDate', moment()),
  withState('acceptContract', 'setAcceptContract', false),
)(SubscriptionContractCard);
