// @flow

import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import qs from 'query-string';

import { ConsumerModalContainer, ConsumerLogin } from '../../components';

type Props = {
  authenticated: boolean,
  t: (x: string) => string,
};

export class ConsumerLoginPage extends Component<Props> {
  /*
  renderCreateAccount = () => (
    <Link to="/create_account" style={{ textDecoration: 'none' }}>
      <Typography color="error" variant="caption">
        {this.props.t('login.noAccount')}
      </Typography>
    </Link>
  );
  */

  render() {
    const { authenticated } = this.props;

    if (authenticated) {
      const { next } = qs.parse(this.props.location.search, {
        ignoreQueryPrefix: true,
      });
      if (next) {
        return <Redirect push to={next} />;
      }
      return <Redirect push to="/" />;
    }

    return (
      <ConsumerModalContainer>
        <ConsumerLogin />
      </ConsumerModalContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default translate()(connect(mapStateToProps)(ConsumerLoginPage));
