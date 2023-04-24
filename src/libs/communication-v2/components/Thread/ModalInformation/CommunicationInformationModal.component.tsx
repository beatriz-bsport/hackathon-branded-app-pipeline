// @ts-nocheck
import React from 'react';
import { compose } from 'recompose';
import moment from 'moment-timezone';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { Theme, WithStyles } from '@material-ui/core';

import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';

import classNames from 'classnames';
import { COMMUNICATION_CHANNEL_SMARTLIST } from '@bsport/common/lib/master-data/communication-filters';
import CommunicationInformationStatusChip from './CommunicationInformationStatusChip.component';
import CommunicationInformationOpenChip from './CommunicationInformationOpenChip.component';
import CommunicationWrapperDialog from '../../CommunicationWrapperDialog.component';
import {
  Recipient,
  ThreadCommunication,
  Communication,
  FilteringMemberIdsByGenericCategories,
} from '#libs/communication-v2/types';
import CommunicationInformationModalFilter from './CommunicationInformationModalFilter.component';
import { Member } from '#libs/member/types';

type OwnProps = {
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  contextInformation?: string;
  contextMember?: Member;
  contextTitle?: string;
  fetchRecipientPaginatedList: (
    communication: Communication,
    page: number,
    memberSelectedCategories: number[],
  ) => void;
  fullScreen?: boolean;
  handleCloseDialog: () => void;
  loadingRecipientList: boolean;
  open?: boolean;
  paginationSize: number;
  recipientList: Recipient<Member>[];
  recipientListCount: number;
  selectedCommunication: ThreadCommunication;
};

type State = {
  checkedCategoryFilters: number[];
  currentPage: number;
};

export type Props = OwnProps & WithTranslation & WithStyles;

export class CommunicationInformationModal extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checkedCategoryFilters:
        props.allMemberCategoryList?.categories.map(
          (cat) => cat.categoryIdentifier,
        ) || [],
      currentPage: 1,
    };
  }

  componentDidMount(): void {
    this.fetchRecipientPaginatedList();
  }

  fetchRecipientPaginatedList = () => {
    this.props.fetchRecipientPaginatedList(
      this.props.selectedCommunication?.communication,
      this.state.currentPage,
      this.state.checkedCategoryFilters,
    );
  };

  handleChangePage = (
    event: React.ChangeEvent<unknown> | null,
    page: number = 1,
  ) => {
    this.setState({ currentPage: page }, this.fetchRecipientPaginatedList);
  };

  onClose = () => {
    this.setState(
      {
        checkedCategoryFilters:
          this.props.allMemberCategoryList?.categories.map(
            (cat) => cat.categoryIdentifier,
          ) || [],
        currentPage: 1,
      },
      this.props.handleCloseDialog,
    );
  };

  setCheckedCategoryFilters = (nextCheckedList: number[]) => {
    this.setState(
      { checkedCategoryFilters: nextCheckedList },
      this.fetchRecipientPaginatedList,
    );
  };

  render() {
    const {
      fullScreen,
      open,
      loadingRecipientList,
      recipientList,
      recipientListCount,
      paginationSize,
      selectedCommunication,
      t,
      classes,
    } = this.props;
    const recipientsCount = recipientListCount || 0;
    const { kind, date_created } = selectedCommunication.communication;
    const pageCount = this.props.contextMember
      ? 1
      : Math.ceil(recipientsCount / paginationSize);
    const title = `${t(`campaign.kind.${kind}`)} -  ${moment(
      date_created,
    ).format('L - LT')}`;

    return (
      <CommunicationWrapperDialog
        open={open}
        fullScreen={fullScreen}
        title={title}
        buttonCancelText={t('common.close')}
        onCancel={this.onClose}
        closeDialog={this.onClose}
      >
        <>
          {!!this.props.contextTitle &&
            selectedCommunication?.channel !==
              COMMUNICATION_CHANNEL_SMARTLIST && (
              <div className={classes.contextContainer}>
                <Typography variant="h6" className={classes.boldTypo}>
                  {this.props.contextTitle}
                </Typography>
                <Typography variant="body2">
                  {this.props.contextInformation}
                </Typography>
              </div>
            )}
          {!!this.props.allMemberCategoryList && (
            <CommunicationInformationModalFilter
              genericMemberCategories={this.props.allMemberCategoryList}
              checkedFilters={this.state.checkedCategoryFilters}
              setCheckedFilters={this.setCheckedCategoryFilters}
            />
          )}
          <Table aria-label="simple table" size="small" padding="normal">
            <TableHead>
              <TableRow>
                <TableCell
                  className={classes.tableContainerWithoutBorderBottom}
                >
                  <Typography
                    variant="body1"
                    className={classNames(
                      classes.boldTypo,
                      classes.textHeaderEllipsis,
                    )}
                  >
                    {recipientsCount}{' '}
                    {t('common.recipient', {
                      count: recipientsCount,
                    })}
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  className={classes.tableContainerWithoutBorderBottom}
                >
                  <Typography variant="body1" className={classes.boldTypo}>
                    {t('dialogInformation.headerStatus')}
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  className={classes.tableContainerWithoutBorderBottom}
                >
                  <Typography variant="body1" className={classes.boldTypo}>
                    {t('dialogInformation.headerOpen')}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            {!loadingRecipientList && (
              <TableBody>
                {recipientList.length === 0 ? (
                  <div className={classes.emptyTableBody} />
                ) : (
                  recipientList.map((recipient: Recipient<Member>) => (
                    <TableRow key={recipient.id}>
                      <TableCell
                        component="th"
                        scope="row"
                        className={classes.tableContainerWithoutBorderBottom}
                      >
                        <div className={classes.tableCellRecipient}>
                          <Avatar
                            alt={recipient.member?.name}
                            src={recipient.member?.photo}
                            className={classes.avatar}
                          />
                          <Typography
                            variant="body1"
                            className={classes.recipientName}
                          >
                            {recipient.member?.name}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.tableContainerWithoutBorderBottom}
                      >
                        <CommunicationInformationStatusChip
                          statusNumber={recipient.status}
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.tableContainerWithoutBorderBottom}
                      >
                        <CommunicationInformationOpenChip
                          openStatus={recipient.read_count > 0}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            )}
          </Table>
          {loadingRecipientList && (
            <div className={classes.circularProgressContainer}>
              <CircularProgress />
            </div>
          )}
          {pageCount > 1 && (
            <Pagination
              page={this.state.currentPage}
              count={pageCount}
              onChange={this.handleChangePage}
              className={classes.paginationContainer}
            />
          )}
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
  boldTypo: {
    fontWeight: 'bold',
  },
  circularProgressContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(2),
  },
  contextContainer: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing(2),
  },
  emptyTableBody: {
    height: theme.spacing(8.5), // to see the whole selector ...
  },
  paginationContainer: {
    marginTop: theme.spacing(2),
    '& li': {
      listStyle: 'none',
    },
  },
  recipientName: {
    marginLeft: theme.spacing(2),
  },
  tableContainerWithoutBorderBottom: {
    borderBottom: 'none',
  },
  tableCellRecipient: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textHeaderEllipsis: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(-2),
  },
  title: {
    fontWeight: 'bold',
    fontSize: theme.spacing(2.5),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationInformationModal);
