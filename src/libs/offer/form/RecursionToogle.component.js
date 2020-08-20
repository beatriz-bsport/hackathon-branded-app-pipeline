// @flow

import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import withStyles from '@material-ui/core/styles/withStyles';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import type { TFunction } from 'react-i18next';
// import OfferMinimalSummary from '../../../components/offer/OfferMinimalSummary.component';
import OfferListItem from '../components/OfferListItemV2.component';

type Props = {
  t: TFunction,
  loading: boolean,
  disabled: boolean,
  color: ?string,

  message: string,
  listTitle: string,

  shouldModifyAllDates: boolean,
  handleChange: (index: number) => void,
  similarOffersWithSelectedStatus: Array<Object>,
  selectAll: () => void,
  unselectAll: () => void,

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
    const { loading, similarOffersWithSelectedStatus, classes, t } = this.props;
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
            <ButtonBase
              onClick={this.props.selectAll}
              className={classes.selectOption}
            >
              <Typography variant="caption">
                {t('offer:liveOfferEdit.selectAll')}
              </Typography>
            </ButtonBase>
            <ButtonBase
              onClick={this.props.unselectAll}
              className={classes.selectOption}
            >
              <Typography variant="caption">
                {t('offer:liveOfferEdit.unselectAll')}
              </Typography>
            </ButtonBase>
            <List component="nav">
              {(similarOffersWithSelectedStatus || []).map((so, index) => (
                <OfferListItem
                  similarOffer
                  disabled={index === 0}
                  offer={so}
                  editing_parameters={{
                    new_date_start: moment(so.date_start).add(
                      this.props.dateTimeDiff,
                      'milliseconds',
                    ),
                  }}
                  handleChange={
                    index === 0
                      ? () => {}
                      : () => this.props.handleChange(index)
                  }
                  checked={so.selected}
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
  selectOption: {
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: 'grey',
    '&:hover': {
      color: 'black',
    },
  },
});

export default withStyles(styles)(withTranslation()(RecursionToogle));
