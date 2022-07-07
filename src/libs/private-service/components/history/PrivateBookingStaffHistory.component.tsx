import React from 'react';
import {
  formatAsTime,
  formatAsDatetime,
  formatAsDatetimeWithoutHyphen,
} from '../../../../utils/datetime';
import StaffHistoryGeneric from './StaffHistoryGenericComponents.component';
import { useTranslation } from 'react-i18next';
import type { StaffModificationHistory } from '#libs/role/types';

import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ListItemText from '@material-ui/core/ListItemText';

import InfoIcon from '@material-ui/icons/Info';
import type { Theme } from '@material-ui/core/styles';
import {
  PRIVATE_BOOKING_CREATED_BY_STAFF,
  PRIVATE_BOOKING_CANCELLED_BY_STAFF,
  RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF,
} from '#libs/private-service/components/constants';

import { BookingSource, getStaffName } from '../../../booking/utils';

import { PrivateBooking } from '#libs/private-service/types';

type Props = {
  privateBooking: PrivateBooking;
};

export const PrivatebookingStaffHistory: React.FC<Props> = ({
  privateBooking,
}) => {
  const { t } = useTranslation('privateService');
  const classes = useStyles();
  const staffHistoryFiltered = [
    ...privateBooking?.staff_history?.filter(
      (sh) => sh.action_identifier !== PRIVATE_BOOKING_CREATED_BY_STAFF,
    ),
  ].sort((sh, sh_) => {
    if (sh.timestamp < sh_.timestamp) {
      return 1;
    }
    return -1;
  });
  if (
    staffHistoryFiltered[0]?.action_identifier ===
      PRIVATE_BOOKING_CANCELLED_BY_STAFF ||
    staffHistoryFiltered[0]?.action_identifier ===
      RECURRENT_PRIVATE_BOOKING_CANCELLED_BY_STAFF
  ) {
    staffHistoryFiltered?.splice(0, 1);
  }
  return (
    <div className={classes.historyContainer}>
      {!staffHistoryFiltered?.length ? (
        <div className={classes.emptyContainer}>
          <InfoIcon className={classes.emptyContainerChild} color="action" />
          <Typography
            className={classes.emptyContainerChild}
            color="textSecondary"
            variant="body2"
          >
            {' '}
            {t('privateBooking.detail.emptyHistory')}
          </Typography>
        </div>
      ) : (
        staffHistoryFiltered.map((sh, index) => {
          return (
            <div>
              <ListItem key={index} divider>
                <ListItemText
                  primary={
                    <div>
                      <div className={classes.firstParameterRow}>
                        <StaffHistoryGeneric
                          action_identifier={sh.action_identifier}
                          withStaff={false}
                        />
                        <Typography color="textSecondary" variant="body2">
                          - {formatAsDatetimeWithoutHyphen(1000 * sh.timestamp)}
                        </Typography>
                      </div>
                      <div className={classes.parameterRow}>
                        <Typography>
                          {t('privateBooking.detail.initialDateTime')} :
                        </Typography>
                        <Typography>
                          {formatAsDatetime(1000 * sh.old_date_start)}
                        </Typography>
                      </div>
                      <div className={classes.parameterRow}>
                        <Typography>
                          {t('privateBooking.detail.canal')} :
                        </Typography>
                        <BookingSource source={privateBooking.source} />
                      </div>
                      <div className={classes.parameterRow}>
                        <StaffHistoryGeneric
                          action_identifier={sh.action_identifier}
                          withStaff
                        />
                        <Typography>{getStaffName(sh?.staff)}</Typography>
                      </div>
                    </div>
                  }
                />
              </ListItem>
            </div>
          );
        })
      )}
    </div>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  emptyContainer: {
    padding: theme.spacing(2.5),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    whiteSpace: 'pre-wrap',
  },
  emptyContainerChild: {
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
  },
  historyContainer: {
    maxHeight: theme.spacing(42),
    overflowY: 'auto',
  },
  firstParameterRow: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    whiteSpace: 'pre-wrap',
  },
  parameterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    whiteSpace: 'pre-wrap',
  },
}));
export default PrivatebookingStaffHistory;
