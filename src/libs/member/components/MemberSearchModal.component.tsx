import React from 'react';
import { useTranslation } from 'react-i18next';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import type { Theme } from '@material-ui/core';
import { Cake } from '@material-ui/icons';
import moment from 'moment-timezone';

// @ts-expect-error
import SearchMemberInput from '../../../pages/offer-management/SearchMember.component';
// @ts-expect-error
import MemberForm from '../MemberForm.component';
import { Member } from '../types';
import { OptionCallback } from '../../../state/types';

type Props = {
  open: boolean;
  asManager?: boolean;
  loading?: boolean;
  searchMembers?: (text: string) => void;
  searchedMembers: Array<Member>;
  onClose: () => void;
  handlMemberSelected: (id: number, member: Member) => void;
  disabled?: boolean;
  createMember?: (data: any, options: OptionCallback<Member>) => void;
  country?: string;
  waiver?: string;
  generalTermsAndConditions?: string;
};

const MemberListItem = (props: {
  member: Member;
  isBirthday: boolean;
  theme: Theme;
  onClick?: () => void;
  disabled: boolean;
}) => (
  <ListItem
    disabled={props.disabled}
    // @ts-expect-error
    button={!!props.onClick}
    onClick={props.onClick}
  >
    <ListItemText
      primary={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div>{props.member.name}</div>
          <div
            style={{
              marginLeft: props.theme.spacing(0.5),
              paddingTop: props.theme.spacing(0.25),
            }}
          >
            {props.isBirthday && (
              <Cake style={{ fontSize: '14px' }} color="secondary" />
            )}
          </div>
        </div>
      }
      secondary={props.member.email}
    />
    <ListItemSecondaryAction>
      <IconButton
        onClick={(ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          props.onClick();
        }}
      >
        <ArrowForwardIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

export const MemberSearchModal: React.FC<Props> = ({
  open,
  asManager,
  loading,
  searchMembers,
  searchedMembers,
  onClose,
  handlMemberSelected,
  createMember,
  country,
  waiver,
  disabled,
  generalTermsAndConditions,
}) => {
  const { t } = useTranslation(['member']);
  const classes = useStyles();
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchedText, setSearchedText] = React.useState('');
  const [isOpenCreateForm, setIsOpenCreateForm] = React.useState(false);

  const openCreateForm = () => setIsOpenCreateForm(true);
  const closeCreateForm = () => setIsOpenCreateForm(false);

  if (isOpenCreateForm && !!createMember) {
    return (
      <Dialog fullScreen={fullScreen} open={open}>
        <MemberForm
          asManager={asManager}
          onCancel={closeCreateForm}
          onSubmit={(data: any, options: OptionCallback) =>
            createMember?.(data, {
              onSuccess: (member: Member) => {
                handlMemberSelected(member.id, member);
              },
              onError: options && options.onError,
            })
          }
          goToMember={() => {}}
          goToMemberList={() => {}}
          companyCountry={country}
          waiver={waiver}
          generalTermsAndConditions={generalTermsAndConditions}
        />
      </Dialog>
    );
  }
  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      scroll="paper"
      classes={{
        root: classes.root,
        paper: classes.root,
      }}
    >
      <DialogTitle>
        <SearchMemberInput
          searchedText={searchedText}
          disabled={disabled}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            setSearchedText(ev.target.value);
            searchMembers?.(ev.target.value);
          }}
          onReset={() => {
            setSearchedText('');
            searchMembers?.(null);
          }}
        />
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div
          style={{
            width: '100%',
          }}
        >
          {!!createMember && (
            <ListItem button disabled={disabled} onClick={openCreateForm}>
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary={t('search.createMember')} />
            </ListItem>
          )}
          <List>
            {loading ? <LinearProgress /> : null}
            {searchedMembers.map((member: Member) => {
              const isBirthday = member?.birthday
                ? moment().format('MM-DD') ===
                  moment(member.birthday).format('MM-DD')
                : false;
              return (
                <MemberListItem
                  member={member}
                  disabled={disabled}
                  key={member.id}
                  isBirthday={isBirthday}
                  theme={theme}
                  onClick={() => handlMemberSelected(member.id, member)}
                />
              );
            })}
          </List>
        </div>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} disabled={disabled} color="secondary">
          {t('search.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    minHeight: '80vh',
  },
}));

export default MemberSearchModal;
