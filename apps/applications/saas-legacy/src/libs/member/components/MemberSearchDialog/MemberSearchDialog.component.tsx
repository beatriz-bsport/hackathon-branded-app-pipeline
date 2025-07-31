import React from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import clsx from 'clsx';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Check from '@material-ui/icons/Check';
import Mail from '@material-ui/icons/Mail';
import Phone from '@material-ui/icons/Phone';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import Alert from '@material-ui/lab/Alert';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
// @ts-expect-error
import MemberForm from '#src/libs/member/MemberForm.component';
import { getLatest } from '#src/libs/member/api';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type { MemberFormData, MemberMinimal } from '#src/libs/member/types';
import type { OptionCallback } from '#src/state/types';

import useStyles from './styles';
import MemberSearchBar from '../MemberSearchBar.component';

type ListItemProps = {
  member: MemberMinimal;
  selected?: boolean;
  onClick?: (memberId: number | null) => void;
};

const ListItem: React.FC<ListItemProps> = ({ member, selected, onClick }) => {
  const onClickItem = React.useCallback(() => {
    if (selected) onClick?.(null);
    else onClick?.(member.id);
  }, [member, onClick, selected]);

  const stopPropagation = React.useCallback(
    (ev: React.KeyboardEvent<HTMLDivElement>) => {
      ev.stopPropagation();
    },
    [],
  );

  const classes = useStyles({ selected });

  return (
    <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.readInfo">
      {(hasMemberReadInfoPermission: boolean) => (
        <div
          className={classes.listItemContainer}
          onClick={onClickItem}
          onKeyDown={stopPropagation}
          role="button"
          tabIndex={0}
        >
          <div className={classes.listItemInfo}>
            <Avatar className={classes.avatar}>
              <img alt={member.name} height={32} src={member.photo} />
            </Avatar>

            <div className={classes.memberInfo}>
              <Typography variant="body1">{member.name}</Typography>

              <div className={classes.memberEmailAndPhone}>
                {hasMemberReadInfoPermission && member.email ? (
                  <Chip icon={<Mail />} label={member.email} size="small" />
                ) : null}
                {hasMemberReadInfoPermission && member.phone ? (
                  <Chip icon={<Phone />} label={member.phone} size="small" />
                ) : null}
              </div>
            </div>
          </div>

          {selected && <Check />}
        </div>
      )}
    </ObjectLevelPermissionProvider>
  );
};

type Props = {
  open: boolean;
  onClose?: () => void;
  preSelectedMemberId?: number;
  onMemberChoose: (memberId: number) => void;
  searchMembers: (
    text: string,
    params: {
      [key: string]: string | number | boolean;
    },
    options?: OptionCallback<AxiosResponse<MemberMinimal[]>>,
  ) => void;
  createMember: (data: MemberFormData, options?: OptionCallback) => void;
  companyCountry: string;
  isAuthenticationRequired?: boolean;
  elementClasses?: { [key: string]: string };
  isDisplayCancelButton?: boolean;
};

const PAGE_SIZE = 5;

const MemberAuthenticationDialog: React.FC<Props> = ({
  open,
  onClose,
  preSelectedMemberId,
  onMemberChoose,
  searchMembers,
  createMember,
  companyCountry,
  isAuthenticationRequired,
  elementClasses,
  isDisplayCancelButton,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const [searchText, setSearchText] = React.useState('');

  const [searchResults, setSearchResults] = React.useState<MemberMinimal[]>([]);

  const [selectedMemberId, setSelectedMemberId] = React.useState<number | null>(
    null,
  );

  const [showMemberCreateForm, setShowMemberCreateForm] = React.useState(false);

  const [pageNumber, setPageNumber] = React.useState(1);
  const handleChangePage = React.useCallback(
    (_: React.ChangeEvent<unknown> | null, page: number = 1) =>
      setPageNumber(page),
    [],
  );

  const openMemberCreateForm = React.useCallback(() => {
    setShowMemberCreateForm(true);
  }, []);

  const closeMemberCreateForm = React.useCallback(() => {
    setShowMemberCreateForm(false);
  }, []);

  const clearSearch = React.useCallback(() => {
    setSearchText('');
    setSearchResults([]);
    setSelectedMemberId(null);
  }, []);

  const onMemberValidate = React.useCallback(
    (memberId: number) => {
      onMemberChoose(memberId);
      clearSearch();
      closeMemberCreateForm();
    },
    [clearSearch, closeMemberCreateForm, onMemberChoose],
  );

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.trim() === '') {
        clearSearch();
        return;
      }

      setSearchText(event.target.value);
      setIsLoading(true);
      searchMembers(
        event.target.value,
        { hide_archived: true },
        {
          onSuccess: (response) => {
            setSearchResults(response?.data ?? []);
            setIsLoading(false);
          },
          onError: () => setIsLoading(false),
        },
      );
    },
    [clearSearch, searchMembers],
  );

  const onValidateClick = React.useCallback(() => {
    if (selectedMemberId) {
      onMemberValidate(selectedMemberId);
    }
  }, [selectedMemberId, onMemberValidate]);

  const onNewMemberCreate = React.useCallback(
    (data: MemberFormData, options: OptionCallback) =>
      createMember(data, {
        onSuccess: async () => {
          options?.onSuccess?.();
          const response = await getLatest();
          onMemberValidate(response.data);
        },
        onError: options && options.onError,
      }),
    [createMember, onMemberValidate],
  );

  const closeModal = React.useCallback(() => {
    clearSearch();
    setShowMemberCreateForm(false);
    onClose?.();
  }, [clearSearch, onClose]);

  const { t } = useTranslation('quicksale');

  const classes = useStyles({ showMemberCreateForm });

  return (
    <GenericResponsiveDialog
      noFullScreen
      maxWidth={showMemberCreateForm ? 'xl' : 'sm'}
      onClose={closeModal}
      open={open}
    >
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <Typography className={classes.title} variant="h6">
          {t('interface.memberModal.title')}
        </Typography>

        <IconButton className={classes.closeIcon} onClick={closeModal}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {showMemberCreateForm ? (
          <MemberForm
            asManager
            withoutTitle
            alreadyExistingGoToButtonText="exists.quicksale"
            companyCountry={companyCountry}
            goToMember={onMemberValidate}
            onCancel={closeMemberCreateForm}
            onSubmit={onNewMemberCreate}
          />
        ) : (
          <>
            {isAuthenticationRequired && (
              <Alert className={classes.alert} severity="info">
                {t('interface.authenticationNecessary')}
              </Alert>
            )}
            <div
              className={clsx(
                classes.searchBarAndNewMember,
                elementClasses?.searchBarContainer,
              )}
            >
              <MemberSearchBar
                fullWidth
                memberHistory={[]}
                onChange={onChange}
                // @ts-expect-error
                onClickRegister={setSelectedMemberId}
                onReset={clearSearch}
                searchedText={searchText}
              />
              <IconButton
                className={clsx(
                  classes.addMemberButton,
                  elementClasses?.addMemberButton,
                )}
                onClick={openMemberCreateForm}
              >
                <PersonAdd
                  className={clsx(
                    classes.addMemberIcon,
                    elementClasses?.addMemberIcon,
                  )}
                />
              </IconButton>
            </div>
            {isLoading && (
              <div className={classes.loadingSpinner}>
                <CircularProgress className={classes.spinner} size={25} />
              </div>
            )}
            {searchResults.length ? (
              <div>
                {searchResults
                  .slice(
                    (pageNumber - 1) * PAGE_SIZE,
                    Math.min(searchResults.length, pageNumber * PAGE_SIZE),
                  )
                  .map((member) => (
                    <ListItem
                      key={member.id}
                      member={member}
                      onClick={setSelectedMemberId}
                      selected={
                        (!selectedMemberId &&
                          member.id === preSelectedMemberId) ||
                        member.id === selectedMemberId
                      }
                    />
                  ))}
                {searchResults.length > PAGE_SIZE && (
                  <Pagination
                    className={classes.pagination}
                    count={Math.ceil(searchResults.length / PAGE_SIZE)}
                    onChange={handleChangePage}
                    page={pageNumber}
                  />
                )}
              </div>
            ) : null}
          </>
        )}
      </DialogContent>

      {!showMemberCreateForm && (
        <DialogActions
          className={clsx(
            classes.dialogActions,
            elementClasses?.actionsContainer,
          )}
        >
          {isDisplayCancelButton && onClose && (
            <Button onClick={onClose}>
              {t('interface.memberModal.cancel')}
            </Button>
          )}
          <Button
            className={clsx(elementClasses?.submit, classes.confirmButton)}
            color="primary"
            disabled={
              !selectedMemberId || selectedMemberId === preSelectedMemberId
            }
            onClick={onValidateClick}
            variant="contained"
          >
            {t('interface.memberModal.confirm')}
          </Button>
        </DialogActions>
      )}
    </GenericResponsiveDialog>
  );
};

export default React.memo(MemberAuthenticationDialog);
