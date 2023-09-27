// @ts-nocheck
import React from 'react';

import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classnames from 'classnames';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';

import { httpParser } from '#libs/marketplace/utils';
import { Franchise } from '#libs/franchise/types';
import { Company } from '#libs/company/types';
import { CompanyTheme } from '#libs/theme/types';

type LogoProps = {
  isWidget?: boolean;
  logo?: string;
  websiteURL?: string;
  title?: string;
  franchisor: Franchise | null;
  onCompanySelected: (c: Company) => void;
  currentTheme: CompanyTheme | null;
};

const AppBarLogo: React.FC<LogoProps> = ({
  isWidget,
  logo,
  websiteURL,
  title,
  franchisor,
  currentTheme,
  onCompanySelected,
}) => {
  const classes = useStyles();

  const [menuOpen, setOpenMenu] = React.useState<HTMLElement | null>(null);

  if (isWidget) return <div />;

  if (franchisor && onCompanySelected)
    return (
      <>
        <ButtonBase
          className={classnames([classes.marginLeft, classes.selector])}
          onClick={(ev: React.SyntheticEvent<HTMLButtonElement>) =>
            setOpenMenu(ev.currentTarget)
          }
          variant="outlined"
        >
          <Hidden smDown>
            <img
              alt="bsport logo"
              className={classes.logo}
              height={40}
              src={logo}
              width={40}
            />
          </Hidden>
          <Hidden smUp>
            <img
              alt="bsport logo"
              className={classes.logo}
              height={40}
              src={logo}
              width={40}
            />
          </Hidden>
          <Hidden xsDown>
            <Typography noWrap align="left" variant="subtitle2">
              {currentTheme.company_name}
            </Typography>
          </Hidden>
          <KeyboardArrowDownIcon />
        </ButtonBase>
        <Menu
          keepMounted
          anchorEl={menuOpen}
          onClose={() => setOpenMenu(null)}
          open={!!menuOpen}
        >
          {franchisor.companies
            .filter((c) => !!c && !c.hidden_from_marketplace)
            .map((c) => (
              <MenuItem
                key={c.id}
                onClick={() => {
                  setOpenMenu(null);
                  onCompanySelected(c);
                }}
              >
                <img
                  alt="bsport logo"
                  className={classes.logo}
                  height={24}
                  src={c.cover || franchisor.cover}
                  width={24}
                />
                <ListItemText>{c.name}</ListItemText>
              </MenuItem>
            ))}
        </Menu>
      </>
    );
  if (logo && websiteURL)
    return (
      <ButtonBase
        className={classes.marginLeft}
        onClick={() => {
          window.location.href = httpParser(websiteURL);
        }}
      >
        <img alt="bsport logo" height={40} src={logo} />
      </ButtonBase>
    );
  if (logo)
    return (
      <img
        alt="bsport logo"
        className={classes.marginLeft}
        height={40}
        src={logo}
      />
    );
  return (
    <Typography noWrap className={classes.title} color="inherit" variant="h6">
      {title}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  marginLeft: {
    marginLeft: theme.spacing(2),
  },
  selector: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '25vw',
    },
    [theme.breakpoints.up('xs')]: {
      maxWidth: '20vw',
    },
    marginLeft: theme.spacing(1),
    maxHeight: 50,
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(1),
    border: '1px solid #c2c2c2',
  },
  title: {
    marginLeft: theme.spacing(2),
    display: 'block',
  },
  logo: {
    objectFit: 'cover',
  },
}));

export default AppBarLogo;
