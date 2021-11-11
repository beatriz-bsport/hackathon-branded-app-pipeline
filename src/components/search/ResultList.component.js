// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import MemberMinimalListItem from '../../libs/member/components/MemberMinimalListItem.component';

type Props = {
  items: *[],
  selectEntity: () => void,
  className: number,

  loading: boolean,
  t: TFunction,
  renderListComponent: () => Node,
  classes: Object,
  showVaccinationStatus: boolean,
};

const EmptyResults = (props: { t: TFunction }) => (
  <ListItem>
    <ListItemIcon>
      <HighlightOffIcon />
    </ListItemIcon>
    <ListItemText
      primaryTypographyProps={{ noWrap: true }}
      primary={props.t('noResult')}
    />
  </ListItem>
);

export class ResultList extends Component<Props> {
  renderResults = () => {
    const { renderListComponent } = this.props;
    if (this.props.items.length === 0) {
      return <EmptyResults t={this.props.t} />;
    }
    if (renderListComponent) {
      return this.props.items.map((item) => renderListComponent(item));
    }
    return this.props.items.map((item) => (
      <MemberMinimalListItem
        member={item}
        key={item.id}
        onClick={() => {
          this.props.selectEntity({ data: item, type: 'member' });
        }}
        showVaccinationStatus={this.props.showVaccinationStatus}
      />
    ));
  };

  render() {
    const { classes, className } = this.props;
    return (
      <List
        className={`${classes.list} ${className}`}
        elevation={10}
        disablePadding
      >
        {this.props.loading ? (
          <div
            style={{
              display: 'flex',
              minWidth: 300,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          this.renderResults()
        )}
      </List>
    );
  }
}

const styles = (theme) => ({
  icon: { objectFit: 'cover', height: '100%', width: '100%' },
  list: {
    maxWidth: '100%',
    flex: '0 360',
    backgroundColor: theme.palette.background.paper,
  },
  email: {
    [theme.breakpoints.down('md')]: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
});

export default withStyles(styles)(withTranslation(['search'])(ResultList));
