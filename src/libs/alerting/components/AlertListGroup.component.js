// @flow

import React from 'react';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import HelpIcon from '@material-ui/icons/Help';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';
import RedIconButton from '../../../components/button/RedIconButton.component';

import type { AlertGroup } from '../types';
import AlertListItem from './AlertListItem.component';

type Props = {
  alert_group: AlertGroup,
  pushRouter: (path: string) => void,
  isExpanded: boolean,
  setExpanded: (boolean) => void,
  onShowMore: () => void,
  t: TFunction,
  classes: Object,
};

export const AlertListGroup = (props: Props) => (
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
                  onClick={() =>
                    window.open(
                      'https://intercom.help/bsport-helpcenter/fr/articles/3421612-alerte-enregistrement-facture-rapide',
                    )
                  }
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
          alerting={al}
          key={al.id}
          pushRouter={props.pushRouter}
          deleteAlert={() => {}}
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
    </Collapse>
  </List>
);
const styles = (theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: '#efefef',
    margin: 0,
  },
  showMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default compose(
  withTranslation(['alerting']),
  withStyles(styles),
  withState('isExpanded', 'setExpanded', true),
)(AlertListGroup);
