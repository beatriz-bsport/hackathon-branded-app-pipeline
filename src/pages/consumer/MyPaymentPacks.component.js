// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import type { TFunction } from 'react-i18next';
import ConsumerPacks from '../../components/consumer/ConsumerPacks.component';
import ConsumerMenu from '../../components/navigation/ConsumerMenu.component';
import type { ConsumerPaymentPackConsumerView } from '../../api/types';
import { getPrivateConsumerPassListWithCredit } from '../../libs/private-service/selectors/private-consumer-pass';
import PrivateConsumerPassBookerListItem from '../../libs/private-service/components/booking-module/PrivateConsumerPassBookerListItem.component';
import { fetchPrivateConsumerPassList } from '../../libs/private-service/actions';

const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    overflow: 'auto',
    maxWidth: '100vw',
  },
});

type Props = {
  consumerPaymentPacks: Array<ConsumerPaymentPackConsumerView>,
  privateConsumerPass: Array<PrivateConsumerPass>,
  fetchPrivateConsumerPassList: () => void,
  t: TFunction,
  classes: Object,
};

export class MyPaymentPacks extends Component<Props> {
  componentDidMount() {
    this.props.fetchPrivateConsumerPassList();
  }

  render() {
    const {
      consumerPaymentPacks,
      privateConsumerPass,
      t,
      classes,
    } = this.props;
    return (
      <ConsumerMenu>
        <Grid
          container
          direction="column"
          spacing={16}
          className={classes.container}
        >
          <Grid item>
            <Typography variant="h6">{t('consumer.myPaymentPacks')}</Typography>
          </Grid>
          <Grid item xs={12} lg={8}>
            <ConsumerPacks packs={consumerPaymentPacks} />
          </Grid>
          {privateConsumerPass && privateConsumerPass.length ? (
            <React.Fragment>
              <Grid item>
                <Typography variant="h6">
                  {t('consumer.myPrivatePass')}
                </Typography>
              </Grid>
              <Grid item xs={12} lg={8}>
                <Paper>
                  <List disablePadding>
                    {privateConsumerPass.map((cpc) => (
                      <PrivateConsumerPassBookerListItem
                        divider
                        private_consumer_pass={cpc}
                      />
                    ))}
                  </List>
                </Paper>
              </Grid>
            </React.Fragment>
          ) : null}
        </Grid>
      </ConsumerMenu>
    );
  }
}

export default withStyles(styles)(
  withNamespaces()(
    connect(
      (state) => ({
        consumerPaymentPacks: state.consumer.consumerPaymentPacks,
        privateConsumerPass: getPrivateConsumerPassListWithCredit(state),
      }),
      {
        fetchPrivateConsumerPassList,
      },
    )(MyPaymentPacks),
  ),
);
