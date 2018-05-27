import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { TopBar, NavBar } from '../components';
import Calendar from './Calendar.component';
import Dashboard from './Dashboard.component';
import ResponsiveDrawer from './ResponsiveDrawer.component';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
});

export class Backoffice extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: true,
    };
  }

  toogleDrawer = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  render() {
    const { classes } = this.props;
    const { drawerOpen } = this.state;

    if (!this.props.authenticated) {
      return <Redirect push to="/login" />;
    }
    /*
        <TopBar toogleDrawer={this.toogleDrawer} />
        {drawerOpen ? <NavBar /> : null}
        */

    return (
      <ResponsiveDrawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Route exact path="/" component={Dashboard} />
          <Route path="/calendar" component={Calendar} />
        </main>
      </ResponsiveDrawer>
    );
  }
}

const themedBackoffice = withStyles(styles)(Backoffice);

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

export default connect(mapStateToProps)(themedBackoffice);
