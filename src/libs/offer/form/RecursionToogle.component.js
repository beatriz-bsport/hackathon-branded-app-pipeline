// @flow

import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
// import OfferMinimalSummary from '../../../components/offer/OfferMinimalSummary.component';
import OfferListItem from '../components/OfferListItemV2.component';

type Props = {
  loading: boolean,
  disabled: boolean,
  color: ?string,

  message: string,
  listTitle: string,

  shouldModifyAllDates: boolean,
  similarOffers: Array<Offer>,

  onChangeRecursion: ({ modifyRecursively: boolean }) => void,
  dateTimeDiff: number,
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
                <OfferListItem
                  offer={so}
                  editing_parameters={{
                    new_date_start: moment(so.date_start).add(
                      this.props.dateTimeDiff,
                      'milliseconds',
                    ),
                  }}
                />
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
          spacing={2}
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
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

export default withStyles(styles)(withTranslation()(RecursionToogle));
