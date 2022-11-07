import React from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles, Theme, WithStyles } from '@material-ui/core';

import isEqual from 'lodash/isEqual';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Popper from '@material-ui/core/Popper';
import { amber, red } from '@material-ui/core/colors';

import ReportProblem from '@material-ui/icons/ReportProblemOutlined';
import Edit from '@material-ui/icons/Edit';

import {
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
} from '#libs/communication-v2/constants';
import CommunicationWrapperDialog from '../../CommunicationWrapperDialog.component';
import { FilteringMemberIdsByGenericCategories } from '#libs/communication-v2/types';
import CommunicationRecipientModalFilter from './CommunicationRecipientsModalFilter.component';

import { Member } from '#libs/member/types';

type OwnProps = {
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  checkedMemberCategoriesFilters: number[];
  countAvailableRecipientsTotal: number;
  countAvailableRecipientsWithEmail: number;
  countAvailableRecipientsWithPhone: number;
  fetchPaginatedAvailableRecipientMemberList: (page: number) => void;
  fullScreen?: boolean;
  handleCloseDialog: () => void;
  kind: number;
  loadingPaginatedMemberList: boolean;
  open?: boolean;
  pageSize: number;
  paginatedMemberList: Member[];
  setCheckedMemberCategoriesFilters: (
    nextList: number[],
    refreshCountRecipients: () => void,
  ) => void;
  setUncheckedMembers: (listIdsUnchecked: {
    email: number[];
    phone: number[];
    notification: number[];
  }) => void;
  uncheckedMembers: {
    email: number[];
    phone: number[];
    notification: number[];
  };
};

export type Props = OwnProps & WithTranslation & WithStyles;

type State = {
  page: number;
  displayWarningFull: boolean;
  anchorEl: any;
  openRefreshDialog: boolean;
  uncheckedMembers: {
    email: number[];
    phone: number[];
    notification: number[];
  };
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
      uncheckedMembers: props.uncheckedMembers ?? {
        email: [],
        phone: [],
        notification: [],
      },
    };
  }

  componentDidMount(): void {
    if (this.props.countAvailableRecipientsTotal) {
      this.handleChangePage(null, 1);
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (
      !prevProps.countAvailableRecipientsTotal &&
      !!this.props.countAvailableRecipientsTotal
    ) {
      this.handleChangePage(null, 1);
    }
    if (!isEqual(prevProps.uncheckedMembers, this.props.uncheckedMembers)) {
      this.setState({ uncheckedMembers: this.props.uncheckedMembers });
    }
  }

  getMemberToggleState = (memberId: number) => {
    return this.getUncheckedMembersOfCurrentKind().indexOf(memberId) === -1;
  };

  getUncheckedMembersOfCurrentKind = () => {
    switch (this.props.kind) {
      case WRITE_EMAIL:
        return this.state.uncheckedMembers.email;
      case WRITE_SMS:
        return this.state.uncheckedMembers.phone;
      case WRITE_PUSH_NOTIFICATION:
        return this.state.uncheckedMembers.notification;
      default:
        return [];
    }
  };

  getWarningMessage = () => {
    const hasMissingPhonesOrEmails =
      (this.props.kind === WRITE_SMS &&
        this.props.countAvailableRecipientsTotal -
          this.props.countAvailableRecipientsWithPhone >
          0) ||
      (this.props.kind === WRITE_EMAIL &&
        this.props.countAvailableRecipientsTotal -
          this.props.countAvailableRecipientsWithEmail >
          0);
    const hasUnselectedRecipients =
      this.getUncheckedMembersOfCurrentKind()?.length > 0;
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
    this.setState({ page }, () => {
      this.props.fetchPaginatedAvailableRecipientMemberList(page);
    });
  };

  handleChangePageAsCallback = () => {
    this.handleChangePage(null, 1);
  };

  handleFilterChangeMemberCategories = (nextCheckedFilters: number[]) => {
    this.props.setCheckedMemberCategoriesFilters(
      nextCheckedFilters,
      this.handleChangePageAsCallback,
    );
  };

  handleToggleOfSelectedKind = (
    previousUncheckedList: number[],
    memberId: number,
  ) => {
    const currentIndex = previousUncheckedList.indexOf(memberId);
    const newUncheckedList = [...previousUncheckedList];
    if (currentIndex === -1) {
      newUncheckedList.push(memberId);
    } else {
      newUncheckedList.splice(currentIndex, 1);
    }
    return newUncheckedList;
  };

  handleToggle = (memberId: number) => () => {
    this.setState((prevState) => {
      let nextState;
      switch (this.props.kind) {
        case WRITE_EMAIL:
          nextState = {
            ...prevState.uncheckedMembers,
            email: this.handleToggleOfSelectedKind(
              prevState.uncheckedMembers.email,
              memberId,
            ),
          };
          break;
        case WRITE_SMS:
          nextState = {
            ...prevState.uncheckedMembers,
            phone: this.handleToggleOfSelectedKind(
              prevState.uncheckedMembers.phone,
              memberId,
            ),
          };
          break;
        case WRITE_PUSH_NOTIFICATION:
          nextState = {
            ...prevState.uncheckedMembers,
            notification: this.handleToggleOfSelectedKind(
              prevState.uncheckedMembers.notification,
              memberId,
            ),
          };
          break;
        default:
          nextState = { ...prevState.uncheckedMembers };
          break;
      }
      return { ...prevState, uncheckedMembers: nextState };
    });
  };

  onClose = () => {
    this.setState(
      {
        displayWarningFull: false,
        openRefreshDialog: false,
        anchorEl: null,
      },
      this.props.handleCloseDialog,
    );
  };

  onConfirm = () => {
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

  renderHeader = () => {
    const { classes, t } = this.props;
    const idsCount = this.props.countAvailableRecipientsTotal || 0;
    const warningContent = this.renderTopWarning();
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
              <Hidden smUp>{!!warningContent && warningContent}</Hidden>
            </div>
          </TableCell>
          <Hidden xsDown>
            <TableCell className={classes.cellWithWarningIcon} />
            <TableCell>{!!warningContent && warningContent}</TableCell>
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
    const warningMessage = this.getWarningMessage();
    if (warningMessage === '') {
      // No warning to display
      return null;
    }
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
              {warningMessage}
            </Typography>
          </Popper>
        </Hidden>
      </>
    );
  };

  renderRow = (member: Member) => {
    const { t, classes } = this.props;
    let memberPhoneOrEmailContent: string = '';
    let missingPhoneOrEmailContent: string = '';
    switch (this.props.kind) {
      case WRITE_EMAIL:
        missingPhoneOrEmailContent = t('dialogRecipients.noMail');
        memberPhoneOrEmailContent = member?.email;
        break;
      case WRITE_SMS:
        missingPhoneOrEmailContent = t('dialogRecipients.noPhone');
        memberPhoneOrEmailContent = member?.phone || member?.phone_number;
        break;
      default:
        break;
    }
    const memberWithoutPhoneOrEmail =
      this.props.kind !== WRITE_PUSH_NOTIFICATION && !memberPhoneOrEmailContent;
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
              {this.props.kind !== WRITE_PUSH_NOTIFICATION && (
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
          {this.props.kind !== WRITE_PUSH_NOTIFICATION ? (
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
              checked={this.getMemberToggleState(member.id)}
              onChange={this.handleToggle(member.id)}
            />
          )}
        </TableCell>
      </TableRow>
    );
  };

  renderRefreshDialog = () => {
    const { t } = this.props;
    const onRefreshMemberData = () => {
      this.handleChangePage(null, this.state.page);
      this.setState({ openRefreshDialog: false });
    };
    return (
      <CommunicationWrapperDialog
        open={this.state.openRefreshDialog}
        fullScreen={false}
        buttonConfirmText={t('common.refresh')}
        onConfirm={onRefreshMemberData}
        maxWidth="xs"
      >
        <p>{t('dialogRecipients.refreshMemberData')}</p>
      </CommunicationWrapperDialog>
    );
  };

  render() {
    const {
      fullScreen,
      loadingPaginatedMemberList,
      paginatedMemberList,
      open,
      t,
      classes,
    } = this.props;
    const pageCount = Math.ceil(
      this.props.countAvailableRecipientsTotal / this.props.pageSize,
    );
    return (
      <CommunicationWrapperDialog
        open={open}
        fullScreen={fullScreen}
        title={t('dialogReceiverChoice.title')}
        buttonCancelText={t('common.cancel')}
        buttonConfirmText={t('common.confirm')}
        onCancel={this.onClose}
        onConfirm={this.onConfirm}
        closeDialog={this.onClose}
      >
        <>
          {!!this.props.allMemberCategoryList && (
            <CommunicationRecipientModalFilter
              genericMemberCategories={this.props.allMemberCategoryList}
              checkedFilters={this.props.checkedMemberCategoriesFilters}
              setCheckedFilters={this.handleFilterChangeMemberCategories}
            />
          )}
          <Table
            className={classes.table}
            aria-label="simple table"
            size="small"
            padding="normal"
          >
            <TableHead>{this.renderHeader()}</TableHead>
            {!loadingPaginatedMemberList && (
              <TableBody>
                {paginatedMemberList.map((member: Member) => (
                  <React.Fragment key={member.id}>
                    {this.renderRow(member)}
                  </React.Fragment>
                ))}
                {paginatedMemberList?.length === 0 && (
                  <div className={classes.emptyTableBody} />
                )}
              </TableBody>
            )}
          </Table>
          {loadingPaginatedMemberList && (
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
          {this.state.openRefreshDialog && this.renderRefreshDialog()}
        </>
      </CommunicationWrapperDialog>
    );
  }
}

const styles: any = (theme: Theme) => ({
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
  emptyTableBody: {
    height: theme.spacing(4),
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
    marginRight: theme.spacing(2),
    fontWeight: 'bold',
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
    zIndex: 1000,
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

export default compose<any, OwnProps>(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationRecipientsModal);
