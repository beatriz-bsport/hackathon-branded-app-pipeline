// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import WarningIcon from '@material-ui/icons/Warning';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import { Alert, AlertTitle } from '@material-ui/lab';

import RecursionToogle from './form/RecursionToogle.component';
import RedButton from '../../components/button/RedButton.component';

type Props = {
  t: (x: string) => string,
  onCancel: () => void,
  offerWasCancelled?: boolean,
  processing?: boolean,
  onHardDelete: (data: any) => void,
  onCancelOffer: ({
    cashback: boolean,
    notify: boolean,
    cancel_linked_hybrid_offer: boolean,
  }) => void,
  fetchSimilarOffers: () => void,
  similarOfferLoading: boolean,
  similarOffers: Array<Offer>,
  classes: Object,
  setOpenDeleteDialog: () => void,
  offer: Offer,
  hasPendingReplacementRequest?: boolean,
  setOpenReplacementRequestOnCancel?: (open: boolean) => void,
  openReplacementRequestPageOnCancel?: boolean,
};

type State = {
  notify: boolean,
  cashback: boolean,
  deleteAll: boolean,
  similarOffersWithSelectedStatus: Array<Object>,
  cancelLinkedHybridOffer: boolean,
};

// TODO : FIX ME : https://gitlab.com/bsport/bsport-saas/-/issues/1347
export class DeleteOfferForm extends Component<Props, State> {
  state = {
    notify: true,
    cashback: true,
    deleteAll: false,
    cancelLinkedHybridOffer: true,
    similarOffersWithSelectedStatus: (this.props.similarOffers ?? []).map(
      (so) => ({
        ...so,
        selected: true,
      }),
    ),
  };

  UNSAFE_componentWillMount() {
    this.props.fetchSimilarOffers();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (prevProps.similarOffers ?? []).length !==
      (this.props.similarOffers ?? []).length
    ) {
      this.setState({
        similarOffersWithSelectedStatus: (this.props.similarOffers ?? [])
          .filter(
            (similarOffer) =>
              similarOffer.available === this.props.offer.available,
          )
          .map((so) => ({ ...so, selected: true })),
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

  onCreditBackSwitch = (event: Object) => {
    this.setState({ cashback: event.target.checked });
  };

  onCancelHybridSessionSwitch = (event: Object) => {
    this.setState({ cancelLinkedHybridOffer: event.target.checked });
  };

  onNotifySwitch = (event: Object) => {
    this.setState({ notify: event.target.checked });
  };

  onConfirm = () => {
    const { offerWasCancelled } = this.props;
    const { notify, cashback, cancelLinkedHybridOffer } = this.state;
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
        force: true,
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
      cancel_linked_hybrid_offer: cancelLinkedHybridOffer,
    });
  };

  renderInside = () => {
    const {
      t,
      classes,
      offerWasCancelled,
      similarOfferLoading,
      hasPendingReplacementRequest,
      setOpenReplacementRequestOnCancel,
      openReplacementRequestPageOnCancel,
    } = this.props;
    const { similarOffersWithSelectedStatus } = this.state;

    const selectedSimilarOfferIds = similarOffersWithSelectedStatus
      ? similarOffersWithSelectedStatus
          .filter((offer) => offer.selected)
          .map((_offer) => _offer.id)
      : [];

    const handleChangeRecursion = (ev: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ deleteAll: ev.target.checked });

    if (offerWasCancelled) {
      return (
        <div>
          <Typography>{t('form.offer.delete.explainHardDelete')}</Typography>

          {similarOffersWithSelectedStatus &&
            similarOffersWithSelectedStatus.length > 1 && (
              <RecursionToogle
                indexBasedSelection
                color="secondary"
                disabled={this.props.processing}
                handleChange={this.handleChangeSelection}
                listTitle={this.props.t('offer:liveOfferEdit.selectDelete')}
                loading={similarOfferLoading}
                message={this.props.t(
                  this.props.offer?.group
                    ? 'offer:liveOfferEdit.deleteSimilarOffersGroups'
                    : 'offer:liveOfferEdit.deleteSimilarOffers',
                )}
                modifyRecursively={this.state.deleteAll}
                onChangeRecursion={handleChangeRecursion}
                selectAll={this.selectAll}
                selectedSimilarOfferIds={selectedSimilarOfferIds}
                shouldModifyAllDates={this.state.deleteAll}
                similarOffers={similarOffersWithSelectedStatus}
                unselectAll={this.unselectAll}
              />
            )}

          <div className={classes.danger}>
            <WarningIcon className={classes.iconLeft} />
            <Typography variant="caption">
              {t('form.offer.delete.explainForceDanger')}
            </Typography>
          </div>
        </div>
      );
    }
    const { notify, cashback, deleteAll, cancelLinkedHybridOffer } = this.state;
    return (
      <div>
        {this.props.offer.group?.name && (
          <Alert
            className={this.props.classes.alert}
            severity="error"
            variant="outlined"
          >
            {this.props.t('form.offer.editingGroup', {
              name: this.props.offer.group.name,
            })}
          </Alert>
        )}
        <Typography className={classes.explainText}>
          {t('form.offer.delete.explainModalities')}
        </Typography>
        {hasPendingReplacementRequest &&
          !!setOpenReplacementRequestOnCancel && (
            <Alert severity="warning">
              <AlertTitle>
                {t(
                  'replacement:requestsLinkedToCancelledOffers.offerHasActiveRequest.title',
                )}
              </AlertTitle>

              <FormControlLabel
                control={
                  <CheckBox
                    checked={openReplacementRequestPageOnCancel}
                    onChange={(_, checked) =>
                      setOpenReplacementRequestOnCancel(checked)
                    }
                  />
                }
                label={t(
                  'replacement:requestsLinkedToCancelledOffers.offerHasActiveRequest.helper',
                )}
              />
            </Alert>
          )}
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
            checked={notify}
            disabled={this.props.processing}
            onChange={this.onNotifySwitch}
          />
          <Typography className={classes.explainNotify}>
            {t('form.offer.delete.explainNotify')}
          </Typography>
        </div>
        {this.props.offer?.linked_hybrid_offer_id && (
          <div className={classes.row}>
            <Switch
              checked={cancelLinkedHybridOffer}
              onChange={this.onCancelHybridSessionSwitch}
            />
            <Typography className={classes.explainNotify}>
              {t('form.offer.delete.explainDeleteLinkedHybridSession')}
            </Typography>
          </div>
        )}
        {similarOffersWithSelectedStatus &&
          similarOffersWithSelectedStatus.length > 1 && (
            <RecursionToogle
              indexBasedSelection
              color="secondary"
              disabled={this.props.processing}
              handleChange={this.handleChangeSelection}
              listTitle={this.props.t('offer:liveOfferEdit.selectCancel')}
              loading={similarOfferLoading}
              message={this.props.t(
                this.props.offer.group
                  ? 'offer:liveOfferEdit.cancelSimilarOffersGroup'
                  : 'offer:liveOfferEdit.cancelSimilarOffers',
              )}
              modifyRecursively={this.state.deleteAll}
              onChangeRecursion={handleChangeRecursion}
              selectAll={this.selectAll}
              selectedSimilarOfferIds={selectedSimilarOfferIds}
              shouldModifyAllDates={deleteAll}
              similarOffers={similarOffersWithSelectedStatus}
              unselectAll={this.unselectAll}
            />
          )}
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
                    this.props.offer.nb_option > 0)
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
  alert: {
    marginBottom: theme.spacing(2),
  },
});

export default withTranslation()(withStyles(styles)(DeleteOfferForm));
