// @ts-nocheck
import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/styles';
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
import withStyles from '@material-ui/core/styles/withStyles';

import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from 'react-i18next';
import { compose, withState } from 'recompose';
import {
  NEW_TUTORIAL_SECTION_OR_LESSON,
  UNREAD_COMMUNICATION,
} from '@bsport/common/lib/master-data/alerting_kind';
import RedIconButton from '../../../components/button/RedIconButton.component';

import type { AlertGroup, DeleteAlert } from '../types';
import AlertListItem from './AlertListItem.component';
import { MaterialStyleType } from '../../../utils/types';
import { openIntercomHelp } from '../../../intercom';

type OwnProps = {
  alert_group: AlertGroup;
  pushRouter: (path: string) => void;
  deleteAlert: DeleteAlert;
  onShowMore: () => void;
};

type ComposeProps = {
  isExpanded: boolean;
  setExpanded: (isExpanded: boolean) => void;
} & WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type Props = OwnProps & ComposeProps;

type RealAllButtonProps = {
  alert_group: AlertGroup;
  deleteAlert: DeleteAlert;
};

const READ_ALL_ALLOWED_ALERT_KINDS = [
  NEW_TUTORIAL_SECTION_OR_LESSON.alert_kind,
  UNREAD_COMMUNICATION.alert_kind,
];

const ReadAllButton = (props: RealAllButtonProps) => {
  const classes = useReadAllStyles();
  const { t } = useTranslation('alerting');
  if (
    READ_ALL_ALLOWED_ALERT_KINDS.includes(
      parseInt(props.alert_group.alert_kind),
    )
  ) {
    return (
      <div className={classes.container}>
        <Button
          color="primary"
          onClick={
            () => props.deleteAlert(parseInt(props.alert_group.alert_kind), -1) // -1 means all alerts of that group
          }
          startIcon={<CheckCircleOutlineIcon />}
        >
          {t('readAll')}
        </Button>
      </div>
    );
  }
  return null;
};

const useReadAllStyles = makeStyles((theme: Theme) => ({
  container: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export const AlertListGroup = (props: Props) => {
  const handleOpenIntercomHelp = () => {
    openIntercomHelp('paymentLink');
  };

  return (
    <List
      disablePadding
      subheader={
        <ListSubheader disableGutters component="h3" style={{ margin: 0 }}>
          <div className={props.classes.title}>
            <div>
              <span>
                {`${props.t(`alert_kind.${props.alert_group.alert_kind}`)} (${
                  props.alert_group.count
                })`}
              </span>
              <span>
                {props.alert_group.count &&
                props.alert_group.alert_kind === '1' ? (
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
                props.setExpanded(!props.isExpanded);
              }}
            >
              {props.isExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </div>
          <Divider />
        </ListSubheader>
      }
    >
      <Collapse in={props.isExpanded}>
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
          <div
            className={props.classes.showMoreContainer}
            disabled={props.alert_group.loading}
          >
            <Button onClick={props.onShowMore}>{props.t('showMore')}</Button>
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
const styles = (theme: Theme) =>
  createStyles({
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
  });

export default compose<any, OwnProps>(
  withTranslation(['alerting']),
  withStyles(styles),
  withState('isExpanded', 'setExpanded', true),
)(AlertListGroup);
