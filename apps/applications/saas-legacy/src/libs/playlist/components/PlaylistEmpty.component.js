// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Typography from '@material-ui/core/Typography';
import { withTranslation, TFunction } from 'react-i18next';

type Props = {
  t: TFunction,
};

export const PlaylistEmpty = (props: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <PlaylistAddIcon className={classes.icon} />
      <Typography color="textSecondary">
        {props.t('playlist.noVideo')}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    minHeight: '50vh',
    border: '5px solid #E4E4E4',
    borderRadius: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 120,
    width: 120,
    color: theme.palette.text.secondary,
  },
}));

export default compose(withTranslation(['video']))(PlaylistEmpty);
