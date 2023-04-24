// @ts-nocheck
import { IconProps, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

type Props = {
  Icon: React.ComponentType<IconProps>;
  title: string;
  iconStyle?: IconProps['color'];
};

const FormSectionTitle = React.memo(({ Icon, title, iconStyle }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.sectionTitleContainer}>
      <div className={classes.iconContainer}>
        <Icon className={classes.icon} color={iconStyle ?? 'action'} />
      </div>
      <Typography className={classes.text}>{title}</Typography>
    </div>
  );
});

const useStyles = makeStyles((theme) => ({
  sectionTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    height: theme.spacing(3),
    marginRight: theme.spacing(1.25),
  },
  icon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
  text: {
    fontWeight: 500,
    fontSize: theme.spacing(2.5),
  },
}));

export default FormSectionTitle;
