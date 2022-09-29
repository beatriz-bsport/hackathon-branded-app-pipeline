import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import Divider from '@material-ui/core/Divider';
import AlertIcon from '@material-ui/icons/Warning';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import moment from 'moment-timezone';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TimerOffIcon from '@material-ui/icons/TimerOff';
import EditIcon from '@material-ui/icons/Edit';
import DateRangeIcon from '@material-ui/icons/DateRange';
import IconButton from '@material-ui/core/IconButton';
import PaginatedSubscriptionList from '../PaginatedSubscriptionList.component';
import { ContractPauseDetails, Subscription } from '../../types';
import { OptionCallback } from '../../../../state/types';
import PauseDeleteDialog from '../pause/PauseDeleteDialog.component';
import ContractPauseUpdateNameDialog from './ContractPauseUpdateNameDialog.component';

const PAGINATED_LIST_SIZE = 6;

type OwnProps = {
  contractPause: ContractPauseDetails;
  fetchSubscriptionBulk: (
    ids: Array<number>,
    options: OptionCallback<Subscription[]>,
  ) => void;
  fetchMembersBySubscription: (subs: Array<Subscription>) => void;
  goToSubscription: (id: number) => void;
  onDeletePause: () => void;
  onUpdatePause: () => void;
  onUpdatePauseName: (
    params: { contract_pause_id: number; name: string },
    options: OptionCallback,
  ) => void;
};

type Props = OwnProps & WithTranslation & WithStyles;

type State = {
  expandedSuccess: boolean;
  expandedInvalid: boolean;
  successPage: number;
  invalidPage: number;
  menuAnchor: any;
  openDeleteDialog: boolean;
  openUpdateNameDialog: boolean;
  openTooltipCancelDisabled: boolean;
  openTooltipUpdateDisabled: boolean;
  dateStartIsPast: boolean;
  dateEndIsPast: boolean;
};

class ContractPauseListItemDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expandedSuccess: false,
      expandedInvalid: false,
      successPage: 1,
      invalidPage: 1,
      menuAnchor: null,
      openDeleteDialog: false,
      openUpdateNameDialog: false,
      openTooltipCancelDisabled: false,
      openTooltipUpdateDisabled: false,
      dateStartIsPast:
        moment(props.contractPause.from_date).diff(
          moment().format('YYYY-MM-DD'),
          'days',
        ) < 0,
      dateEndIsPast:
        moment(props.contractPause.until_date).diff(
          moment().format('YYYY-MM-DD'),
          'days',
        ) < 0,
    };
  }

  onOpenMenu = (ev: React.MouseEvent) =>
    this.setState({ menuAnchor: ev.currentTarget });

  onCloseMenu = () => this.setState({ menuAnchor: null });

  onOpenDeleteDialog = () =>
    this.setState({ openDeleteDialog: true, menuAnchor: null });

  onCloseDeleteDialog = () =>
    this.setState({ openDeleteDialog: false, menuAnchor: null });

  onConfirmDeleteContractPause = () => {
    this.props.onDeletePause();
    this.setState({ menuAnchor: null, openDeleteDialog: false });
  };

  onOpenUpdateNameDialog = () =>
    this.setState({ openUpdateNameDialog: true, menuAnchor: null });

  onCloseUpdateNameDialog = () =>
    this.setState({ openUpdateNameDialog: false });

  onOpenUpdatePauseDialog = () => {
    this.setState({ menuAnchor: null });
    this.props.onUpdatePause();
  };

  onUpdateName = (newName: string) => {
    this.props.onUpdatePauseName(
      {
        contract_pause_id: this.props.contractPause.id,
        name: newName,
      },
      { onSuccess: this.onCloseUpdateNameDialog },
    );
  };

  onChangeExpandedSuccess = () =>
    this.setState((prevState: State) => ({
      expandedSuccess: !prevState.expandedSuccess,
    }));

  onChangeExpandedInvalid = () =>
    this.setState((prevState: State) => ({
      expandedInvalid: !prevState.expandedInvalid,
    }));

  onPageSuccessRequested = (page: number) =>
    this.props.fetchSubscriptionBulk(
      this.props.contractPause.billing_plan_success_ids.slice(
        (page - 1) * PAGINATED_LIST_SIZE,
        page * PAGINATED_LIST_SIZE,
      ),
      {
        onSuccess: (subs) => {
          this.setState({ successPage: page });
          this.props.fetchMembersBySubscription(subs);
        },
      },
    );

  onPageInvalidRequested = (page: number) =>
    this.props.fetchSubscriptionBulk(
      this.props.contractPause.billing_plan_invalid_ids.slice(
        (page - 1) * PAGINATED_LIST_SIZE,
        page * PAGINATED_LIST_SIZE,
      ),
      {
        onSuccess: (subs) => {
          this.setState({ invalidPage: page });
          this.props.fetchMembersBySubscription(subs);
        },
      },
    );

  handleHoverInMenuCancel = () => {
    if (this.state.dateStartIsPast) {
      this.setState({ openTooltipCancelDisabled: true });
    }
  };

  handleHoverOutMenuCancel = () => {
    if (this.state.dateStartIsPast || this.state.openTooltipCancelDisabled) {
      this.setState({ openTooltipCancelDisabled: false });
    }
  };

  handleHoverInMenuUpdate = () => {
    if (this.state.dateEndIsPast) {
      this.setState({ openTooltipUpdateDisabled: true });
    }
  };

  handleHoverOutMenuUpdate = () => {
    if (this.state.dateEndIsPast || this.state.openTooltipUpdateDisabled) {
      this.setState({ openTooltipUpdateDisabled: false });
    }
  };

  render() {
    const { classes, t, contractPause } = this.props;
    return (
      <div>
        <div>
          <Paper className={classes.row}>
            <div>
              <Typography>{contractPause.name}</Typography>
              <div>
                <Typography color="textSecondary" variant="caption">
                  {contractPause.creator_staff_name
                    ? t('pauseV2.common.listItem.createdAtBy', {
                        dateCreation: `${moment(
                          contractPause.date_created,
                        ).format('L')}`,
                        staffName: contractPause.creator_staff_name,
                      })
                    : t('pauseV2.common.listItem.createdAt', {
                        dateCreation: `${moment(
                          contractPause.date_created,
                        ).format('L')}`,
                      })}
                </Typography>
              </div>
            </div>
            <div className={classes.rowCenter}>
              {contractPause.from_date && contractPause.until_date && (
                <Typography variant="body1" className={classes.dateTypography}>
                  {t('pauseV2.common.listItem.fromToUntil', {
                    fromDate: moment(contractPause.from_date).format('L'),
                    untilDate: moment(contractPause.until_date).format('L'),
                  })}
                </Typography>
              )}
              {contractPause.processing ? (
                <CircularProgress size={20} />
              ) : (
                <IconButton
                  color="default"
                  onClick={this.onOpenMenu}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              )}
            </div>
            <Menu
              onClose={this.onCloseMenu}
              anchorEl={this.state.menuAnchor}
              open={!!this.state.menuAnchor}
            >
              <Tooltip
                open={this.state.openTooltipCancelDisabled}
                title={t('pauseV2.common.menu.cancelForbidden')}
                onPointerEnter={this.handleHoverInMenuCancel}
                onPointerLeave={this.handleHoverOutMenuCancel}
                onTouchStart={this.handleHoverInMenuCancel}
                onTouchEnd={this.handleHoverOutMenuCancel}
              >
                <span>
                  <MenuItem
                    onClick={this.onOpenDeleteDialog}
                    disabled={this.state.dateStartIsPast}
                  >
                    <ListItemIcon>
                      <TimerOffIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">
                      {t('pauseV2.common.menu.delete')}
                    </Typography>
                  </MenuItem>
                </span>
              </Tooltip>
              <Tooltip
                open={this.state.openTooltipUpdateDisabled}
                title={t('pauseV2.common.menu.changeForbidden')}
                onPointerEnter={this.handleHoverInMenuUpdate}
                onPointerLeave={this.handleHoverOutMenuUpdate}
                onTouchStart={this.handleHoverInMenuUpdate}
                onTouchEnd={this.handleHoverOutMenuUpdate}
              >
                <span>
                  <MenuItem
                    onClick={this.onOpenUpdatePauseDialog}
                    disabled={this.state.dateEndIsPast}
                  >
                    <ListItemIcon>
                      <DateRangeIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit">
                      {t('pauseV2.common.menu.change')}
                    </Typography>
                  </MenuItem>
                </span>
              </Tooltip>
              <MenuItem
                onClick={this.onOpenUpdateNameDialog}
                disabled={this.state.dateEndIsPast}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">
                  {t('pauseV2.common.menu.changeName')}
                </Typography>
              </MenuItem>
            </Menu>
          </Paper>
          <Divider />
          {!contractPause.processing && (
            <React.Fragment>
              <Accordion
                expanded={this.state.expandedSuccess}
                onChange={this.onChangeExpandedSuccess}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="caption">
                    {t('pauseV2.contractPause.sections.success', {
                      count: contractPause.billing_plan_success.length,
                    })}
                  </Typography>
                </AccordionSummary>
                <div className={classes.billingPlanListContainer}>
                  <PaginatedSubscriptionList
                    items={contractPause.billing_plan_success.slice(
                      (this.state.successPage - 1) * PAGINATED_LIST_SIZE,
                      this.state.successPage * PAGINATED_LIST_SIZE,
                    )}
                    nbItems={contractPause.billing_plan_success.length}
                    onClick={this.props.goToSubscription}
                    page={this.state.successPage}
                    itemPerPage={PAGINATED_LIST_SIZE}
                    onPageRequested={this.onPageSuccessRequested}
                  />
                </div>
              </Accordion>
              {!!contractPause.billing_plan_invalid.length && (
                <Accordion
                  expanded={this.state.expandedInvalid}
                  onChange={this.onChangeExpandedInvalid}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <div className={classes.rowCenter}>
                      <AlertIcon
                        fontSize="small"
                        color="error"
                        className={classes.iconLeft}
                      />
                      <Typography variant="caption">
                        {t('pauseV2.contractPause.sections.error', {
                          count: contractPause.billing_plan_invalid.length,
                        })}
                      </Typography>
                    </div>
                  </AccordionSummary>
                  <div className={classes.billingPlanListContainer}>
                    <PaginatedSubscriptionList
                      items={contractPause.billing_plan_invalid.slice(
                        (this.state.invalidPage - 1) * PAGINATED_LIST_SIZE,
                        this.state.invalidPage * PAGINATED_LIST_SIZE,
                      )}
                      nbItems={contractPause.billing_plan_invalid.length}
                      onClick={this.props.goToSubscription}
                      page={this.state.invalidPage}
                      itemPerPage={PAGINATED_LIST_SIZE}
                      onPageRequested={this.onPageInvalidRequested}
                    />
                  </div>
                </Accordion>
              )}
            </React.Fragment>
          )}
          {this.state.openDeleteDialog && (
            <PauseDeleteDialog
              deleteContent={t('pauseV2.contractPause.deleteDialogContent')}
              onCancelClick={this.onCloseDeleteDialog}
              onConfirmClick={this.onConfirmDeleteContractPause}
              open={this.state.openDeleteDialog}
            />
          )}
          {this.state.openUpdateNameDialog && (
            <ContractPauseUpdateNameDialog
              open={this.state.openUpdateNameDialog}
              previousName={contractPause.name}
              onCancel={this.onCloseUpdateNameDialog}
              onUpdateName={this.onUpdateName}
            />
          )}
        </div>
      </div>
    );
  }
}

const styles: any = createStyles((theme: Theme) => ({
  billingPlanListContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  rowCenter: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  dateTypography: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    textAlign: 'right',
  },
}));

export default compose<any, OwnProps>(
  withTranslation('subscription'),
  withStyles(styles),
)(ContractPauseListItemDetail);
