import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import {
  PAYMENT_PACK_INCOMPATIBLE_WITH_META_ACTIVITY,
  PAYMENT_PACK_INCOMPATIBLE_BEFORE_FIRST_ACTION,
} from '@bsport/common/src/master-data/error-codes/buyable-item-can-not-be-bought';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { formatAsDate } from '../../../utils/datetime';

const ConsumerPaymentPackIncompatibilitiesReasons: React.FC<{
  reasons: number[];
  extraStartingDate: string;
  closeMobileIncompatibilities: () => void;
}> = ({ reasons, extraStartingDate, closeMobileIncompatibilities }) => {
  const classes = useStyles();

  const incompatibilitiesWithActivity = reasons?.filter((error_code) =>
    PAYMENT_PACK_INCOMPATIBLE_WITH_META_ACTIVITY.includes(error_code),
  );

  const otherIncompatibilities = reasons?.filter(
    (error_code) => !incompatibilitiesWithActivity.includes(error_code),
  );

  const { t } = useTranslation('paymentPack');

  return (
    <div className={classes.list}>
      {!!incompatibilitiesWithActivity.length && (
        <div className={classes.list}>
          <Typography className={classes.listItem} variant="caption">
            {t('incompatibilities.paymentPack')}
          </Typography>
          <div className={classes.sublist}>
            {incompatibilitiesWithActivity.map((reason) => (
              <Typography className={classes.listItem} variant="caption">
                {t(`incompatibilities.${reason}`)}
              </Typography>
            ))}
          </div>
        </div>
      )}
      {!!otherIncompatibilities.length &&
        otherIncompatibilities.map((reason) => (
          <Typography className={classes.listItem} variant="caption">
            {t(`incompatibilities.${reason}`)}
            {PAYMENT_PACK_INCOMPATIBLE_BEFORE_FIRST_ACTION.includes(reason) &&
              formatAsDate(extraStartingDate)}
          </Typography>
        ))}
      <div>
        {!!closeMobileIncompatibilities && (
          <Button
            className={classes.closeMobileDialog}
            onClick={closeMobileIncompatibilities}
          >
            {t(`actions.close`)}
          </Button>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  sublist: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(2),
  },
  listItem: {
    '&::before': {
      content: '"\u2022"',
      paddingRight: theme.spacing(1),
    },
  },
  closeMobileDialog: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(1),
  },
}));

export default ConsumerPaymentPackIncompatibilitiesReasons;
