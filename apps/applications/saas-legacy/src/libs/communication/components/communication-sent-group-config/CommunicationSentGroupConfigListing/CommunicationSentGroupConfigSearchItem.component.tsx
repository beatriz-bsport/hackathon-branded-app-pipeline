import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

type Props = {
  data: { label: string; onClick: () => void };
};

export const CommunicationSentGroupConfigSearchItem: React.FC<Props> = ({
  data: { label, onClick },
}) => {
  const classes = useStyles();

  return (
    <ListItem button divider className={classes.listitem} onClick={onClick}>
      <ListItemText
        primary={
          <span>
            <Typography component="span">{label}</Typography>
          </span>
        }
      />
    </ListItem>
  );
};

const useStyles = makeStyles(() => ({
  listitem: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
}));

export default React.memo(CommunicationSentGroupConfigSearchItem);
