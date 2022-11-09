import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { push } from 'connected-react-router';
import {
  CircularProgress,
  isWidthDown,
  makeStyles,
  withWidth,
} from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import classNames from 'classnames';
import themeSelectors from '#libs/theme/selectors';
import { requestConfirmationEmail as requestConfirmationEmailAction } from '../../actions/auth.actions';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '../../libs/theme/actions';
import withQueryParams from '#hocs/with-query-params.hoc';

type Props = {
  fetchCompanyTheme: (companyId: number) => void;
  requestConfirmationEmail: (
    uuid: string,
    token: string,
    company: number,
    options: any,
  ) => void;
  uuid: string;
  token: string;
  companyId: number;
  fetchAccessLevel: (token: string) => void;
  width: Breakpoint;
};

export const ConfirmingEmailPage = (props: Props) => {
  const {
    companyId,
    fetchCompanyTheme,
    requestConfirmationEmail,
    uuid,
    token,
    fetchAccessLevel,
    width,
  } = props;
  useEffect(() => {
    fetchCompanyTheme(companyId);
  }, [companyId, fetchCompanyTheme]);
  useEffect(() => {
    requestConfirmationEmail(uuid, token, companyId, {
      onSuccess: () => fetchAccessLevel(token),
    });
  }, [
    companyId,
    fetchAccessLevel,
    fetchCompanyTheme,
    requestConfirmationEmail,
    token,
    uuid,
  ]);

  const isMobile = isWidthDown('xs', width);
  const classes = useStyles();
  return (
    <div
      className={classNames({
        [classes.container]: !isMobile,
        [classes.containerMobile]: isMobile,
      })}
    >
      <CircularProgress size={60} />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    background: 'transparent',
  },
  containerMobile: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
  },
}));

export default compose(
  routerParamsToProps({ uuid: 'uuid', token: 'token' }),
  withQueryParams([['membership'], 'queryParams']),

  withWidth(),
  withProps(({ queryParams, uuid, token }) => ({
    companyId: parseInt(queryParams?.membership),
    uuid,
    token,
  })),
  connect(
    (state) => ({
      emailConfirmed: state.auth.email_confirmed,
      theme: themeSelectors.getTheme(state),
    }),
    {
      goToRoot: () => push('/'),
      requestConfirmationEmail: requestConfirmationEmailAction,
      fetchCompanyTheme: fetchCompanyThemeAction,
    },
  ),
)(ConfirmingEmailPage);
