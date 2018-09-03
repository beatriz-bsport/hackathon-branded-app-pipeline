import React, { Component } from 'react';

import { Modal, Paper, withStyles } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

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

type Props = {};

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
      return <Redirect push to="/" />;
    }

    return (
      <div>
        <ConsumerMenu />
        <Modal className={classes.modal} open>
          <Paper className={classes.paperContainer}>
            <ConsumerLogin />
          </Paper>
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
