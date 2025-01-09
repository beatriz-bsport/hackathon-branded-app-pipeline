import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import {
  UNREAD_COMMUNICATION,
  UNEVEN_INVOICE_ALERT,
} from '@bsport/common/lib/master-data/alerting_kind.js';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import type { RootState } from 'src/reducers';
import { compose } from 'recompose';
import AlertListGroup from './AlertListGroup.component';
import type { AlertGroup, DeleteAlert } from '../types';
import { AlertKind } from '../constants';
import alertingSelectors from '../selectors';

type OuterProps = {
  pushRouter: (path: string) => void;
  deleteAlert: DeleteAlert;
  onClose?: () => void;
  totalCount: number;
  showMore: (alert_kind: number) => void;
  withCommunicationAlerts: boolean;
  hasReadInvoicePermission: boolean;
};

type InnerProps = {
  alertings: AlertGroup[];
};

type Props = InnerProps & OuterProps;
const AlertList: React.FC<Props> = ({
  alertings,
  withCommunicationAlerts,
  onClose,
  totalCount,
  pushRouter,
  deleteAlert,
  showMore,
  hasReadInvoicePermission,
}) => {
  const { t } = useTranslation('alerting');
  const classes = useStyles();
  const filteredAlertGroups = React.useMemo(() => {
    return alertings.filter((alertingGroup) => {
      if (
        (!withCommunicationAlerts &&
          alertingGroup.alert_kind === UNREAD_COMMUNICATION.alert_kind) ||
        (!hasReadInvoicePermission &&
          alertingGroup.alert_kind === UNEVEN_INVOICE_ALERT.alert_kind)
      ) {
        return false;
      }

      return alertingGroup.results?.length;
    });
  }, [alertings, withCommunicationAlerts, hasReadInvoicePermission]);

  return (
    <List
      disablePadding
      subheader={
        <ListSubheader disableGutters component="h2" style={{ margin: 0 }}>
          <div className={classes.title}>
            <span>{t('list.title')}</span>
            <span>
              {onClose ? (
                <IconButton color="secondary" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              ) : null}
            </span>
          </div>
          <Divider />
        </ListSubheader>
      }
    >
      {totalCount === 0 ? (
        <div className={classes.emptyText}>
          <Typography color="textSecondary">
            {t('list.emptyAlerting')}
          </Typography>
        </div>
      ) : (
        filteredAlertGroups.map((alert_group) => (
          <AlertListGroup
            key={alert_group.alert_kind}
            alert_group={alert_group}
            deleteAlert={deleteAlert}
            onShowMore={() => showMore(alert_group.alert_kind)}
            pushRouter={pushRouter}
          />
        ))
      )}
    </List>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: 'white',
    margin: 0,
  },
  emptyText: {
    padding: theme.spacing(2),
  },
}));

const connector = connect((state: RootState, props: OuterProps) => ({
  alertings: props.withCommunicationAlerts
    ? alertingSelectors.getOneKind(state, AlertKind.UNREAD_COMMUNICATION)
    : alertingSelectors.getByKind(state),
}));
export default compose<InnerProps, OuterProps>(connector)(
  React.memo(AlertList),
);
