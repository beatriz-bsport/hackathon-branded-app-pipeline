// @flow
import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Divider from '@material-ui/core/Divider';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import RefreshIcon from '@material-ui/icons/Refresh';
import { WithTranslation, useTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import PrivatePassBookerListItem from './booking-module/PrivatePassBookerListItem.component';
import PrivateConsumerPassBookerListItem from './booking-module/PrivateConsumerPassBookerListItem.component';
import type {
  PrivatePass,
  PrivateConsumerPass,
} from '#libs/private-service/types';
import { OptionCallback } from '../../../state/types';
import { MaterialStyleType } from '../../../utils/types';
import UnPrivateConsumerPassBookerListItem from '#libs/private-service/components/booking-module/UnpaidPrivateConsumerPassBookerListItem.component';

type OwnProps = {
  registerPrivateBooking: (
    privateConsumerPassId: number,
    options: OptionCallback,
  ) => void;

  billMemberPrivatePass: (privatePassId: number) => void;
  fetchPass: () => void;
  compatiblePrivatePass: Array<PrivatePass>;
  compatiblePrivateConsumerPass: Array<PrivateConsumerPass>;
  recurrenceRule?: boolean;
  createRecurrentRule?: (options?: OptionCallback) => void;
  registerUnPaidPrivateBooking: (options?: OptionCallback) => void;
  compatibleWithUnpaidBooking: boolean;
  privateSlotCredit?: number | null;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof useStyles>>;

export const PrivatePassCapabilities = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('privateService');
  const [needRefresh, setNeedRefresh] = React.useState<boolean>(false);
  return (
    <div>
      <Typography variant="h5" className={classes.sectionTitle}>
        {t('privateBooking.managerAdd.compatiblePrivateConsumerPass')}
      </Typography>
      <Divider className={classes.divider} />
      {needRefresh ? (
        <div className={classes.refreshButtonContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              props.fetchPass();
              setNeedRefresh(false);
            }}
          >
            <RefreshIcon className={classes.leftIcon} />
            {t('privateBooking.managerAdd.privateConsumerPassNeedRefresh')}
          </Button>
        </div>
      ) : (
        <List disablePadding>
          <Paper>
            {props.compatibleWithUnpaidBooking &&
              props.registerUnPaidPrivateBooking && (
                <UnPrivateConsumerPassBookerListItem
                  key="unpaid_booking_pass"
                  onBook={() => props.registerUnPaidPrivateBooking()}
                  divider
                  privateSlotCredit={props.privateSlotCredit}
                />
              )}

            {props.compatiblePrivateConsumerPass.length
              ? props.compatiblePrivateConsumerPass.map(
                  (pcp: PrivateConsumerPass) => (
                    <PrivateConsumerPassBookerListItem
                      private_consumer_pass={pcp}
                      onBook={(options: OptionCallback) =>
                        props.recurrenceRule
                          ? props.createRecurrentRule(options)
                          : props.registerPrivateBooking(pcp.id, options)
                      }
                      key={pcp.id}
                      divider
                    />
                  ),
                )
              : null}
          </Paper>
        </List>
      )}
      {props.compatiblePrivateConsumerPass.length === 0 && !needRefresh ? (
        <Typography color="textSecondary">
          {t('privateBooking.managerAdd.emptyPrivateConsumerPass')}
        </Typography>
      ) : null}
      <Typography variant="h5" className={classes.sectionTitle}>
        {t('privateBooking.managerAdd.compatiblePrivatePass')}
      </Typography>
      <Divider className={classes.divider} />
      <List disablePadding>
        {props.compatiblePrivatePass.length ? (
          <Paper>
            {props.compatiblePrivatePass.map((pp: PrivatePass) => (
              <PrivatePassBookerListItem
                private_pass={pp}
                onClick={() => {
                  props.billMemberPrivatePass(pp.id);
                  setNeedRefresh(true);
                }}
                key={pp.id}
                divider
              />
            ))}
          </Paper>
        ) : null}
      </List>
      {props.compatiblePrivatePass.length === 0 ? (
        <Typography color="textSecondary">
          {t('privateBooking.managerAdd.emptyPrivatePass')}
        </Typography>
      ) : null}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  sectionTitle: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  refreshButtonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default compose<any, OwnProps>()(PrivatePassCapabilities);
