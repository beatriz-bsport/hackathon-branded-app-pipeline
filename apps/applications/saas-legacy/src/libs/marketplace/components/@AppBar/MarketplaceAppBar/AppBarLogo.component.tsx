import React from 'react';

import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import classnames from 'classnames';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';

import { httpParser } from '#src/libs/marketplace/utils';
import { Franchise } from '#src/libs/franchise/types';
import { Company } from '#src/libs/company/types';

type LogoProps = {
  isWidget?: boolean;
  logo?: string;
  websiteURL?: string;
  title?: string;
  franchisor: Franchise | null;
  onCompanySelected: (c: Company) => void;
};

const AppBarLogo: React.FC<LogoProps> = ({
  isWidget,
  logo,
  websiteURL,
  title,
  franchisor,
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
        >
          <img alt="bsport logo" className={classes.logo} src={logo} />
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
  },
  title: {
    marginLeft: theme.spacing(2),
    display: 'block',
  },
  logo: {
    objectFit: 'cover',
    maxHeight: 40,
    width: '100%',
  },
}));

export default AppBarLogo;
