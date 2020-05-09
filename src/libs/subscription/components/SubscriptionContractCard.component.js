// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { compose, withState } from 'recompose';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import DatePicker from 'material-ui-pickers/DatePicker';
import moment from 'moment';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import TypographyMultiline from '../../../components/TypographyMultiline.component';

type Props = {
  t: TFunction,
  contract: ?Contract,
  classes: Object,
  acceptContract: boolean,
  setAcceptContract: (boolean) => void,

  date: string,
  setDate: (string) => void,

  onPayRequest: (date: string) => void,
};
export const SubscriptionContractCard = (props: Props) => {
  if (!props.contract) return <div />;
  return (
    <div className={props.classes.container}>
      <Typography variant="h6">{props.t('contract.description')}</Typography>
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
      <div className={props.classes.bottomRow}>
        <div className={props.classes.buttonDateBlock}>
          <Typography className={props.classes.buttonLeftText}>
            {props.t('contract.actions.iwanttostarton')}
          </Typography>
          <DatePicker
            value={props.date}
            onChange={props.setDate}
            format="DD/MM/YYYY"
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
        </div>
        <Button
          variant="contained"
          color="primary"
          disabled={!props.acceptContract}
          onClick={() => props.onPayRequest(props.date)}
        >
          {props.t('contract.actions.subscribe')}
        </Button>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(2),
  },
  bottomRow: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonDateBlock: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  textBlock: {
    marginBottom: theme.spacing(1),
  },
  buttonLeftText: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withNamespaces(['subscription']),
  withStyles(styles),
  withState('date', 'setDate', moment()),
  withState('acceptContract', 'setAcceptContract', false),
)(SubscriptionContractCard);
