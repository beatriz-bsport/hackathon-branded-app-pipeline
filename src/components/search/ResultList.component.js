// @flow

import React, { Component } from 'react';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

type Props = {
  items: *[],
  selectEntity: (*) => void,
  goToMember: (*) => void,
  selected: number,
  classes: *,
  className: number,
  t: TFunction,
};
type State = {};

export class ResultList extends Component<Props, State> {
  state = {};

  render() {
    const { selected, classes, t, className } = this.props;
    const emptyResults = (
      <ListItem>
        <ListItemIcon>
          <HighlightOffIcon />
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{ noWrap: true }}
          primary={t('search.noResult')}
        />
      </ListItem>
    );
    const results = this.props.items.map((item) => (
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
        <Avatar>
          <img src={item.photo} alt={item.name} className={classes.icon} />
        </Avatar>
        <ListItemText
          primary={item.name}
          primaryTypographyProps={{ noWrap: true }}
          secondary={item.email}
          classes={{ secondary: classes.email }}
        />
        <ListItemSecondaryAction>
          <IconButton
            aria-label={t('search.member.go_to')}
            onClick={() => this.props.goToMember(item.id)}
          >
            <OpenInNewIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ));
    return (
      <List className={`${classes.list} ${className}`} elevation={10}>
        {results.length ? results : emptyResults}
      </List>
    );
  }
}

const styles = (theme) => ({
  icon: { objectFit: 'cover', height: '100%', width: '100%' },
  list: {
    [theme.breakpoints.down('md')]: {
      width: '100vw',
    },
    maxWidth: '100%',
    flex: '0 360',
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

export default withStyles(styles)(translate()(ResultList));
