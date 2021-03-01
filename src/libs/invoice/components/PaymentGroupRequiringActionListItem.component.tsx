import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import moment from 'moment-timezone';
import WarningIcon from '@material-ui/icons/Warning';
import { getCurrencyDisplay } from '../../theme/selectors';

import { PaymentGroup } from '../types';

type Props = {
  paymentGroup: PaymentGroup;
  onValidate: (PaymentGroup) => void;
};

export const PaymentGroupRequiringActionListItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  const { paymentGroup } = props;
  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.row}>
          <WarningIcon color="error" />
          <div className={classes.leftText}>
            <Typography>
              {`${t(
                `paymentMethod.label.${paymentGroup.payment_method_identifier}`,
              )}`}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {moment(paymentGroup.date_created).format('LL')}
            </Typography>
            <Typography variant="caption">
              {`${t(`paymentGroup.requiresAction`)}`}
            </Typography>
          </div>
        </div>
        <div className={classes.line} />
        <div className={classes.secondaryAction}>
          <div>
            {`${parseFloat(parseInt(paymentGroup.price_cts, 10) / 100).toFixed(
              2,
            )} ${getCurrencyDisplay()}`}
          </div>
        </div>
      </div>
      <div>
        <Button
          onClick={() => props.onValidate(paymentGroup)}
          color="primary"
          variant="outlined"
        >
          {t('paymentGroup.validateRequiresAction')}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  secondaryAction: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  line: {
    flexGrow: 1,
    borderBottom: '1px dashed gray',
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
  },
  alignRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: theme.spacing(1),
  },
  revert: {
    textDecoration: 'line-through',
  },
}));

export default PaymentGroupRequiringActionListItem;
