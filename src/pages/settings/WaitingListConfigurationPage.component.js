// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import WaitingListConfigurationForm from '../../libs/waiting-list/components/WaitingListConfigurationForm.component';
import {
  fetchConfiguration,
  patchConfiguration,
} from '../../libs/waiting-list/actions';

type Props = {
  fetchWaitingListConfiguration: () => void,
  loading: boolean,
  processing: boolean,
  patchWaitingListConfiguration: (*) => void,
  configuration: ?{
    auto_cancellation_type: number,
    dumb_delay_minutes: number,
    smart_delay_minutes: number,
  },

  classes: *,
};

export class WaitingListConfigurationPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchWaitingListConfiguration();
  }

  render() {
    const { configuration, loading, processing, classes } = this.props;
    if (loading || !configuration) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <WaitingListConfigurationForm
            configuration={configuration}
            processing={processing}
            onSubmit={this.props.patchWaitingListConfiguration}
          />
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      configuration: state.waitingList.configuration.data,
      loading: state.waitingList.configuration.loading,
      processing: state.waitingList.configuration.update.loading,
    }),
    {
      fetchWaitingListConfiguration: fetchConfiguration,
      patchWaitingListConfiguration: patchConfiguration,
    },
  ),
)(WaitingListConfigurationPage);
