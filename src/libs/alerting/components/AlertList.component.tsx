// @ts-nocheck
import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { UNREAD_COMMUNICATION } from '@bsport/common/lib/master-data/alerting_kind';
import AlertListGroup from './AlertListGroup.component';
import type { AlertGroup, DeleteAlert } from '../types';

type Props = {
  alertings: Array<AlertGroup>;
  pushRouter: (path: string) => void;
  deleteAlert: DeleteAlert;
  onClose?: () => void;
  totalCount: number;
  showMore: (alert_kind: number) => void;
  withCommunicationAlerts: boolean;
};

export function AlertList(props: Props) {
  const {
    alertings,
    withCommunicationAlerts,
    onClose,
    totalCount,
    pushRouter,
    deleteAlert,
    showMore,
  } = props;
  const { t } = useTranslation('alerting');
  const classes = useStyles();
  const filteredAlertGroups = React.useMemo(() => {
    if (!withCommunicationAlerts) {
      return alertings.filter(
        (ag) =>
          (ag.results || []).length &&
          ag.alert_kind !== UNREAD_COMMUNICATION.alert_kind.toString(),
      );
    }
    return alertings.filter((ag) => (ag.results || []).length);
  }, [alertings, withCommunicationAlerts]);

  return (
    <List
      disablePadding
      subheader={
        <ListSubheader disableGutters component="h2" style={{ margin: 0 }}>
          <div className={classes.title}>
            <span>{t('list.title')}</span>
            <span>
              {onClose ? (
                <IconButton onClick={onClose} color="secondary">
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
            pushRouter={pushRouter}
            deleteAlert={deleteAlert}
            alert_group={alert_group}
            key={alert_group.alert_kind}
            onShowMore={() => showMore(alert_group.alert_kind)}
          />
        ))
      )}
    </List>
  );
}

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

export default AlertList;
