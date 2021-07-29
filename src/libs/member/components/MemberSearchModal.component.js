// @flow
import React from 'react';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
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
import { withTranslation } from 'react-i18next';
import { compose, withState, withStateHandlers } from 'recompose';

import type { TFunction } from 'react-i18next';
import SearchMemberInput from '../../../pages/offer-management/SearchMember.component';
import MemberForm from '../MemberForm.component';

import type { Member } from '../types';

type Props = {
  open: boolean,
  asManager?: boolean,
  loading: boolean,
  searchMembers: (text: string) => void,
  searchedMembers: Array<Member>,
  searchedText: string,
  setSearchedText: (string) => void,
  onClose: () => void,
  handlMemberSelected: (id: number, member: Member) => void,
  classes: Object,
  t: TFunction,

  createMember: (data: any, options: OptionCallback) => void,
  country: string,

  openCreateForm: () => void,
  closeCreateForm: () => void,
  isOpenCreateForm: boolean,
  managerFormConfig: SignUpFormConfigDict,
  waiver: string,
  generalTermsAndConditions: string,
};

const MemberListItem = (props: { member: Member, onClick: () => void }) => (
  <ListItem button={!!props.onClick} onClick={props.onClick}>
    <ListItemText primary={props.member.name} secondary={props.member.email} />
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

export function MemberSearchModal(props: Props) {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (props.isOpenCreateForm) {
    return (
      <Dialog fullScreen={fullScreen} open={props.open}>
        <MemberForm
          asManager={props.asManager}
          onCancel={props.closeCreateForm}
          onSubmit={(data, options) =>
            props.createMember(data, {
              onSuccess: (member) => {
                props.handlMemberSelected(member.id, member);
              },
              onError: options && options.onError,
            })
          }
          goToMember={() => {}}
          goToMemberList={() => {}}
          country={props.country}
          managerFormConfig={props.managerFormConfig}
          waiver={props.waiver}
          generalTermsAndConditions={props.generalTermsAndConditions}
        />
      </Dialog>
    );
  }
  return (
    <Dialog
      open={props.open}
      fullScreen={fullScreen}
      scroll="paper"
      classes={{
        root: props.classes.root,
        paper: props.classes.root,
      }}
    >
      <DialogTitle>
        <SearchMemberInput
          searchedText={props.searchedText}
          onChange={(ev) => {
            props.setSearchedText(ev.target.value);
            props.searchMembers(ev.target.value);
          }}
          onReset={() => {}}
        />
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div
          style={{
            width: '100%',
          }}
        >
          {!!props.createMember && (
            <ListItem button onClick={props.openCreateForm}>
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary={props.t('search.createMember')} />
            </ListItem>
          )}
          <List>
            {props.loading ? <LinearProgress /> : null}
            {props.searchedMembers.map((member: Member) => (
              <MemberListItem
                member={member}
                key={member.id}
                onClick={() => props.handlMemberSelected(member.id, member)}
              />
            ))}
          </List>
        </div>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={props.onClose} color="secondary">
          {props.t('search.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const styles = () => ({
  root: {
    minHeight: '80vh',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['member']),
  withState('searchedText', 'setSearchedText', ''),
  withStateHandlers(
    { isOpenCreateForm: false },
    {
      openCreateForm: () => () => ({ isOpenCreateForm: true }),
      closeCreateForm: () => () => ({ isOpenCreateForm: false }),
    },
  ),
)(MemberSearchModal);
