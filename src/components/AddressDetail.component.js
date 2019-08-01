// @flow

import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

type Props = {
  address: *,
  classes: *,
};
type State = {};

export class AddressDetail extends Component<Props, State> {
  state = {};

  render() {
    const { address, classes } = this.props;
    return (
      <div className="address-detail">
        <div className={classes.content}>
          <p>
            {address.address}
            <br />
            {address.postal_code} {address.city}
          </p>
        </div>
      </div>
    );
  }
}

const styles = () => ({
  content: {
    textTransform: 'uppercase',
  },
});

export default withStyles(styles)(AddressDetail);
