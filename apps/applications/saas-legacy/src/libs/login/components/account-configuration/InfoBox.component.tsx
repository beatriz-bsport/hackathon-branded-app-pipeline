import React from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import { InfoOutlined } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import chroma from 'chroma-js';

type OwnProps = {};
type Props = OwnProps;
export const InfoBox: React.FC<Props> = () => {
  const { t } = useTranslation(['login']);
  const classes = useStyles();
  return (
    <div className={classes.blueBox}>
      <InfoOutlined className={clsx(classes.iconLeft, classes.blueIcon)} />
      <Typography className={classes.info} variant="body2">
        {t('login:accountConfiguration.infoGoingBack')}
      </Typography>
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  blueBox: {
    borderRadius: '4px',
    display: 'flex',
    backgroundColor: '#EAF4FC',
    padding: theme.spacing(2),
    alignItems: 'center',
    margin: '16px 0px',
  },
  info: { color: chroma(theme.palette.info.dark).darken(1.5).hex() },
  blueIcon: {
    color: 'rgba(33, 150, 243, 1)',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
}));
export default InfoBox;
