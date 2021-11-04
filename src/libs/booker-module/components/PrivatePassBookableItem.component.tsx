import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PrivatePass } from '../../private-service/types';
import { getValidityInfo } from '../../private-service/utils';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

interface Props {
  privatePass: PrivatePass;
}

const PrivatePassBookableItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['privateService']);

  const creditText = t('privatePass.parameters.nbCredits', {
    credits: props.privatePass.credits,
    count: props.privatePass.credits,
  });

  const date = getValidityInfo(props.privatePass, t);

  return (
    <div className={classes.itemContainer}>
      <div className={classes.row}>
        <Typography variant="h6">
          {getCurrencyDisplayWithPrice(props.privatePass.price)}
        </Typography>
        <Typography className={classes.creditText} variant="h6" align="left">
          {creditText}
        </Typography>
      </div>
      <Typography variant="body1" color="textSecondary" align="left">
        {date}
      </Typography>
      <Typography variant="body1" color="textPrimary" align="left">
        {props.privatePass.name}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  itemContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  creditText: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

export default PrivatePassBookableItem;
