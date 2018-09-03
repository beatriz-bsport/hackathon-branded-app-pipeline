import React, { Component } from 'react';

import { Modal, Paper, withStyles } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import qs from 'query-string';

import { ConsumerLogin, ConsumerMenu } from '../../components';

const styles = (theme) => ({
  paperContainer: {
    padding: theme.spacing.unit * 3,
  },
  modal: {
    top: '10%',
    left: '30%',
    position: 'absolute',
    width: 350,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
});

type Props = {
  authenticated: boolean,
  classes: Object,
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
    const { authenticated, classes } = this.props;

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
      <div>
        <ConsumerMenu />
        <Modal open>
          <div className={classes.modal}>
            <Paper className={classes.paperContainer}>
              <ConsumerLogin />
            </Paper>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps)(ConsumerLoginPage)),
);
