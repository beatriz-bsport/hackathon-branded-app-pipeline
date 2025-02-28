import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

import Pagination from '@material-ui/lab/Pagination';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import CircularProgress from '@material-ui/core/CircularProgress';
import { amber, red } from '@material-ui/core/colors';

import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
  COMMUNICATION_KIND_SMS,
} from '@bsport/common/lib/master-data/communication-kind.js';

import type { FilteringMemberIdsByGenericCategories } from '#src/libs/communication-v2/types';
import type { Member } from '#src/libs/member/types';
import CommunicationWrapperDialog from '#src/libs/communication-v2/components/CommunicationWrapperDialog.component';
import CommunicationRecipientModalFilter from '#src/libs/communication-v2/components/MessageSender/ModalRecipient/CommunicationRecipientsModalFilter.component';
import CommunicationRecipientsModalRow from '#src/libs/communication-v2/components/MessageSender/ModalRecipient/CommunicationRecipientsModalRow.component';
import RecipientInformationsWarning from '#src/libs/communication-v2/components/MessageSender/ModalRecipient/RecipientInformationsWarning.component';

export type Props = {
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  checkedMemberCategoriesFilters: number[];
  countAvailableRecipientsTotal: number;
  countAvailableRecipientsWithEmail: number;
  countAvailableRecipientsWithPhone: number;
  fetchPaginatedAvailableRecipientMemberList: (page: number) => void;
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

const CommunicationRecipientsModal: React.FC<Props> = ({
  allMemberCategoryList,
  checkedMemberCategoriesFilters,
  countAvailableRecipientsTotal,
  countAvailableRecipientsWithEmail,
  countAvailableRecipientsWithPhone,
  fetchPaginatedAvailableRecipientMemberList,
  handleCloseDialog,
  kind,
  loadingPaginatedMemberList,
  open,
  pageSize,
  paginatedMemberList,
  setCheckedMemberCategoriesFilters,
  setUncheckedMembers,
  uncheckedMembers,
}: Props) => {
  const [page, setPage] = useState<number>(1);
  const [displayWarningFull, setDisplayWarningFull] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [openRefreshDialog, setOpenRefreshDialog] = useState<boolean>(false);
  const [draftUncheckedMembers, setDraftUncheckedMember] = useState<{
    email: number[];
    phone: number[];
    notification: number[];
  }>({
    email: uncheckedMembers?.email ?? [],
    phone: uncheckedMembers?.phone ?? [],
    notification: uncheckedMembers?.notification ?? [],
  });
  const { t } = useTranslation('communication');
  const classes = useStyles();

  const uncheckedMembersOfCurrentKind = useMemo(() => {
    switch (kind) {
      case COMMUNICATION_KIND_EMAIL:
        return draftUncheckedMembers.email;
      case COMMUNICATION_KIND_SMS:
        return draftUncheckedMembers.phone;
      case COMMUNICATION_KIND_PUSH_NOTIFICATION:
        return draftUncheckedMembers.notification;
      default:
        return [];
    }
  }, [draftUncheckedMembers, kind]);

  const warningMessage = useMemo(() => {
    const hasMissingPhones =
      kind === COMMUNICATION_KIND_SMS &&
      countAvailableRecipientsTotal - countAvailableRecipientsWithPhone > 0;
    const hasMissingEmails =
      kind === COMMUNICATION_KIND_EMAIL &&
      countAvailableRecipientsTotal - countAvailableRecipientsWithEmail > 0;
    const hasMissingPhonesOrEmails = hasMissingPhones || hasMissingEmails;
    const hasUnselectedRecipients = uncheckedMembersOfCurrentKind?.length > 0;
    if (hasMissingPhonesOrEmails && hasUnselectedRecipients) {
      return t('dialogRecipients.warnings.full');
    }
    if (hasMissingPhonesOrEmails && !hasUnselectedRecipients) {
      return t('dialogRecipients.warnings.phoneOrMailMissing');
    }
    if (hasUnselectedRecipients && !hasMissingPhonesOrEmails) {
      return t('dialogRecipients.warnings.recipientsNotAllSelected');
    }
    return '';
  }, [
    t,
    kind,
    countAvailableRecipientsTotal,
    countAvailableRecipientsWithPhone,
    countAvailableRecipientsWithEmail,
    uncheckedMembersOfCurrentKind,
  ]);

  const handleChangePage = useCallback(
    (event: React.ChangeEvent<unknown> | null, pageToUse: number = 1) => {
      setPage(pageToUse);
    },
    [],
  );

  const handleFilterChangeMemberCategories = useCallback(
    (nextCheckedFilters: number[]) => {
      setCheckedMemberCategoriesFilters(nextCheckedFilters, () =>
        handleChangePage(null, 1),
      );
    },
    [setCheckedMemberCategoriesFilters, handleChangePage],
  );

  const onClose = useCallback(() => {
    setDisplayWarningFull(false);
    setOpenRefreshDialog(false);
    setAnchorEl(null);
    handleCloseDialog();
  }, [handleCloseDialog]);

  const onConfirm = useCallback(() => {
    setUncheckedMembers(draftUncheckedMembers);
    onClose();
  }, [setUncheckedMembers, draftUncheckedMembers, onClose]);

  useEffect(() => {
    fetchPaginatedAvailableRecipientMemberList(page);
  }, [fetchPaginatedAvailableRecipientMemberList, page]);

  const onRefreshMemberData = useCallback(() => {
    fetchPaginatedAvailableRecipientMemberList(page);
    setOpenRefreshDialog(false);
  }, [fetchPaginatedAvailableRecipientMemberList, page]);

  const pageCount = useMemo(
    () => Math.ceil(countAvailableRecipientsTotal / pageSize),
    [countAvailableRecipientsTotal, pageSize],
  );

  return (
    <CommunicationWrapperDialog
      buttonCancelText={t('common.cancel')}
      buttonConfirmText={t('common.confirm')}
      closeDialog={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      open={open}
      title={t('dialogReceiverChoice.title')}
    >
      <>
        {!!allMemberCategoryList && (
          <CommunicationRecipientModalFilter
            checkedFilters={checkedMemberCategoriesFilters}
            genericMemberCategories={allMemberCategoryList}
            setCheckedFilters={handleFilterChangeMemberCategories}
          />
        )}
        <Table aria-label="simple table" padding="normal" size="small">
          <TableHead>
            <RecipientInformationsWarning
              anchorEl={anchorEl}
              classes={classes}
              displayWarningFull={displayWarningFull}
              setAnchorEl={setAnchorEl}
              setDisplayWarningFull={setDisplayWarningFull}
              t={t}
              warningMessage={warningMessage}
            />
          </TableHead>
          {!loadingPaginatedMemberList && (
            <TableBody>
              {paginatedMemberList.map((member: Member) => (
                <React.Fragment key={member.id}>
                  <CommunicationRecipientsModalRow
                    classes={classes}
                    kind={kind}
                    member={member}
                    setOpenRefreshDialog={setOpenRefreshDialog}
                    setUncheckedMembers={setDraftUncheckedMember}
                    t={t}
                    uncheckedMembers={draftUncheckedMembers}
                    uncheckedMembersOfCurrentKind={
                      uncheckedMembersOfCurrentKind
                    }
                  />
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
            className={classes.paginationContainer}
            count={pageCount}
            onChange={handleChangePage}
            page={page}
          />
        )}
        {openRefreshDialog && (
          <CommunicationWrapperDialog
            buttonConfirmText={t('common.refresh')}
            maxWidth="xs"
            onConfirm={onRefreshMemberData}
            open={openRefreshDialog}
          >
            <p>{t('dialogRecipients.refreshMemberData')}</p>
          </CommunicationWrapperDialog>
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
}));

export default React.memo(CommunicationRecipientsModal);
