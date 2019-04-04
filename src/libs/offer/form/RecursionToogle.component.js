// @flow

import React, { Component } from 'react';
import {
  Grid,
  Typography,
  Switch,
  CircularProgress,
  Collapse,
  IconButton,
  List,
  Divider,
  withStyles,
} from '@material-ui/core';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import { withNamespaces } from 'react-i18next';

import OfferMinimalSummary from '../../../components/offer/OfferMinimalSummary.component';

type Props = {
  loading: boolean,
  disabled: boolean,
  color: ?string,

  message: string,
  listTitle: string,

  shouldModifyAllDates: boolean,
  similarOffers: Array<Offer>,

  onChangeRecursion: ({ modifyRecursively: boolean }) => void,

  classes: Object,
};

type State = {
  isSimilarOfferListExpanded: boolean,
};

export class RecursionToogle extends Component<Props, State> {
  state = {
    isSimilarOfferListExpanded: true,
  };

  expandSimilarOfferList = () => {
    this.setState((prevState) => ({
      isSimilarOfferListExpanded: !prevState.isSimilarOfferListExpanded,
    }));
  };

  renderSimilarOffers = () => {
    const { loading, similarOffers, classes } = this.props;
    const { isSimilarOfferListExpanded } = this.state;

    return (
      <div>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.similarListHeader}
        >
          <Grid item>
            <Typography variant="body">{this.props.listTitle}</Typography>
          </Grid>
          <Grid item>
            {loading ? (
              <CircularProgress />
            ) : (
              <IconButton onClick={this.expandSimilarOfferList}>
                <ExpandIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
        <Divider />
        {loading ? null : (
          <Collapse in={isSimilarOfferListExpanded}>
            <List component="nav">
              {(similarOffers || []).map((so) => (
                <OfferMinimalSummary offer={so} />
              ))}
            </List>
          </Collapse>
        )}
      </div>
    );
  };

  renderSwitchButton = () => (
    <Switch
      color={this.props.color || 'primary'}
      checked={this.props.shouldModifyAllDates}
      disabled={this.props.disabled}
      onChange={(event) => {
        this.props.onChangeRecursion({
          modifyRecursively: event.target.checked,
        });
      }}
    />
  );

  render() {
    const { shouldModifyAllDates } = this.props;
    return (
      <div>
        <Grid
          container
          direction="row"
          spacing={16}
          alignItems="center"
          wrap="nowrap"
        >
          <Grid item>{this.renderSwitchButton()}</Grid>
          <Grid item>
            <Typography>{this.props.message}</Typography>
          </Grid>
        </Grid>
        {shouldModifyAllDates ? this.renderSimilarOffers() : null}
      </div>
    );
  }
}
const styles = (theme) => ({
  similarListHeader: {
    marginTop: theme.spacing.unit * 2,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

export default withStyles(styles)(withNamespaces()(RecursionToogle));
