// @ts-nocheck
import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import {
  PRIVATE_PASS_CAN_NOT_BOOK_SERVICE_NOT_COMPATIBLE,
  PRIVATE_PASS_CAN_NOT_BOOK_LATER_FIRST_BOOKING,
} from '@bsport/common/src/master-data/error-codes/buyable-item-can-not-be-bought';
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
          <Typography variant="caption" className={classes.listItem}>
            {t('privateBooking.managerAdd.incompatibilities.privateService')}
          </Typography>
          <div className={classes.sublist}>
            <Typography variant="caption" className={classes.listItem}>
              {t(`privateBooking.managerAdd.incompatibilities.${11107}`)}
            </Typography>
          </div>
        </div>
      )}
      {!!otherIncompatibilities.length &&
        otherIncompatibilities.map((reason) => (
          <Typography
            key={`incompatibility-${reason}`}
            variant="caption"
            className={classes.listItem}
          >
            {t(`privateBooking.managerAdd.incompatibilities.${reason}`)}
            {reason === PRIVATE_PASS_CAN_NOT_BOOK_LATER_FIRST_BOOKING &&
              formatAsDate(extraStartingDate)}
          </Typography>
        ))}
      <div>
        {!!closeMobileIncompatibilities && (
          <Button
            onClick={closeMobileIncompatibilities}
            className={classes.closeMobileDialog}
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
