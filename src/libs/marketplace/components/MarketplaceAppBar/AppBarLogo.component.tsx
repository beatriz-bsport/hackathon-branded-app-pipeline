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
          variant="outlined"
          onClick={(ev: React.SyntheticEvent<HTMLButtonElement>) =>
            setOpenMenu(ev.currentTarget)
          }
          className={classnames([classes.marginLeft, classes.selector])}
        >
          <Hidden smDown>
            <img
              height={40}
              width={40}
              className={classes.logo}
              src={franchisor.cover}
              alt="bsport logo"
            />
          </Hidden>
          <Hidden smUp>
            <img
              height={40}
              width={40}
              className={classes.logo}
              src={franchisor.cover}
              alt="bsport logo"
            />
          </Hidden>
          <Hidden xsDown>
            <Typography variant="subtitle2" noWrap align="left">
              {currentTheme.company_name}
            </Typography>
          </Hidden>
          <KeyboardArrowDownIcon />
        </ButtonBase>
        <Menu
          onClose={() => setOpenMenu(null)}
          anchorEl={menuOpen}
          keepMounted
          open={!!menuOpen}
        >
          {franchisor.companies
            .filter((c) => !!c && !c.hidden_from_marketplace)
            .map((c) => (
              <MenuItem
                onClick={() => {
                  setOpenMenu(null);
                  onCompanySelected(c);
                }}
                key={c.id}
              >
                <img
                  height={24}
                  width={24}
                  className={classes.logo}
                  src={c.cover || franchisor.cover}
                  alt="bsport logo"
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
        onClick={() => {
          window.location.href = httpParser(websiteURL);
        }}
        className={classes.marginLeft}
      >
        <img height={40} src={logo} alt="bsport logo" />
      </ButtonBase>
    );
  if (logo)
    return (
      <img
        height={40}
        className={classes.marginLeft}
        src={logo}
        alt="bsport logo"
      />
    );
  return (
    <Typography className={classes.title} variant="h6" color="inherit" noWrap>
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
