import React from 'react';

import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { httpParser } from '#libs/marketplace/utils';

type LogoProps = {
  isWidget?: boolean;
  logo?: string;
  websiteURL?: string;
  title?: string;
};

const AppBarLogo: React.FC<LogoProps> = ({
  isWidget,
  logo,
  websiteURL,
  title,
}) => {
  const classes = useStyles();

  if (isWidget) return <div />;
  if (logo && websiteURL)
    return (
      <ButtonBase
        onClick={() => {
          window.location.href = httpParser(websiteURL);
        }}
        className={classes.icon}
      >
        <img height={40} src={logo} alt="bsport logo" />
      </ButtonBase>
    );
  if (logo) return <img height={40} src={logo} alt="bsport logo" />;
  return (
    <Typography className={classes.title} variant="h6" color="inherit" noWrap>
      {title}
    </Typography>
  );
};
const useStyles = makeStyles((theme) => ({
  icon: {
    marginLeft: theme.spacing(2),
  },
  title: {
    display: 'block',
  },
}));

export default AppBarLogo;
