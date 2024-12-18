import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import type { PaymentPackTemplate } from '#src/libs/payment-packs/types';
import type { PrivatePassTemplate } from '#src/libs/private-service/types';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#src/libs/theme/utils';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import { getAssociatedPassValidityInfo } from '#src/libs/subscription/utils';

type Props = {
  goToPassTemplate: () => void;
  passTemplate: PaymentPackTemplate | PrivatePassTemplate;
};

const FranchiseBillingPlanAssociatedPass: React.FC<Props> = ({
  goToPassTemplate,
  passTemplate,
}) => {
  const { t } = useTranslation(['paymentPack', 'subscription']);
  const classes = useStyles();

  const dateInfo = React.useMemo(
    () => getAssociatedPassValidityInfo(passTemplate, t),
    [passTemplate, t],
  );

  const credits = React.useMemo(
    () => getCreditsDividedDisplay(passTemplate?.credits),
    [passTemplate?.credits],
  );

  const count = React.useMemo(
    () => getCreditsDividedValue(passTemplate?.credits),
    [passTemplate?.credits],
  );

  const creditInfo = React.useMemo(
    () =>
      t('paymentPack:specifications.nbCredits', {
        credits: credits,
        count: count,
      }),
    [count, credits, t],
  );

  return (
    <ListItem
      key={passTemplate?.id}
      button
      className={classes.container}
      onClick={goToPassTemplate}
    >
      <Typography color="textPrimary" variant="body1">
        {passTemplate?.name ?? ''}
      </Typography>
      <Typography color="textSecondary" variant="body2">
        {`${creditInfo} - ${dateInfo}`}
      </Typography>
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
  },
}));

export default React.memo(FranchiseBillingPlanAssociatedPass);
