import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#libs/theme/utils';
import { PrivatePass } from '../../private-service/types';
import { getValidityInfo } from '../../private-service/utils';

import { getCurrencyDisplayWithPrice } from '../../theme/selectors';

interface Props {
  privatePass: PrivatePass;
  hideCredits?: boolean;
}

const PrivatePassBookableItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['privateService']);

  const creditText = t('privatePass.parameters.nbCredits', {
    credits: getCreditsDividedDisplay(props.privatePass.credits),
    count: getCreditsDividedValue(props.privatePass.credits),
  });

  const date = getValidityInfo(props.privatePass, t);

  return (
    <div className={classes.itemContainer}>
      <div className={classes.row}>
        <Typography variant="h6">
          {getCurrencyDisplayWithPrice(props.privatePass.price)}
        </Typography>
        {!props.hideCredits && (
          <Typography align="left" className={classes.creditText} variant="h6">
            {creditText}
          </Typography>
        )}
      </div>
      <Typography align="left" color="textSecondary" variant="body1">
        {date}
      </Typography>
      <Typography align="left" color="textPrimary" variant="body1">
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
