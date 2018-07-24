import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  List,
  Grid,
  Typography,
  Button,
  ListItem,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import { ConsumerListItem } from './components';

const styles = (theme) => ({
  container: {},
});

export class ConsumerPaymentPackConsumersTable extends Component<Props> {
  render() {
    const { t, classes, consumer_payment_packs } = this.props;
    return (
      <List>
        {consumer_payment_packs.map((cpp) => (
          <ListItem>
            {credits ? (
              <Grid container direction="row" alignItems="center">
                <Grid item xs={5}>
                  <ConsumerListItem consumer={cpp.consumer} />
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    {`${cpp.used_credits - credits} ${t(
                      'paymentPack.credits',
                    ).toLowerCase()}`}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Button color="primary" variant="raised">
                    +1
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <Button color="orange" variant="raised">
                    -1
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <ConsumerListItem consumer={cpp.consumer} />
            )}
          </ListItem>
        ))}
      </List>
    );
  }
}

export default withStyles(styles)(
  translate()(ConsumerPaymentPackConsumersTable),
);
