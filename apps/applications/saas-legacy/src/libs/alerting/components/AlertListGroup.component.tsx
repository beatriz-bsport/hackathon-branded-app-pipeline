import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import HelpIcon from '@material-ui/icons/Help';

import { useTranslation } from 'react-i18next';
import {
  NEW_TUTORIAL_SECTION_OR_LESSON,
  UNREAD_COMMUNICATION,
} from '@bsport/common/lib/master-data/alerting_kind.js';
// @ts-expect-error
import RedIconButton from '#src/components/button/RedIconButton.component';
import { openIntercomHelp } from '../../../intercom';

import type { AlertGroup, DeleteAlert } from '../types';
import AlertListItem from './AlertListItem.component';

type OuterProps = {
  alert_group: AlertGroup;
  pushRouter: (path: string) => void;
  deleteAlert: DeleteAlert;
  onShowMore: () => void;
};

type Props = OuterProps;

type ReadAllButtonProps = {
  alert_group: AlertGroup;
  deleteAlert: DeleteAlert;
};

const READ_ALL_ALLOWED_ALERT_KINDS = [
  NEW_TUTORIAL_SECTION_OR_LESSON.alert_kind,
  UNREAD_COMMUNICATION.alert_kind,
];

const ReadAllButton: React.FC<ReadAllButtonProps> = React.memo((props) => {
  const classes = useReadAllStyles();
  const { t } = useTranslation('alerting');
  if (READ_ALL_ALLOWED_ALERT_KINDS.includes(props.alert_group.alert_kind)) {
    return (
      <div className={classes.container}>
        <Button
          color="primary"
          onClick={
            () => props.deleteAlert(props.alert_group.alert_kind, -1) // -1 means all alerts of that group
          }
          startIcon={<CheckCircleOutlineIcon />}
        >
          {t('readAll')}
        </Button>
      </div>
    );
  }
  return null;
});

const useReadAllStyles = makeStyles((theme: Theme) => ({
  container: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const AlertListGroup: React.FC<Props> = (props) => {
  const handleOpenIntercomHelp = () => {
    openIntercomHelp('paymentLink');
  };

  const [isExpanded, setIsExpanded] = React.useState(true);
  const classes = useStyles();
  const { t } = useTranslation('alerting');
  return (
    <List
      disablePadding
      subheader={
        <ListSubheader disableGutters component="h3" style={{ margin: 0 }}>
          <div className={classes.title}>
            <div>
              <span>
                {`${t(`alert_kind.${props.alert_group.alert_kind}`)} (${
                  props.alert_group.count
                })`}
              </span>
              <span>
                {props.alert_group.count &&
                props.alert_group.alert_kind === 1 ? (
                  <RedIconButton
                    color="primary"
                    onClick={handleOpenIntercomHelp}
                  >
                    <HelpIcon />
                  </RedIconButton>
                ) : null}
              </span>
            </div>
            <IconButton
              onClick={() => {
                setIsExpanded((previousValue) => !previousValue);
              }}
            >
              {isExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </div>
          <Divider />
        </ListSubheader>
      }
    >
      <Collapse in={isExpanded}>
        {props.alert_group.results.map((al) => (
          <AlertListItem
            key={al.id}
            alerting={al}
            deleteAlert={props.deleteAlert}
            pushRouter={props.pushRouter}
          />
        ))}
        {props.alert_group.loading ? <LinearProgress /> : null}
        {props.alert_group.next ? (
          <div className={classes.showMoreContainer}>
            <Button
              disabled={props.alert_group.loading}
              onClick={props.onShowMore}
            >
              {t('showMore')}
            </Button>
          </div>
        ) : null}
        <ReadAllButton
          alert_group={props.alert_group}
          deleteAlert={props.deleteAlert}
        />
      </Collapse>
    </List>
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: '#efefef',
    margin: 0,
  },
  showMoreContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default React.memo(AlertListGroup);
