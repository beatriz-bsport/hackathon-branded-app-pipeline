import React from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles, Theme } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Pagination from '@material-ui/lab/Pagination';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Popper from '@material-ui/core/Popper';
import { amber, red } from '@material-ui/core/colors';

import ReportProblem from '@material-ui/icons/ReportProblemOutlined';
import Edit from '@material-ui/icons/Edit';

import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
  COMMUNICATION_KIND_SMS,
} from '@bsport/common/lib/master-data/communication-kind';
import {
  COMMUNICATION_RECIPIENT_BOOKINGS,
  COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED,
  COMMUNICATION_RECIPIENT_WAITING_LIST,
} from '@bsport/common/lib/master-data/communication-filters';

import { Member } from '#libs/member/types';

export type Props = {
  allIds: number[];
  allIdsWithoutEmail?: number[];
  allIdsWithoutPhone?: number[];
  classes: any;
  fetchPage: (page: number) => void;
  fullScreen?: boolean;
  handleCloseDialog: () => void;
  hasFilters?: boolean;
  kind: number;
  loadingMembersList: boolean;
  membersList: Member[];
  open?: boolean;
  pageSize: number;
  selectedFilters?: number[];
  setSelectedFilters?: (filters: number[]) => void;
  setRecipients?: (selectedIds: number[]) => void;
  setUncheckedMembers: (listIdsUnchecked: number[]) => void;
  uncheckedMembers: number[];
} & WithTranslation;

type State = {
  page: number;
  displayWarningFull: boolean;
  anchorEl: any;
  openRefreshDialog: boolean;
  uncheckedMembers: number[];
};

export class CommunicationRecipientsModal extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
      displayWarningFull: false,
      anchorEl: null,
      openRefreshDialog: false,
      uncheckedMembers: props.uncheckedMembers ?? [],
    };
  }

  getAllIdsWithoutKind = () => {
    switch (this.props.kind) {
      case COMMUNICATION_KIND_EMAIL:
        return this.props.allIdsWithoutEmail ?? [];
      case COMMUNICATION_KIND_SMS:
        return this.props.allIdsWithoutPhone ?? [];
      default:
        return [];
    }
  };

  getCheckedMember = () => {
    switch (this.props.kind) {
      case COMMUNICATION_KIND_SMS:
        // First, get members with phone number, then return those checked
        return this.props.allIds
          .filter(
            (memberId) => !this.props.allIdsWithoutPhone.includes(memberId),
          )
          .filter((item) => !this.state.uncheckedMembers.includes(item));
      case COMMUNICATION_KIND_EMAIL:
        return this.props.allIds
          .filter(
            (memberId) => !this.props.allIdsWithoutEmail.includes(memberId),
          )
          .filter((item) => !this.state.uncheckedMembers.includes(item));
      case COMMUNICATION_KIND_PUSH_NOTIFICATION:
        return this.props.allIds.filter(
          (item) => !this.state.uncheckedMembers.includes(item),
        );
      default:
        return [];
    }
  };

  getWarningMessage = () => {
    const hasMissingPhonesOrEmails =
      (this.props.kind === COMMUNICATION_KIND_SMS &&
        this.props.allIdsWithoutPhone?.length > 0) ||
      (this.props.kind === COMMUNICATION_KIND_EMAIL &&
        this.props.allIdsWithoutEmail?.length > 0);
    const hasUnselectedRecipients = this.state.uncheckedMembers?.length > 0;
    if (hasMissingPhonesOrEmails && hasUnselectedRecipients) {
      return this.props.t('dialogRecipients.warnings.full');
    }
    if (hasMissingPhonesOrEmails && !hasUnselectedRecipients) {
      return this.props.t('dialogRecipients.warnings.phoneOrMailMissing');
    }
    if (hasUnselectedRecipients && !hasMissingPhonesOrEmails) {
      return this.props.t('dialogRecipients.warnings.recipientsNotAllSelected');
    }
    return '';
  };

  handleChangePage = (
    event: React.ChangeEvent<unknown> | null,
    page: number = 1,
  ) => {
    this.props.fetchPage(page);
    this.setState({ page });
  };

  handleToggle = (memberId: number) => () => {
    this.setState((prevState) => {
      const currentIndex = prevState.uncheckedMembers.indexOf(memberId);
      const newChecked = [...prevState.uncheckedMembers];
      if (currentIndex === -1) {
        newChecked.push(memberId);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      return { ...prevState, uncheckedMembers: newChecked };
    });
  };

  onCheckFilter = (identifier: number) => {
    const selectedFilters = this.props.selectedFilters;
    const filterIndex = selectedFilters.indexOf(identifier);
    const nextFilterValues = [...selectedFilters];
    if (filterIndex === -1) {
      nextFilterValues.push(identifier);
    } else {
      nextFilterValues.splice(filterIndex, 1);
    }
    this.props.setSelectedFilters(nextFilterValues);
    this.handleChangePage(null, 1);
  };

  onClose = () => {
    this.setState(
      {
        page: 1,
        displayWarningFull: false,
        openRefreshDialog: false,
        anchorEl: null,
        uncheckedMembers: [],
      },
      this.props.handleCloseDialog,
    );
  };

  onConfirm = () => {
    if (this.props.setRecipients) {
      const recipients = this.getCheckedMember();
      this.props.setRecipients(recipients);
    }
    this.props.setUncheckedMembers(this.state.uncheckedMembers);
    this.onClose();
  };

  openMemberPage = (event: React.SyntheticEvent<any>, memberId: number) => {
    event.preventDefault();
    const url = `/member/edit/${memberId}`;
    const win = window.open(url);
    win.focus();
    this.setState({ openRefreshDialog: true });
  };

  renderCheckboxFilters = () => {
    const { classes, t } = this.props;
    const onCheckBookings = () =>
      this.onCheckFilter(COMMUNICATION_RECIPIENT_BOOKINGS);
    const onCheckCancelledBookings = () =>
      this.onCheckFilter(COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED);
    const onCheckWaitingList = () =>
      this.onCheckFilter(COMMUNICATION_RECIPIENT_WAITING_LIST);
    return (
      <div className={classes.checkboxContainer}>
        <ListItem
          button
          onClick={onCheckBookings}
          className={classes.checkboxDisableHover}
        >
          <Checkbox
            edge="start"
            checked={
              this.props.selectedFilters.indexOf(
                COMMUNICATION_RECIPIENT_BOOKINGS,
              ) !== -1
            }
          />
          <ListItemText
            id="bookings"
            primary={t('dialogReceiverChoice.reservation')}
          />
        </ListItem>
        <ListItem
          button
          onClick={onCheckCancelledBookings}
          className={classes.checkboxDisableHover}
        >
          <Checkbox
            edge="start"
            checked={
              this.props.selectedFilters.indexOf(
                COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED,
              ) !== -1
            }
          />
          <ListItemText
            id="cancelled-bookings"
            primary={t('dialogReceiverChoice.canceledReservation')}
          />
        </ListItem>
        <ListItem
          button
          onClick={onCheckWaitingList}
          className={classes.checkboxDisableHover}
        >
          <Checkbox
            edge="start"
            checked={
              this.props.selectedFilters.indexOf(
                COMMUNICATION_RECIPIENT_WAITING_LIST,
              ) !== -1
            }
          />
          <ListItemText
            id="waitingList"
            primary={t('dialogReceiverChoice.waitingList')}
          />
        </ListItem>
      </div>
    );
  };

  renderHeader = (displayWarning: boolean) => {
    const { classes, allIds, t } = this.props;
    const idsCount = allIds ? allIds.length : 0;
    return (
      <>
        <TableRow>
          <TableCell>
            <div className={classes.headerCellRecipients}>
              <Typography
                variant="body1"
                className={classes.headerTextRecipients}
              >
                {idsCount}{' '}
                {t('common.recipient', {
                  count: idsCount,
                })}
              </Typography>
              <Hidden smUp>{displayWarning && this.renderTopWarning()}</Hidden>
            </div>
          </TableCell>
          <Hidden xsDown>
            <TableCell className={classes.cellWithWarningIcon} />
            <TableCell>{displayWarning && this.renderTopWarning()}</TableCell>
          </Hidden>
          <TableCell align="center" />
        </TableRow>
      </>
    );
  };

  renderTopWarning = () => {
    const { t, classes } = this.props;
    const hoverIn = (event: React.PointerEvent) => {
      this.setState({
        displayWarningFull: true,
        anchorEl: event.currentTarget,
      });
    };
    const hoverOut = () => {
      this.setState({ displayWarningFull: false, anchorEl: false });
    };
    return (
      <>
        <div
          className={classes.headerWarningContainer}
          onPointerEnter={hoverIn}
          onPointerLeave={hoverOut}
        >
          <ReportProblem className={classes.warningIcon} />
          <Typography variant="body2" className={classes.headerWarningText}>
            {t('dialogRecipients.warnings.header')}
          </Typography>
        </div>
        <Hidden xsDown>
          <Popper
            id="warning"
            open={this.state.displayWarningFull}
            anchorEl={this.state.anchorEl}
            placement="bottom"
            disablePortal
            className={classes.popperContainer}
          >
            <Typography variant="caption" className={classes.popperWarningText}>
              {this.getWarningMessage()}
            </Typography>
          </Popper>
        </Hidden>
      </>
    );
  };

  renderRow = (member: Member, allIdsWithoutKind: number[]) => {
    const { t, classes } = this.props;
    const memberWithoutPhoneOrEmail = allIdsWithoutKind?.includes(member.id);
    const missingPhoneOrEmailContent =
      this.props.kind === COMMUNICATION_KIND_SMS
        ? t('dialogRecipients.noPhone')
        : t('dialogRecipients.noMail');
    const memberPhoneOrEmailContent =
      this.props.kind === COMMUNICATION_KIND_SMS
        ? member?.phone_number
        : member?.email;
    const onEditClick = (event: React.MouseEvent) => {
      this.openMemberPage(event, member.id);
    };
    return (
      <TableRow>
        <TableCell
          component="th"
          scope="row"
          className={classes.cellWithoutBorder}
        >
          <div className={classes.flexRowContainer}>
            <Avatar
              alt={member.name}
              src={member.photo}
              className={classes.avatar}
            />
            <div className={classes.cellRowRecipient}>
              <Typography variant="body1">{member.name}</Typography>
              {this.props.kind !== COMMUNICATION_KIND_PUSH_NOTIFICATION && (
                <Hidden smUp>
                  {memberWithoutPhoneOrEmail ? (
                    <div className={classes.flexRowContainer}>
                      <ReportProblem className={classes.warningIcon} />
                      <Typography
                        variant="body2"
                        className={classes.cellRowRecipientTextWithWarning}
                      >
                        {missingPhoneOrEmailContent}
                      </Typography>
                    </div>
                  ) : (
                    <Typography variant="body2">
                      {memberPhoneOrEmailContent}
                    </Typography>
                  )}
                </Hidden>
              )}
            </div>
          </div>
        </TableCell>
        <Hidden xsDown>
          <TableCell
            className={classNames(
              classes.cellWithWarningIcon,
              classes.cellWithoutBorder,
            )}
          >
            {memberWithoutPhoneOrEmail ? (
              <ReportProblem className={classes.warningIcon} />
            ) : null}
          </TableCell>
          {this.props.kind !== COMMUNICATION_KIND_PUSH_NOTIFICATION ? (
            <TableCell align="left" className={classes.cellWithoutBorder}>
              {memberWithoutPhoneOrEmail ? (
                <Typography variant="body2" className={classes.warningRedColor}>
                  {missingPhoneOrEmailContent}
                </Typography>
              ) : (
                <Typography variant="body2">
                  {memberPhoneOrEmailContent}
                </Typography>
              )}
            </TableCell>
          ) : (
            <TableCell align="left" className={classes.cellWithoutBorder} />
          )}
        </Hidden>
        <TableCell align="right" className={classes.cellWithoutBorder}>
          {memberWithoutPhoneOrEmail ? (
            <IconButton onClick={onEditClick}>
              <Edit className={classes.warningRedColor} />
            </IconButton>
          ) : (
            <Checkbox
              checked={this.state.uncheckedMembers.indexOf(member.id) === -1}
              onChange={this.handleToggle(member.id)}
            />
          )}
        </TableCell>
      </TableRow>
    );
  };

  renderRefreshDialog = () => {
    const { t, kind, classes } = this.props;
    const onCloseDialog = () => this.setState({ openRefreshDialog: false });
    const onRefreshPage = () => document.location.reload();
    return (
      <Dialog open={this.state.openRefreshDialog}>
        <DialogContent>
          <p>
            {kind === COMMUNICATION_KIND_SMS
              ? t('mail.refreshTextPhone')
              : t('mail.refreshText')}
          </p>
          <DialogActions>
            <Button className={classes.buttonClose} onClick={onCloseDialog}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" color="primary" onClick={onRefreshPage}>
              {t('common.refresh')}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  };

  render() {
    const {
      allIds,
      fullScreen,
      hasFilters,
      loadingMembersList,
      membersList,
      open,
      pageSize,
      t,
      classes,
    } = this.props;
    const pageCount = Math.ceil(allIds?.length / pageSize);
    const allIdsWithoutKind = this.getAllIdsWithoutKind();
    return (
      <Dialog fullScreen={fullScreen} open={open}>
        <DialogTitle>
          <div className={classes.dialogTitle}>
            {t('dialogReceiverChoice.title')}
          </div>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {hasFilters && this.renderCheckboxFilters()}
          <Table
            className={classes.table}
            aria-label="simple table"
            size="small"
            padding="normal"
          >
            <TableHead>
              {this.renderHeader(
                allIdsWithoutKind?.length > 0 ||
                  this.state.uncheckedMembers?.length > 0,
              )}
            </TableHead>
            {!loadingMembersList && (
              <TableBody>
                {membersList.map((member: Member) => (
                  <React.Fragment key={member.id}>
                    {this.renderRow(member, allIdsWithoutKind)}
                  </React.Fragment>
                ))}
              </TableBody>
            )}
          </Table>
          {loadingMembersList && (
            <div className={classes.loadingContainer}>
              <CircularProgress />
            </div>
          )}
          {pageCount > 1 && (
            <Pagination
              page={this.state.page}
              count={pageCount}
              onChange={this.handleChangePage}
              className={classes.paginationContainer}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button className={classes.buttonClose} onClick={this.onClose}>
            {t('common.cancel')}
          </Button>
          <Button color="primary" onClick={this.onConfirm}>
            {t('common.confirm')}
          </Button>
        </DialogActions>
        {this.state.openRefreshDialog && this.renderRefreshDialog()}
      </Dialog>
    );
  }
}

const styles = (theme: Theme) => ({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  buttonClose: {
    color: theme.palette.text.secondary,
  },
  cellRowRecipient: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: theme.spacing(3),
  },
  cellRowRecipientTextWithWarning: {
    color: red[900],
    marginLeft: theme.spacing(2),
  },
  cellWithWarningIcon: {
    paddingRight: 0,
  },
  cellWithoutBorder: {
    borderBottom: 'none',
  },
  checkboxContainer: {
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  checkboxDisableHover: {
    '&:hover': {
      backgroundColor: '#fff',
    },
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogTitle: {
    fontWeight: 'bold',
  },
  flexRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerCellRecipients: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  headerTextRecipients: {
    fontWeight: 'bold',
    marginRight: theme.spacing(2),
  },
  headerWarningContainer: {
    alignItems: 'center',
    backgroundColor: amber[50],
    borderRadius: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: theme.spacing(1),
    width: 'min-content',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0.5),
    },
  },
  headerWarningText: {
    color: red[900],
    marginLeft: theme.spacing(1),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  paginationContainer: {
    marginTop: theme.spacing(2),
    '& li': {
      listStyle: 'none',
    },
  },
  popperContainer: {
    backgroundColor: amber[50],
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    maxWidth: '50%',
    margin: 'auto',
    marginTop: theme.spacing(0.5),
    borderColor: amber[100],
    borderWidth: '1px',
    borderStyle: 'solid',
    lineHeight: 1,
  },
  popperWarningText: {
    color: red[900],
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  warningIcon: {
    color: theme.palette.warning.main,
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
  },
  warningRedColor: {
    color: red[900],
  },
});

export default compose(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationRecipientsModal);
