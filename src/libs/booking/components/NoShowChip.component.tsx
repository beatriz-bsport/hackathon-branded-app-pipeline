import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CancelIcon from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';
import ToolTip from '#components/Tooltip.component';

export type Props = {
  tooltipMessage?: string;
  small?: boolean;
};

export const NoShowChip = (props: Props) => {
  const { t } = useTranslation('booking');
  const classes = useStyles();
  return (
    <ToolTip title={props.tooltipMessage}>
      <div className={classes.container}>
        <CancelIcon className={classes.icon} />
        {!props.small && (
          <Typography className={classes.text}>
            {t('noShowChip.title')}
          </Typography>
        )}
      </div>
    </ToolTip>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.spacing(0.5),
    backgroundColor: '#FFF0EF',
    height: theme.spacing(3),
    marginRight: theme.spacing(1.5),
    padding: theme.spacing(0.5),
  },
  icon: {
    color: theme.palette.error.main,
    height: theme.spacing(2),
  },
  text: { color: theme.palette.error.main, fontSize: theme.spacing(1.5) },
}));

export default NoShowChip;
