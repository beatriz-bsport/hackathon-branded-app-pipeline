// @flow

import React from 'react';
import { withState, pure, withProps, compose } from 'recompose';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import EditIcon from '@material-ui/icons/Edit';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EmailIcon from '@material-ui/icons/Email';
import ListItemText from '@material-ui/core/ListItemText';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import CreditMemberBadge from '../../member/components/CreditMemberBadge.component';

type Props = {
  memberId: number,
  relation: MemberRelation,
  onClick?: () => void,
  selected: boolean,
  goToMember: ?(id: number) => void,
  onEdit: (relation: MemberRelation) => void,
  menuAnchorEl: ?HTMLElement,
  toogleMenu: (?HTMLElement) => void,
  t: TFunction,
};

export const MemberRelationListItem = (props: Props) => {
  const { memberId, relation } = props;
  const relatedMember =
    relation.src_member.id === memberId
      ? relation.dst_member
      : relation.src_member;
  const relationName =
    relation.src_member.id === memberId ? relation.dst_name : relation.src_name;
  const classes = useStyles();
  return (
    <ListItem
      selected={props.selected}
      button={!!props.onClick}
      onClick={props.onClick}
      divider
    >
      <ListItemAvatar>
        <CreditMemberBadge credit={relatedMember.credit_account_balance}>
          <Avatar src={relatedMember.photo} />
        </CreditMemberBadge>
      </ListItemAvatar>
      <ListItemText
        primary={relatedMember.name || '  -'}
        secondary={
          <div className={classes.secondaryRow}>
            <Typography variant="caption" color="textSecondary">
              {relationName}
            </Typography>
            {!!relation.share_email && (
              <EmailIcon className={classes.rightIcon} fontSize="small" />
            )}
          </div>
        }
      />
      {props.goToMember ? (
        <IconButton
          onClick={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            props.goToMember(relatedMember.id);
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ) : null}
      <IconButton onClick={props.toogleMenu}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={props.menuAnchorEl}
        keepMounted
        open={!!props.menuAnchorEl}
        onClose={props.toogleMenu}
      >
        <MenuItem
          onClick={(ev) => {
            props.onEdit(props.relation);
            props.toogleMenu(ev);
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          {props.t('member.item.edit')}
        </MenuItem>
      </Menu>
    </ListItem>
  );
};
const useStyles = makeStyles((theme) => ({
  secondaryRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export default compose(
  withTranslation(['relationship']),
  withState('menuAnchorEl', 'setMenuAnchorEl', null),
  withProps(({ menuAnchorEl, setMenuAnchorEl }) => ({
    toogleMenu: (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      setMenuAnchorEl(menuAnchorEl ? null : ev.currentTarget);
    },
  })),
  pure,
)(MemberRelationListItem);
