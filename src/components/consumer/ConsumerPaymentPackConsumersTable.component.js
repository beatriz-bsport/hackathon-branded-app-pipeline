import React, { Component } from 'react';

import {
  Grid,
  Typography,
  Button,
  Divider,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import ConsumerRowSummary from './ConsumerRowSummary.component';

const styles = (theme) => ({
  horizontalDivider: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
});

type Props = {};

export class ConsumerPaymentPackConsumersTable extends Component<Props> {
  renderConsumerPackRow = (consumerPaymentPack) => {
    const { classes, t } = this.props;
    const { credits } = this.props.paymentPack;
    const { used_credits, consumer } = consumerPaymentPack;
    const negativeCredit = credits - used_credits <= 0;
    return (
      <div>
        <Divider className={classes.horizontalDivider} />
        <Grid item>
          {credits ? (
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="space-between"
              spacing={24}
            >
              <Grid item>
                <ConsumerRowSummary consumer={consumer} />
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="row"
                  spacing={16}
                  alignItems="center"
                >
                  <Grid item>
                    <Typography color={negativeCredit ? 'primary' : 'error'}>
                      {`${used_credits - credits} ${t(
                        'paymentPack.credits',
                      ).toLowerCase()}`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button color="primary" variant="raised">
                      +1
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button color="orange" variant="raised">
                      -1
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <ConsumerRowSummary consumer={consumer} />
          )}
        </Grid>
      </div>
    );
  };

  render() {
    const { paymentPack } = this.props;
    const { consumer_payment_packs } = paymentPack;
    return (
      <Grid container direction="column" spacing={8}>
        {consumer_payment_packs.map(this.renderConsumerPackRow)}
      </Grid>
    );
  }
}

export default withStyles(styles)(
  translate()(ConsumerPaymentPackConsumersTable),
);
