import React, { useCallback, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';

import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { SmartListPopupSending } from '#src/libs/communication-v2/types';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import { FetchRecipientsParams, Member } from '#src/libs/member/types';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import { createUrl } from '#src/utils/createUrlHandlers';
import SmartListPopupListItem, {
  MEMBER_PAGE_SIZE,
} from '#src/libs/communication-v2/components/SmartListPopupListItem.component';
import { OptionCallback } from '#src/state/types';

const getUrl = (value: string | any) => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    return createUrl(value);
  }

  return null;
};

type Props = {
  smartListId: number;
  open: boolean;
  onClose: () => void;
  fetchMembers: (params: FetchRecipientsParams) => void;
  smartListPopupList?: Array<SmartListPopupSending>;
  memberLoading: boolean;
  membersToDisplay?: Array<Member>;
  loading?: boolean;
  onSmartListPopupDelete: (
    customAppPopupLinkId: number,
    options?: OptionCallback,
  ) => void;
};

const SmartListPopupSendingDrawer: React.FC<Props> = ({
  smartListId,
  open,
  onClose,
  fetchMembers,
  smartListPopupList,
  memberLoading,
  membersToDisplay,
  loading,
  onSmartListPopupDelete,
}) => {
  const { t } = useTranslation(['communication']);
  const classes = useStyle();

  // Pop-up preview
  const [smartListPopupToPreview, setSmartListPopupToPreview] =
    useState<SmartListPopupSending | null>(null);

  const closePreview = useCallback(() => setSmartListPopupToPreview(null), []);

  // Pop-up member list
  const [smartListPopupToShowMembers, setSmartListPopupToShowMembers] =
    useState<SmartListPopupSending | null>(null);

  const openMemberList = useCallback(
    (smartListPopup: SmartListPopupSending) => {
      fetchMembers({
        id__in: (smartListPopup?.member_ids ?? []).slice(0, MEMBER_PAGE_SIZE),
        page_size: MEMBER_PAGE_SIZE,
      });
      setSmartListPopupToShowMembers(smartListPopup);
    },
    [fetchMembers],
  );

  const [memberListPage, setMemberListPage] = useState(1);

  const handleChangePage = useCallback(
    (_: React.ChangeEvent<unknown> | null, page: number = 1) => {
      fetchMembers({
        id__in:
          (smartListPopupToShowMembers?.member_ids ?? []).slice(
            (page - 1) * MEMBER_PAGE_SIZE,
            page * MEMBER_PAGE_SIZE,
          ) ?? [],
        page_size: MEMBER_PAGE_SIZE,
      });
      setMemberListPage(page);
    },
    [fetchMembers, smartListPopupToShowMembers?.member_ids],
  );

  const closeMemberList = useCallback(
    () => setSmartListPopupToShowMembers(null),
    [],
  );

  const filteredMembersToDisplay = useMemo(
    () =>
      (membersToDisplay ?? []).filter((member) =>
        (smartListPopupToShowMembers?.member_ids ?? []).includes(member.id),
      ),
    [membersToDisplay, smartListPopupToShowMembers?.member_ids],
  );

  const smartListPopupsToDisplay = useMemo(
    () =>
      (smartListPopupList ?? []).filter(
        (smartListPopup) => smartListPopup?.smartlist === smartListId,
      ),
    [smartListPopupList, smartListId],
  );

  return (
    <GenericResponsiveDrawer
      withoutPadding
      onClose={onClose}
      open={open}
      title={t('smartListPopup.drawerTitle')}
    >
      <Divider className={classes.topDivider} />
      {loading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.listContainer}>
          {smartListPopupsToDisplay.length > 0 ? (
            smartListPopupsToDisplay.map((smartListPopup, index) => (
              <SmartListPopupListItem
                key={smartListPopup.id}
                noDivider={index === 0}
                onSmartListPopupDelete={onSmartListPopupDelete}
                openMemberList={openMemberList}
                openPreview={setSmartListPopupToPreview}
                smartListPopup={smartListPopup}
              />
            ))
          ) : (
            <div className={classes.noResult}>
              <Alert className={classes.noResultInfo} severity="info">
                {t('smartListPopup.noSmartListPopup')}
              </Alert>
            </div>
          )}
        </div>
      )}
      <Divider />
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose}>{t('smartListPopup.close')}</Button>
      </DialogActions>

      {/* Preview */}
      <GenericResponsiveDialog
        padding
        onClose={closePreview}
        open={!!smartListPopupToPreview}
      >
        <DialogTitle>{t('smartListPopup.previewTitle')}</DialogTitle>
        <div className={classes.previewInner}>
          <div className={classes.previewTitle}>
            {smartListPopupToPreview?.custom_app_popup_link?.name}
            <CloseIcon />
          </div>
          <img
            alt="some-cover"
            className={classes.previewImage}
            src={getUrl(smartListPopupToPreview?.custom_app_popup_link?.image)}
          />
          <div className={classes.previewBottom}>
            <Button
              className={classes.previewBottomButton}
              color="primary"
              variant="contained"
            >
              {t('smartListPopup.preview')}
            </Button>
          </div>
        </div>
        <DialogActions>
          <Button color="secondary" onClick={closePreview}>
            {t('smartListPopup.cancelPreview')}
          </Button>
        </DialogActions>
      </GenericResponsiveDialog>

      {/* Recipient list */}
      <GenericResponsiveDialog
        maxWidth="sm"
        onClose={closeMemberList}
        open={!!smartListPopupToShowMembers}
      >
        <DialogTitle>
          {`${t('smartListPopup.memberListTitle')} - ${DateTime.fromISO(
            smartListPopupToShowMembers?.custom_app_popup_link?.date_created ||
              DateTime.now().toISO(),
          ).toFormat('D')} - ${DateTime.fromISO(
            smartListPopupToShowMembers?.custom_app_popup_link?.date_created ||
              DateTime.now().toISO(),
          ).toFormat('t')}`}
        </DialogTitle>
        <Typography className={classes.recipientsAmount} variant="subtitle1">
          {`${smartListPopupToShowMembers?.member_ids.length ?? 0} ${t(
            'smartListPopup.recipient',
            { count: smartListPopupToShowMembers?.member_ids.length ?? 0 },
          )}`}
        </Typography>
        {memberLoading ? (
          <CircularProgress />
        ) : (
          filteredMembersToDisplay.map((member) => (
            <div key={member.id} className={classes.memberListItem}>
              <Avatar src={member.photo} />
              <Typography variant="body1">{member.name}</Typography>
            </div>
          ))
        )}
        {smartListPopupToShowMembers?.member_ids.length > MEMBER_PAGE_SIZE && (
          <Pagination
            className={classes.pagination}
            count={Math.ceil(
              smartListPopupToShowMembers?.member_ids.length / MEMBER_PAGE_SIZE,
            )}
            onChange={handleChangePage}
            page={memberListPage}
          />
        )}
        <DialogActions>
          <Button color="secondary" onClick={closeMemberList}>
            {t('smartListPopup.close')}
          </Button>
        </DialogActions>
      </GenericResponsiveDialog>
    </GenericResponsiveDrawer>
  );
};

const useStyle = makeStyles((theme) => ({
  dialogActions: {
    margin: theme.spacing(4),
    padding: 0,
  },
  topDivider: {
    marginTop: theme.spacing(2),
  },
  previewInner: {
    background: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    boxShadow: theme.shadows[5],
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3.25),
  },
  previewTitle: {
    display: 'flex',
    padding: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 22,
  },
  previewBottom: {
    padding: theme.spacing(2),
  },
  previewBottomButton: {
    width: '100%',
    padding: theme.spacing(2),
  },
  listContainer: {
    padding: theme.spacing(3),
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  loading: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(5),
  },
  noResult: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  noResultInfo: {
    borderRadius: theme.spacing(3),
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(1.625),
  },
  memberListItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2.625),
    padding: theme.spacing(0.75),
    paddingLeft: theme.spacing(4),
  },
  recipientsAmount: {
    fontWeight: 500,
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  previewImage: {
    width: '100%',
    objectFit: 'cover',
  },
}));

export default React.memo(SmartListPopupSendingDrawer);
