import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';

import clsx from 'clsx';
import { COMMUNICATION_CHANNEL_SMARTLIST } from '@bsport/common/lib/master-data/communication-filters.js';
import type {
  Recipient,
  CommunicationMessage,
} from '#src/libs/communication-v2/types';
import type { Member } from '#src/libs/member/types';
import CommunicationWrapperDialog from '#src/libs/communication-v2/components/CommunicationWrapperDialog.component';
import CommunicationInformationStatusChip from '#src/libs/communication-v2/components/MessageList/ModalInformation/CommunicationInformationStatusChip.component';
import CommunicationInformationOpenChip from '#src/libs/communication-v2/components/MessageList/ModalInformation/CommunicationInformationOpenChip.component';
import CommunicationInformationModalFilter from '#src/libs/communication-v2/components/MessageList/ModalInformation/CommunicationInformationModalFilter.component';
import {
  FetchRecipientsParams,
  useRecipientInformation,
} from '#src/libs/communication-v2/hooks/useRecipientsInformations.hooks';
import { useCommunicationContext } from '#src/libs/communication-v2/context/CommunicationDrawer.context';
import { COMMUNICATION_KIND_PUSH_NOTIFICATION } from '@bsport/common/lib/master-data/communication-kind';

export type Props = {
  contextInformation?: string;
  modalTitle?: string;
  handleCloseDialog: () => void;
  open: boolean;
  paginationSize: number;
  selectedCommunication: CommunicationMessage | null;
};

export const CommunicationInformationModal: React.FC<Props> = ({
  contextInformation,
  modalTitle,
  handleCloseDialog,
  open,
  paginationSize,
  selectedCommunication,
}: Props) => {
  const { communicationMember, allMemberCategoryList } =
    useCommunicationContext();
  const [checkedCategoryFilters, setCheckedCategoryFilters] = useState<
    number[]
  >(
    allMemberCategoryList?.categories.map((cat) => cat.categoryIdentifier) ||
      [],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    recipientList,
    loadingRecipientList,
    recipientListCount,
    fetchRecipients,
  } = useRecipientInformation(communicationMember);
  const { t } = useTranslation('communication');
  const classes = useStyles();

  const fetchRecipientPaginatedListCallback = useCallback(() => {
    if (selectedCommunication?.communication) {
      const params: FetchRecipientsParams = {
        communication: selectedCommunication.communication,
        page: currentPage,
        memberSelectedCategories: checkedCategoryFilters,
      };
      fetchRecipients(params);
    }
  }, [
    fetchRecipients,
    selectedCommunication,
    currentPage,
    checkedCategoryFilters,
  ]);

  const handleChangePage = useCallback(
    (event: ChangeEvent<unknown>, page: number = 1) => {
      setCurrentPage(page);
    },
    [],
  );

  const onClose = useCallback(() => {
    setCheckedCategoryFilters(
      allMemberCategoryList?.categories.map((cat) => cat.categoryIdentifier) ||
        [],
    );
    setCurrentPage(1);
    handleCloseDialog();
  }, [allMemberCategoryList, setCheckedCategoryFilters, handleCloseDialog]);

  useEffect(() => {
    fetchRecipientPaginatedListCallback();
  }, [
    fetchRecipientPaginatedListCallback,
    checkedCategoryFilters,
    currentPage,
  ]);

  const recipientsCount = recipientListCount || 0;
  const kind = selectedCommunication?.communication?.kind;
  const date_created = selectedCommunication?.communication?.date_created;
  const pageCount = communicationMember
    ? 1
    : Math.ceil(recipientsCount / paginationSize);
  const title = `${t(`campaign.kind.${kind}`)} -  ${DateTime.fromISO(
    date_created || '',
  ).toFormat('D - t')}`;

  // We do not want to display the "Open" column for push notifications
  // because this communication method does not support this feature yet (see ticket CDP-963 on Linear)
  const shouldDisplayOpenStatus =
    selectedCommunication?.communication?.kind !==
    COMMUNICATION_KIND_PUSH_NOTIFICATION;

  return (
    <CommunicationWrapperDialog
      buttonCancelText={t('common.close')}
      closeDialog={onClose}
      onCancel={onClose}
      open={open}
      title={title}
    >
      <>
        {!!modalTitle &&
          selectedCommunication?.channel !==
            COMMUNICATION_CHANNEL_SMARTLIST && (
            <div className={classes.contextContainer}>
              <Typography className={classes.boldTypo} variant="h6">
                {modalTitle}
              </Typography>
              <Typography variant="body2">{contextInformation}</Typography>
            </div>
          )}
        {!!allMemberCategoryList && (
          <CommunicationInformationModalFilter
            checkedFilters={checkedCategoryFilters}
            genericMemberCategories={allMemberCategoryList}
            setCheckedFilters={setCheckedCategoryFilters}
          />
        )}
        <Table aria-label="simple table" padding="normal" size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableContainerWithoutBorderBottom}>
                <Typography
                  className={clsx(classes.boldTypo, classes.textHeaderEllipsis)}
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
              {shouldDisplayOpenStatus ? (
                <TableCell
                  align="center"
                  className={classes.tableContainerWithoutBorderBottom}
                >
                  <Typography className={classes.boldTypo} variant="body1">
                    {t('dialogInformation.headerOpen')}
                  </Typography>
                </TableCell>
              ) : null}
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
                    {shouldDisplayOpenStatus ? (
                      <TableCell
                        align="center"
                        className={classes.tableContainerWithoutBorderBottom}
                      >
                        <CommunicationInformationOpenChip
                          openStatus={recipient.read_count > 0}
                        />
                      </TableCell>
                    ) : null}
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
            onChange={handleChangePage}
            page={currentPage}
          />
        )}
      </>
    </CommunicationWrapperDialog>
  );
};

const useStyles = makeStyles((theme) => ({
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
}));

export default React.memo(CommunicationInformationModal);
