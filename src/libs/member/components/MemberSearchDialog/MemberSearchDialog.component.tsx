import React from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';

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
import Pagination from '@material-ui/lab/Pagination';
import Alert from '@material-ui/lab/Alert';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
// @ts-expect-error
import SearchMember from '../../../../pages/offer-management/SearchMember.component';
// @ts-expect-error
import MemberForm from '#libs/member/MemberForm.component';
import { getLatest } from '#libs/member/api';
import type { MemberMinimal } from '#libs/member/types';
import type { OptionCallback } from '../../../../state/types';

import useStyles from './styles';

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
    <div
      className={classes.listItemContainer}
      role="button"
      tabIndex={0}
      onClick={onClickItem}
      onKeyDown={stopPropagation}
    >
      <div className={classes.listItemInfo}>
        <Avatar className={classes.avatar}>
          <img height={32} src={member.photo} alt={member.name} />
        </Avatar>

        <div className={classes.memberInfo}>
          <Typography variant="body1">{member.name}</Typography>

          <div className={classes.memberEmailAndPhone}>
            {member.email ? (
              <Chip icon={<Mail />} size="small" label={member.email} />
            ) : null}
            {member.phone ? (
              <Chip icon={<Phone />} size="small" label={member.phone} />
            ) : null}
          </div>
        </div>
      </div>

      {selected && <Check />}
    </div>
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
  createMember: (data: FormData, options?: OptionCallback) => void;
  companyCountry: string;
  isAuthenticatingForContract?: boolean;
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
  isAuthenticatingForContract,
}) => {
  const [searchText, setSearchText] = React.useState('');

  const [searchResults, setSearchResults] = React.useState<MemberMinimal[]>([]);

  const [selectedMemberId, setSelectedMemberId] = React.useState<number>(null);

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
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(ev.target.value);
      searchMembers(
        ev.target.value,
        {},
        {
          onSuccess: (response) => setSearchResults(response.data),
        },
      );
    },
    [searchMembers],
  );

  const onValidateClick = React.useCallback(() => {
    if (selectedMemberId) {
      onMemberValidate(selectedMemberId);
    }
  }, [selectedMemberId, onMemberValidate]);

  const onNewMemberCreate = React.useCallback(
    (data: FormData, options: OptionCallback) =>
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
      open={open}
      onClose={closeModal}
      noFullScreen
      maxWidth={showMemberCreateForm ? 'xl' : 'sm'}
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        <Typography variant="h6" className={classes.title}>
          {t('interface.memberModal.title')}
        </Typography>

        <IconButton onClick={closeModal} className={classes.closeIcon}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {showMemberCreateForm ? (
          <MemberForm
            asManager
            onCancel={closeMemberCreateForm}
            onSubmit={onNewMemberCreate}
            goToMember={onMemberValidate}
            companyCountry={companyCountry}
            withoutTitle
            alreadyExistingGoToButtonText="exists.quicksale"
          />
        ) : (
          <>
            {isAuthenticatingForContract && (
              <Alert severity="info" className={classes.alert}>
                {t('interface.authenticationNecessary')}
              </Alert>
            )}
            <div className={classes.searchBarAndNewMember}>
              <SearchMember
                onReset={clearSearch}
                searchedText={searchText}
                onChange={onChange}
                memberHistory={[]}
                onClickRegister={setSelectedMemberId}
                fullWidth
              />

              <IconButton
                onClick={openMemberCreateForm}
                className={classes.addMemberButton}
              >
                <PersonAdd className={classes.addMemberIcon} />
              </IconButton>
            </div>

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
                      selected={
                        (!selectedMemberId &&
                          member.id === preSelectedMemberId) ||
                        member.id === selectedMemberId
                      }
                      onClick={setSelectedMemberId}
                    />
                  ))}
                {searchResults.length > PAGE_SIZE && (
                  <Pagination
                    page={pageNumber}
                    count={Math.ceil(searchResults.length / PAGE_SIZE)}
                    onChange={handleChangePage}
                    className={classes.pagination}
                  />
                )}
              </div>
            ) : null}
          </>
        )}
      </DialogContent>

      {!showMemberCreateForm && (
        <DialogActions className={classes.dialogActions}>
          <Button
            variant="contained"
            color="primary"
            disabled={
              !selectedMemberId || selectedMemberId === preSelectedMemberId
            }
            onClick={onValidateClick}
            className={classes.confirmButton}
          >
            {t('interface.memberModal.confirm')}
          </Button>
        </DialogActions>
      )}
    </GenericResponsiveDialog>
  );
};

export default React.memo(MemberAuthenticationDialog);
