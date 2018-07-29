import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Paper, CircularProgress, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { EstablishmentCard, Map } from '../components';

const styles = (theme) => ({
  container: {},
});

type Props = {
  establishments: Array,
};

export class EstablishmentList extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      selectedEstablishment: null,
    };
  }

  establishmentSelected = (establishmentId) => {
    const { establishments } = this.props;

    const selectedEstablishment =
      establishments.filter((e) => e.id === establishmentId)[0] || null;
    this.setState({
      selectedEstablishment,
    });
  };

  renderEstablishment = () => {
    const { selectedEstablishment } = this.state;
    if (selectedEstablishment) {
      return <EstablishmentCard establishment={selectedEstablishment} />;
    }
    return null;
  };

  render() {
    const { classes, t, loading, establishments } = this.props;
    const { selectedEstablishment } = this.state;
    if (loading) {
      return <CircularProgress />;
    }
    return (
      <Grid container spacing={16}>
        <Grid item xs={12} md={6}>
          <Paper>
            <Map
              markers={establishments}
              markerClicked={this.establishmentSelected}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          {this.renderEstablishment()}
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.establishment.loading,
    establishments: state.establishment.all,
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps)(EstablishmentList)),
);
