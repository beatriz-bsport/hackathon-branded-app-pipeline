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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { withTranslation, TFunction } from 'react-i18next';
import { DateTime } from 'luxon';

import OfferListItem from '#src/libs/offer/components/OfferListItemV2.component';

type Props = {
  t: TFunction,
  loading: boolean,
  disabled: boolean,
  edit?: boolean,
  color?: string,

  message: string,
  listTitle: string,

  handleChange: (index: number) => void,
  selectedSimilarOfferIds: Array<Object>,
  similarOffers: Array<Offer>,
  selectAll: () => void,
  unselectAll: () => void,

  onChangeRecursion: ({ modifyRecursively: boolean }) => void,
  dateTimeDiff: number,
  classes: Object,
  modifyRecursively: boolean,

  indexBasedSelection?: boolean,
};

type State = {
  isSimilarOfferListExpanded: boolean,
};
// TODO : FIX ME : https://gitlab.com/bsport/bsport-saas/-/issues/1347
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
    const {
      loading,
      similarOffers,
      selectedSimilarOfferIds,
      classes,
      t,
      indexBasedSelection,
    } = this.props;
    const { isSimilarOfferListExpanded } = this.state;
    return (
      <div>
        <Grid
          container
          alignItems="center"
          className={classes.similarListHeader}
          direction="row"
          justify="space-between"
        >
          <Grid item>
            <Typography variant="body">{this.props.listTitle}</Typography>
          </Grid>
          <Grid item>
            {loading ? (
              <CircularProgress />
            ) : (
              <IconButton onClick={this.expandSimilarOfferList}>
                {!isSimilarOfferListExpanded ? (
                  <ExpandMoreIcon />
                ) : (
                  <ExpandLessIcon />
                )}
              </IconButton>
            )}
          </Grid>
        </Grid>
        <Divider />
        {loading ? null : (
          <Collapse in={isSimilarOfferListExpanded}>
            {!!this.props.selectAll && !!this.props.unselectAll && (
              <React.Fragment>
                <ButtonBase
                  className={classes.selectOption}
                  onClick={this.props.selectAll}
                >
                  <Typography variant="caption">
                    {t('offer:liveOfferEdit.selectAll')}
                  </Typography>
                </ButtonBase>
                <ButtonBase
                  className={classes.selectOption}
                  onClick={this.props.unselectAll}
                >
                  <Typography variant="caption">
                    {t('offer:liveOfferEdit.unselectAll')}
                  </Typography>
                </ButtonBase>
              </React.Fragment>
            )}
            {!similarOffers?.length ? (
              <div className={classes.noSimilarOfferMessage}>
                <Typography variant="body">
                  {t('offer:liveOfferEdit.noSimilarOffer')}
                </Typography>
              </div>
            ) : (
              <List component="nav">
                {(similarOffers || []).map((so, index) => (
                  <OfferListItem
                    key={so.id}
                    checked={selectedSimilarOfferIds?.includes(so.id)}
                    disabled={index === 0}
                    editing_parameters={
                      this.props.edit && {
                        new_date_start: DateTime.fromISO(so.date_start).plus({
                          millisecond: this.props.dateTimeDiff,
                        }),
                      }
                    }
                    handleChange={
                      index === 0
                        ? () => {}
                        : () =>
                            this.props.handleChange(
                              indexBasedSelection ? index : so.id,
                            )
                    }
                    offer={so}
                    similarOffer={
                      !!this.props.selectAll && !!this.props.unselectAll
                    }
                  />
                ))}
              </List>
            )}
          </Collapse>
        )}
      </div>
    );
  };

  renderSwitchButton = () => {
    const { color, disabled, modifyRecursively, onChangeRecursion } =
      this.props;

    return (
      <Switch
        checked={modifyRecursively}
        color={color || 'primary'}
        disabled={disabled}
        onChange={onChangeRecursion}
      />
    );
  };

  render() {
    const { modifyRecursively, message } = this.props;
    return (
      <div>
        <Grid
          container
          alignItems="center"
          direction="row"
          spacing={2}
          wrap="nowrap"
        >
          <Grid item>{this.renderSwitchButton()}</Grid>
          <Grid item>
            <Typography>{message}</Typography>
          </Grid>
        </Grid>
        {modifyRecursively && this.renderSimilarOffers()}
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
  noSimilarOfferMessage: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});

export default withStyles(styles)(withTranslation()(RecursionToogle));
