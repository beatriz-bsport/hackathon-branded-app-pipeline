import React from 'react';

import { makeStyles } from '@material-ui/core';
import GroupAdd from '@material-ui/icons/GroupAdd';
import { Link } from 'react-router-dom';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';

type InboxThreadCreatorActionProps = {
  threadType: ChatThreadKinds;
  onNavigate?: () => void;
};

const createActionsRoutes = {
  smartlist: '/smart-list?create=true',
};

const ThreadCreatorIconAction: React.FC<InboxThreadCreatorActionProps> =
  React.memo(({ threadType, onNavigate }) => {
    const classes = useStyles();

    const createActionRoute =
      threadType === ChatThreadKinds.Smartlist
        ? createActionsRoutes[threadType]
        : null;

    return createActionRoute ? (
      <Link
        className={classes.dialogActionContainer}
        onClick={onNavigate}
        target="_blank"
        to={createActionRoute}
      >
        <GroupAdd />
      </Link>
    ) : (
      <button className={classes.dialogActionContainer} type="button">
        <GroupAdd />
      </button>
    );
  });

const useStyles = makeStyles((theme) => ({
  innerPadding: {
    padding: theme.spacing(2),
  },
  inputWithActionContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  smartlistRefreshContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  dialogActions: {
    borderTop: `solid ${theme.palette.grey['300']} 1px`,
  },
  dialogActionContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.5),
    background: theme.palette.grey[200],
    border: 'none',
    cursor: 'pointer',
    color: theme.palette.common.black,
    '&:hover': {
      color: theme.palette.common.black,
    },
    '&:focus': {
      color: theme.palette.common.black,
    },
  },
}));

export default ThreadCreatorIconAction;
