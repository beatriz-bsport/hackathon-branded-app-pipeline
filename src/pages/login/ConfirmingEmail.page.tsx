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
import themeSelectors from '#src/libs/theme/selectors';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';
// @ts-expect-error
import { requestConfirmationEmail as requestConfirmationEmailAction } from '../../actions/auth.actions';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '../../libs/theme/actions';

type Props = {
  fetchCompanyTheme: (companyId: number) => void;
  requestConfirmationEmail: (
    uuid: string,
    company: number,
    options: any,
  ) => void;
  uuid: string;
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
    fetchAccessLevel,
    width,
  } = props;
  useEffect(() => {
    fetchCompanyTheme(companyId);
  }, [companyId, fetchCompanyTheme]);
  useEffect(() => {
    requestConfirmationEmail(uuid, companyId, {
      // @ts-expect-error
      onSuccess: ({ token }) => fetchAccessLevel(token),
    });
  }, [
    companyId,
    fetchAccessLevel,
    fetchCompanyTheme,
    requestConfirmationEmail,
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
  // @ts-expect-error
  routerParamsToProps({ uuid: 'uuid' }),
  withQueryParams([['membership'], 'queryParams']),

  withWidth(),
  withProps(({ queryParams, uuid }) => ({
    companyId: parseInt(queryParams?.membership),
    uuid,
  })),
  connect(
    (state) => ({
      // @ts-expect-error
      emailConfirmed: state.auth.email_confirmed,
      // @ts-expect-error
      theme: themeSelectors.getTheme(state),
    }),
    {
      goToRoot: () => push('/'),
      requestConfirmationEmail: requestConfirmationEmailAction,
      fetchCompanyTheme: fetchCompanyThemeAction,
    },
  ),
  // @ts-expect-error
)(ConfirmingEmailPage);
