import React from 'react';
// @ts-ignore
import memoize from 'memoize-one';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import { Member } from '#libs/member/types';

import { CONTEXT_COMMUNICATION, CONTEXT_MEMBER } from '../constants';

const getHeaderData = memoize(
  (contextIdentifier: number, title: string, member: Member, t: TFunction) => {
    switch (contextIdentifier) {
      case CONTEXT_COMMUNICATION:
        return {
          text: t('communication'),
        };
      case CONTEXT_MEMBER:
        return {
          text: member?.name,
          avatar: member?.photo,
        };
      default:
        return {
          text: title ?? '',
        };
    }
  },
);

type Props = {
  contextIdentifier: number;
  contextMember?: Member;
  contextTitle?: string;
  onDrawerClose: () => void;
};

const CommunicationHeader = (props: Props) => {
  const { contextIdentifier, contextTitle, contextMember, onDrawerClose } =
    props;
  const classes = useStyles();
  const { t } = useTranslation('communication');
  const { avatar, text } = getHeaderData(
    contextIdentifier,
    contextTitle,
    contextMember,
    t,
  );
  return (
    <div className={classes.container}>
      <div className={classes.textContainer}>
        {avatar && (
          <Avatar src={avatar} alt={avatar} className={classes.avatar} />
        )}
        <Typography variant="body1" className={classes.text}>
          {text}
        </Typography>
      </div>
      <IconButton onClick={onDrawerClose} size="small">
        <CloseIcon />
      </IconButton>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingBottom: theme.spacing(1.5),
      paddingTop: theme.spacing(1.5),
    },
    borderBottom: 'solid 1px',
    borderBottomColor: theme.palette.divider,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(2.5),
    },
  },
}));

export default CommunicationHeader;
