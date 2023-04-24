// @ts-nocheck
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import { Member } from '../../member/types';

type Props = {
  member: Member;
  onSelect?: (id: number) => void;
};

export const MemberRelationListItem: React.FC<Props> = ({
  member,
  onSelect,
}) => {
  const classes = useStyles();

  if (!member) {
    return null;
  }

  const handleSelect = (ev: React.SyntheticEvent) =>
    onSelect(parseInt(ev.currentTarget.id));

  return (
    <ListItem
      onClick={handleSelect}
      classes={{ button: classes.button }}
      button
    >
      <ListItemAvatar>
        <Avatar src={member.photo} />
      </ListItemAvatar>
      <ListItemText
        classes={{ root: classes.noMargin }}
        primary={member.name || '  -'}
        secondary={member.email || null}
      />
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  button: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  noMargin: {
    margin: 0,
  },
}));

export default MemberRelationListItem;
