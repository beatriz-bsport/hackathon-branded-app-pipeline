// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

type Props = {
  items: *[],
  selectEntity: (*) => void,
  selected: number,
  classes: *,
  className: number,

  loading: boolean,
  t: TFunction,
  renderListComponent: (*) => Node,
};

const EmptyResults = (props: { t: TFunction }) => (
  <ListItem>
    <ListItemIcon>
      <HighlightOffIcon />
    </ListItemIcon>
    <ListItemText
      primaryTypographyProps={{ noWrap: true }}
      primary={props.t('search.noResult')}
    />
  </ListItem>
);

export class ResultList extends Component<Props> {
  renderResults = () => {
    const { renderListComponent, selected, classes } = this.props;
    if (this.props.items.length === 0) {
      return <EmptyResults t={this.props.t} />;
    }
    if (renderListComponent) {
      return this.props.items.map((item) => renderListComponent(item));
    }
    return this.props.items.map((item) => (
      <ListItem
        key={item.id}
        button
        selected={selected === item.id}
        className="result-item"
        divider
        onClick={() => {
          this.props.selectEntity({ data: item, type: 'member' });
        }}
      >
        <ListItemText
          primary={item.name}
          primaryTypographyProps={{ noWrap: true }}
          secondary={item.email}
          classes={{ secondary: classes.email }}
        />
      </ListItem>
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
          <LinearProgress style={{ width: '100%' }} />
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
    paddingTop: theme.spacing.unit,
    backgroundColor: theme.palette.background.paper,
    borderRight: '1px solid gray',
  },
  email: {
    [theme.breakpoints.down('md')]: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
});

export default withStyles(styles)(withNamespaces()(ResultList));
