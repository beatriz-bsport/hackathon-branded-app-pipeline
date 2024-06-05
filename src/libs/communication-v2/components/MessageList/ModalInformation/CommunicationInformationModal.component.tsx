import React from 'react';
import { DateTime } from 'luxon';
import { compose } from 'recompose';
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
import type {
  Recipient,
  CommunicationMessage,
  Communication,
  FilteringMemberIdsByGenericCategories,
} from '#libs/communication-v2/types';
import type { Member } from '#libs/member/types';
import CommunicationInformationStatusChip from './CommunicationInformationStatusChip.component';
import CommunicationInformationOpenChip from './CommunicationInformationOpenChip.component';
import CommunicationWrapperDialog from '../../CommunicationWrapperDialog.component';
import CommunicationInformationModalFilter from './CommunicationInformationModalFilter.component';

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
  selectedCommunication: CommunicationMessage;
};

type State = {
  checkedCategoryFilters: number[];
  currentPage: number;
};

export type Props = OwnProps & WithTranslation & WithStyles;

export class CommunicationInformationModal extends React.PureComponent<
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
    const title = `${t(`campaign.kind.${kind}`)} -  ${DateTime.fromISO(
      date_created,
    ).toFormat('D - t')}`;

    return (
      <CommunicationWrapperDialog
        buttonCancelText={t('common.close')}
        closeDialog={this.onClose}
        fullScreen={fullScreen}
        onCancel={this.onClose}
        open={open}
        title={title}
      >
        <>
          {!!this.props.contextTitle &&
            selectedCommunication?.channel !==
              COMMUNICATION_CHANNEL_SMARTLIST && (
              <div className={classes.contextContainer}>
                <Typography className={classes.boldTypo} variant="h6">
                  {this.props.contextTitle}
                </Typography>
                <Typography variant="body2">
                  {this.props.contextInformation}
                </Typography>
              </div>
            )}
          {!!this.props.allMemberCategoryList && (
            <CommunicationInformationModalFilter
              checkedFilters={this.state.checkedCategoryFilters}
              genericMemberCategories={this.props.allMemberCategoryList}
              setCheckedFilters={this.setCheckedCategoryFilters}
            />
          )}
          <Table aria-label="simple table" padding="normal" size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  className={classes.tableContainerWithoutBorderBottom}
                >
                  <Typography
                    className={classNames(
                      classes.boldTypo,
                      classes.textHeaderEllipsis,
                    )}
                    variant="body1"
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
                  <Typography className={classes.boldTypo} variant="body1">
                    {t('dialogInformation.headerStatus')}
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  className={classes.tableContainerWithoutBorderBottom}
                >
                  <Typography className={classes.boldTypo} variant="body1">
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
                        className={classes.tableContainerWithoutBorderBottom}
                        component="th"
                        scope="row"
                      >
                        <div className={classes.tableCellRecipient}>
                          <Avatar
                            alt={recipient.member?.name}
                            className={classes.avatar}
                            src={recipient.member?.photo}
                          />
                          <Typography
                            className={classes.recipientName}
                            variant="body1"
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
              className={classes.paginationContainer}
              count={pageCount}
              onChange={this.handleChangePage}
              page={this.state.currentPage}
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
