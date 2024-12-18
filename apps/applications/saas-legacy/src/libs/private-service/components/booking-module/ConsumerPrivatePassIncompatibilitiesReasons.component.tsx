import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import {
  PRIVATE_PASS_CAN_NOT_BOOK_SERVICE_NOT_COMPATIBLE,
  PRIVATE_PASS_CAN_NOT_BOOK_LATER_FIRST_BOOKING,
} from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { formatAsDate } from '../../../../utils/datetime';

const ConsumerPrivatePassIncompatibilitiesReasons: React.FC<{
  reasons: number[];
  extraStartingDate: string;
  closeMobileIncompatibilities: () => void;
}> = ({ reasons, extraStartingDate, closeMobileIncompatibilities }) => {
  const classes = useStyles();

  const privateServiceIncompatible = reasons.includes(
    PRIVATE_PASS_CAN_NOT_BOOK_SERVICE_NOT_COMPATIBLE,
  );

  const otherIncompatibilities = reasons.filter(
    (error_code) =>
      error_code !== PRIVATE_PASS_CAN_NOT_BOOK_SERVICE_NOT_COMPATIBLE,
  );

  const { t } = useTranslation('privateService');

  return (
    <div className={classes.list}>
      {privateServiceIncompatible && (
        <div className={classes.list}>
          <Typography className={classes.listItem} variant="caption">
            {t('privateBooking.managerAdd.incompatibilities.privateService')}
          </Typography>
          <div className={classes.sublist}>
            <Typography className={classes.listItem} variant="caption">
              {t(`privateBooking.managerAdd.incompatibilities.${11107}`)}
            </Typography>
          </div>
        </div>
      )}
      {!!otherIncompatibilities.length &&
        otherIncompatibilities.map((reason) => (
          <Typography
            key={`incompatibility-${reason}`}
            className={classes.listItem}
            variant="caption"
          >
            {t(`privateBooking.managerAdd.incompatibilities.${reason}`)}
            {reason === PRIVATE_PASS_CAN_NOT_BOOK_LATER_FIRST_BOOKING &&
              formatAsDate(extraStartingDate)}
          </Typography>
        ))}
      <div>
        {!!closeMobileIncompatibilities && (
          <Button
            className={classes.closeMobileDialog}
            onClick={closeMobileIncompatibilities}
          >
            {t(`privateBooking.managerAdd.incompatibilities.close`)}
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

export default ConsumerPrivatePassIncompatibilitiesReasons;
