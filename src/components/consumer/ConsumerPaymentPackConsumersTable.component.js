import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  List,
  Grid,
  Typography,
  Button,
  ListItem,
  Divider,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import { ConsumerRowSummary } from '../../components';

const styles = (theme) => ({
  horizontalDivider: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
});

export class ConsumerPaymentPackConsumersTable extends Component<Props> {
  render() {
    const { t, classes, paymentPack } = this.props;
    const { consumer_payment_packs, credits } = paymentPack;
    return (
      <Grid container direction="column" spacing={8}>
        {consumer_payment_packs.map((cpp) => {
          const { used_credits, consumer } = cpp;
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
                          <Typography
                            color={negativeCredit ? 'primary' : 'error'}
                          >
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
        })}
      </Grid>
    );
  }
}

export default withStyles(styles)(
  translate()(ConsumerPaymentPackConsumersTable),
);
