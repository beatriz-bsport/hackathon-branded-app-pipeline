// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { withNamespaces } from 'react-i18next';
import { compose, withState } from 'recompose';

import type { TFunction } from 'react-i18next';
import SearchMemberInput from '../../../pages/offer-management/SearchMember.component';

import type { Member } from '../types';

type Props = {
  open: boolean,
  loading: boolean,
  searchMembers: (text: string) => void,
  searchedMembers: Array<Member>,
  searchedText: string,
  setSearchedText: (string) => void,
  onClose: () => void,
  handlMemberSelected: (id: number, member: Member) => void,
  classes: Object,
  t: TFunction,
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
  return (
    <Dialog
      open={props.open}
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
          <List>
            {props.loading ? <LinearProgress /> : null}
            {props.searchedMembers.map((member: Member) => (
              <MemberListItem
                member={member}
                onClick={() => props.handlMemberSelected(member.id, member)}
              />
            ))}
          </List>
        </div>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={props.onClose} color="secondary">
          {props.t('common.cancel')}
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
  withNamespaces(),
  withState('searchedText', 'setSearchedText', ''),
)(MemberSearchModal);
