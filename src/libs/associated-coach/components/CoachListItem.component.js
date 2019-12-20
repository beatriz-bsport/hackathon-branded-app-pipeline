// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Chip from '@material-ui/core/Chip';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import EditIcon from '@material-ui/icons/Edit';
import CallIcon from '@material-ui/icons/Call';

import { Link } from 'react-router-dom';

import type { CoachDetailed as Coach } from '../../../api/types';

type Props = {
  coach: Coach,
  onCoachSelected: () => void,
  deleteCoach: () => void,
  divider: ?boolean,
  classes: Object,
};

const openPhone = (event, phoneNumber: string) => {
  event.stopPropagation();
  window.location.href = 'tel:'.concat(phoneNumber);
};
const openEmail = (event, email: string) => {
  event.stopPropagation();
  window.location.href = 'mailto:'.concat(email);
};
export function CoachListItem(props: Props) {
  const { coach, classes, onCoachSelected } = props;
  return (
    <ListItem
      key={coach.id}
      button
      divider={props.divider}
      onClick={onCoachSelected}
    >
      <ListItemAvatar>
        <Avatar className={classes.avatar} src={coach.photo} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography component="span" variant="subtitle1">
            {coach.name}
          </Typography>
        }
        secondary={
          <React.Fragment>
            {coach.email || null ? (
              <Chip
                avatar={
                  <Avatar>
                    <MailOutlineIcon />
                  </Avatar>
                }
                label={coach.email}
                className={classes.chip}
                onClick={(e) => openEmail(e, coach.email)}
                clickable
                variant="outlined"
              />
            ) : null}

            {coach.phone || null ? (
              <Chip
                avatar={
                  <Avatar>
                    <CallIcon />
                  </Avatar>
                }
                label={coach.phone}
                className={classes.chip}
                onClick={(e) => {
                  openPhone(e, coach.phone);
                }}
                clickable
                variant="outlined"
              />
            ) : null}
          </React.Fragment>
        }
      />
      <ListItemSecondaryAction>
        <Link to={`/coach/edit/${coach.id}`} style={{ textDecoration: 'none' }}>
          <IconButton aria-label="Edit">
            <EditIcon color="primary" />
          </IconButton>
        </Link>
        {props.deleteCoach ? (
          <IconButton onClick={props.deleteCoach}>
            <DeleteIcon />
          </IconButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const styles = (theme) => ({
  avatar: {
    width: theme.spacing.unit * 7,
    height: theme.spacing.unit * 7,
  },
  chip: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(CoachListItem);
