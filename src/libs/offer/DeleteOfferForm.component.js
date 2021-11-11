// @flow

import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import WarningIcon from '@material-ui/icons/Warning';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import { withTranslation } from 'react-i18next';

import RecursiveToogle from './form/RecursionToogle.component';
import RedButton from '../../components/button/RedButton.component';

type Props = {
  t: (x: string) => string,
  onCancel: () => void,
  offerWasCancelled: ?boolean,
  processing: ?boolean,
  onHardDelete: (data: any) => void,
  onCancelOffer: ({ cashback: boolean, notify: boolean }) => void,
  fetchSimilarOffers: () => void,
  similarOfferLoading: boolean,
  similarOffers: Array<Offer>,
  classes: Object,
  setOpenDeleteDialog: () => void,
  offer: Offer,
};

type State = {
  notify: boolean,
  cashback: boolean,
  deleteAll: boolean,
  similarOffersWithSelectedStatus: Array<Object>,
};

export class DeleteOfferForm extends Component<Props, State> {
  state = {
    notify: true,
    cashback: true,
    deleteAll: false,
    force: false,
    similarOffersWithSelectedStatus: (this.props.similarOffers || []).map(
      (so) => ({
        ...so,
        selected: true,
      }),
    ),
  };

  componentDidUpdate(prevProps: Props) {
    if (
      (prevProps.similarOffers || []).length !==
      (this.props.similarOffers || []).length
    ) {
      this.setState({
        similarOffersWithSelectedStatus: (this.props.similarOffers || []).map(
          (so) => ({ ...so, selected: true }),
        ),
      });
    }
  }

  handleChangeSelection = (index: number) => {
    this.setState((prevState) => {
      const similarOffersWithSelectedStatus = [
        ...prevState.similarOffersWithSelectedStatus,
      ];
      similarOffersWithSelectedStatus[index] = {
        ...similarOffersWithSelectedStatus[index],
        selected: !prevState.similarOffersWithSelectedStatus[index].selected,
      };
      return { similarOffersWithSelectedStatus };
    });
  };

  selectAll = () => {
    this.setState((prevState) => ({
      similarOffersWithSelectedStatus:
        prevState.similarOffersWithSelectedStatus.map((so) => ({
          ...so,
          selected: true,
        })),
    }));
  };

  unselectAll = () => {
    this.setState((prevState) => ({
      similarOffersWithSelectedStatus:
        prevState.similarOffersWithSelectedStatus.map((so, index) => ({
          ...so,
          selected: index === 0,
        })),
    }));
  };

  componentWillMount() {
    this.props.fetchSimilarOffers();
  }

  onCreditBackSwitch = (event: Object) => {
    this.setState({ cashback: event.target.checked });
  };

  onNotifySwitch = (event: Object) => {
    this.setState({ notify: event.target.checked });
  };

  onConfirm = () => {
    const { offerWasCancelled } = this.props;
    const { notify, cashback } = this.state;
    let { deleteAll } = this.state;
    if (offerWasCancelled) {
      deleteAll =
        deleteAll &&
        !this.state.similarOffersWithSelectedStatus.filter(
          (so) => !so.available && !so.selected,
        ).length &&
        !!this.state.similarOffersWithSelectedStatus.length;
      const custom_selection =
        !!this.state.similarOffersWithSelectedStatus.filter(
          (so) => !so.available && !so.selected,
        ).length;
      const custom_selection_ids = this.state.similarOffersWithSelectedStatus
        .filter((so) => !so.available && so.selected)
        .map((so) => so.id);
      return this.props.onHardDelete({
        deleteAll,
        custom_selection,
        custom_selection_ids,
        force: this.state.force,
      });
    }
    deleteAll =
      deleteAll &&
      !this.state.similarOffersWithSelectedStatus.filter(
        (so) => so.available && !so.selected,
      ).length &&
      !!this.state.similarOffersWithSelectedStatus.length;
    const custom_selection =
      !!this.state.similarOffersWithSelectedStatus.filter(
        (so) => so.available && !so.selected,
      ).length;
    const custom_selection_ids = this.state.similarOffersWithSelectedStatus
      .filter((so) => so.available && so.selected)
      .map((so) => so.id);
    return this.props.onCancelOffer({
      notify,
      cashback,
      deleteAll,
      custom_selection,
      custom_selection_ids,
    });
  };

  renderInside = () => {
    const { t, classes, offerWasCancelled } = this.props;
    if (offerWasCancelled) {
      return (
        <div>
          <Typography>{t('form.offer.delete.explainHardDelete')}</Typography>
          <RecursiveToogle
            color="secondary"
            disabled={this.props.processing}
            shouldModifyAllDates={this.state.deleteAll}
            message={this.props.t('offer:liveOfferEdit.deleteSimilarOffers')}
            listTitle={this.props.t('offer:liveOfferEdit.selectDelete')}
            loading={this.props.similarOfferLoading}
            // similarOffers={this.props.similarOffers}
            onChangeRecursion={({ modifyRecursively }) =>
              this.setState({ deleteAll: modifyRecursively })
            }
            similarOffersWithSelectedStatus={this.state.similarOffersWithSelectedStatus.filter(
              (so) => !so.available,
            )}
            selectAll={this.selectAll}
            unselectAll={this.unselectAll}
            handleChange={this.handleChangeSelection}
          />
          <div className={classes.rowRight}>
            <IconButton
              onClick={() =>
                this.setState((prevState) => ({
                  showForce: !prevState.showForce,
                }))
              }
            >
              <ExpandMoreIcon />
            </IconButton>
            <Typography variant="h6">
              {t('form.offer.delete.advanced')}
            </Typography>
          </div>
          <Divider />
          <Collapse in={this.state.showForce}>
            <div className={classes.rowPadded}>
              <Switch
                checked={this.state.force}
                onChange={() =>
                  this.setState((prevState) => ({ force: !prevState.force }))
                }
              />
              <Typography>{t('form.offer.delete.force')}</Typography>
            </div>
            <div className={classes.danger}>
              <WarningIcon className={classes.iconLeft} />
              <Typography variant="caption">
                {t('form.offer.delete.explainForceDanger')}
              </Typography>
            </div>
          </Collapse>
        </div>
      );
    }
    const { notify, cashback, deleteAll } = this.state;
    return (
      <div>
        <Typography className={classes.explainText}>
          {t('form.offer.delete.explainModalities')}
        </Typography>
        <Hidden xsUp>
          <div className={classes.row}>
            <Switch
              disabled
              checked={cashback}
              onChange={this.onCreditBackSwitch}
            />
            <Typography disabled>
              {t('form.offer.delete.explainCreditBack')}
            </Typography>
          </div>
        </Hidden>
        <div className={classes.row}>
          <Switch
            disabled={this.props.processing}
            checked={notify}
            onChange={this.onNotifySwitch}
          />
          <Typography className={classes.explainNotify}>
            {t('form.offer.delete.explainNotify')}
          </Typography>
        </div>
        <RecursiveToogle
          color="secondary"
          disabled={this.props.processing}
          shouldModifyAllDates={deleteAll}
          message={this.props.t('offer:liveOfferEdit.cancelSimilarOffers')}
          listTitle={this.props.t('offer:liveOfferEdit.selectCancel')}
          loading={this.props.similarOfferLoading}
          onChangeRecursion={({ modifyRecursively }) =>
            this.setState({ deleteAll: modifyRecursively })
          }
          similarOffersWithSelectedStatus={this.state.similarOffersWithSelectedStatus.filter(
            (so) => so.available,
          )}
          selectAll={this.selectAll}
          unselectAll={this.unselectAll}
          handleChange={this.handleChangeSelection}
        />
      </div>
    );
  };

  render() {
    const { t, processing, onCancel, offerWasCancelled } = this.props;
    return (
      <React.Fragment>
        <DialogTitle>
          {offerWasCancelled
            ? t('form.offer.deleteTitle')
            : t('form.offer.cancelTitle')}
        </DialogTitle>
        {this.renderInside()}
        <DialogActions>
          <Button disabled={processing} onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          {processing ? (
            <CircularProgress />
          ) : (
            <RedButton
              onClick={() => {
                if (
                  offerWasCancelled &&
                  (this.props.offer.nb_bookings > 0 ||
                    this.props.offer.nb_option > 0) &&
                  !this.state.force
                ) {
                  this.props.setOpenDeleteDialog(true);
                } else this.onConfirm();
              }}
            >
              {t('common.confirm')}
            </RedButton>
          )}
        </DialogActions>
      </React.Fragment>
    );
  }
}

const styles = (theme) => ({
  explainText: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#F2F2F2',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowPadded: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  rowRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  explainNotify: {
    marginLeft: theme.spacing(2),
  },
  danger: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    borderRadius: 8,
    border: `1px solid ${theme.palette.error.dark}`,
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
  },
  iconLeft: {
    marginRight: theme.spacing(2),
  },
});

export default withTranslation()(withStyles(styles)(DeleteOfferForm));
