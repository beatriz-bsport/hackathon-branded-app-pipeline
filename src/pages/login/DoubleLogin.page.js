// @flow
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { parseQueryString } from '../../http';

type Props = {
  t: TFunction,
};

export const DoubleLogin = (props: Props) => {
  const classes = useStyles();
  const { membership } = parseQueryString(window.location.search);
  return (
    <div className={classes.container}>
      <div className={classes.insideContainer}>
        <InfoOutlinedIcon fontSize="large" />
        <div>
          <div className={classes.text}>
            <Typography>{props.t('doubleLogin.explain')}</Typography>
          </div>
          <div className={classes.actions}>
            <Link
              style={{ 'text-decoration': 'none' }}
              to={`/login/signout${
                membership ? `?membership=${membership}` : ''
              }`}
            >
              <Button variant="outlined" color="secondary">
                {props.t('doubleLogin.disconnect')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
    flexDirection: 'column',
  },
  text: {
    marginBottom: theme.spacing(2),
  },
  insideContainer: {
    border: '1px solid #DEDEDE',
    borderRadius: theme.spacing(2),
    backgroundColor: '#F2F2F2',
    padding: theme.spacing(3),
    maxWidth: 800,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& > *': {
      marginRight: theme.spacing(4),
    },
  },
  actions: {
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default compose(withTranslation(['login']))(DoubleLogin);
