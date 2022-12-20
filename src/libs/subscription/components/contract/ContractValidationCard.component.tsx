import React from 'react';
import { ListItem, Typography } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { useTranslation } from 'react-i18next';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { getCurrencyDisplay } from '#libs/theme/selectors';
import { Contract } from '#libs/subscription/types';

type Props = {
  contract: Contract;
};

export const ContractValidationCard = (props: Props) => {
  const { contract } = props;
  const { t } = useTranslation('subscription');
  const classes = useStyles();
  if (!contract) return null;
  return (
    <ListItem className={classes.paperContainer} divider>
      <Typography variant="h6">{contract.name}</Typography>
      <div className={classes.row}>
        <AccessTimeIcon className={classes.leftIcon} />
        <Typography>
          {t('subscription.listItem.recurrencePriceIs', {
            amount: contract.recurrent_price,
            currencyDisplay: getCurrencyDisplay(),
          })}
        </Typography>
      </div>
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  paperContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    alignItems: 'unset',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

export default ContractValidationCard;
