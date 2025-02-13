import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { WithStyles } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';

import ReportProblem from '@material-ui/icons/ReportProblemOutlined';
import Edit from '@material-ui/icons/Edit';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
  COMMUNICATION_KIND_SMS,
} from '@bsport/common/lib/master-data/communication-kind.js';

import type { Member } from '#src/libs/member/types';
import { openNewBackOfficeWindow } from '#src/utils/windows';

type CommunicationRecipientsModalRowProps = {
  member: Member;
  kind: number;
  uncheckedMembers: {
    email: number[];
    phone: number[];
    notification: number[];
  };
  t: (key: string) => string;
  setOpenRefreshDialog: (open: boolean) => void;
  uncheckedMembersOfCurrentKind: number[];
  setUncheckedMembers: (listIdsUnchecked: {
    email: number[];
    phone: number[];
    notification: number[];
  }) => void;
} & WithStyles;

const CommunicationRecipientsModalRow: React.FC<
  CommunicationRecipientsModalRowProps
> = ({
  member,
  classes,
  kind,
  uncheckedMembers,
  t,
  setOpenRefreshDialog,
  uncheckedMembersOfCurrentKind,
  setUncheckedMembers,
}: CommunicationRecipientsModalRowProps) => {
  const memberPhoneOrEmailContent = useMemo(() => {
    switch (kind) {
      case COMMUNICATION_KIND_EMAIL:
        return member?.email || '';
      case COMMUNICATION_KIND_SMS:
        return member?.phone || member?.phone_number || '';
      default:
        return '';
    }
  }, [kind, member]);

  const missingPhoneOrEmailContent = useMemo(() => {
    switch (kind) {
      case COMMUNICATION_KIND_EMAIL:
        return t('dialogRecipients.noMail');
      case COMMUNICATION_KIND_SMS:
        return t('dialogRecipients.noPhone');
      default:
        return '';
    }
  }, [kind, t]);

  const memberWithoutPhoneOrEmail = useMemo(
    () =>
      kind !== COMMUNICATION_KIND_PUSH_NOTIFICATION &&
      !memberPhoneOrEmailContent,
    [kind, memberPhoneOrEmailContent],
  );

  const getMemberToggleState = useCallback(
    (memberId: number) => {
      return uncheckedMembersOfCurrentKind?.indexOf(memberId) === -1;
    },
    [uncheckedMembersOfCurrentKind],
  );

  const handleToggleOfSelectedKind = useCallback(
    (previousUncheckedList: number[], memberId: number) => {
      const currentIndex = previousUncheckedList.indexOf(memberId);
      const newUncheckedList = [...previousUncheckedList];
      if (currentIndex === -1) {
        newUncheckedList.push(memberId);
      } else {
        newUncheckedList.splice(currentIndex, 1);
      }
      return newUncheckedList;
    },
    [],
  );

  const handleToggle = useCallback(
    (memberId: number) => () => {
      const prevState = { ...uncheckedMembers };
      let nextState;
      switch (kind) {
        case COMMUNICATION_KIND_EMAIL:
          nextState = {
            ...prevState,
            email: handleToggleOfSelectedKind(prevState.email, memberId),
          };
          break;
        case COMMUNICATION_KIND_SMS:
          nextState = {
            ...prevState,
            phone: handleToggleOfSelectedKind(prevState.phone, memberId),
          };
          break;
        case COMMUNICATION_KIND_PUSH_NOTIFICATION:
          nextState = {
            ...prevState,
            notification: handleToggleOfSelectedKind(
              prevState.notification,
              memberId,
            ),
          };
          break;
        default:
          nextState = { ...prevState };
          break;
      }
      setUncheckedMembers(nextState);
    },
    [kind, setUncheckedMembers, uncheckedMembers, handleToggleOfSelectedKind],
  );

  const openMemberPage = useCallback(
    (event: React.SyntheticEvent<any>, memberId: number) => {
      event.preventDefault();
      const url = `/member/edit/${memberId}`;
      openNewBackOfficeWindow(url);
      setOpenRefreshDialog(true);
    },
    [setOpenRefreshDialog],
  );

  const onEditClick = useCallback(
    (event: React.MouseEvent) => {
      openMemberPage(event, member.id);
    },
    [openMemberPage, member.id],
  );

  return (
    <TableRow>
      <TableCell
        className={classes.cellWithoutBorder}
        component="th"
        scope="row"
      >
        <div className={classes.flexRowContainer}>
          <Avatar
            alt={member.name}
            className={classes.avatar}
            src={member.photo}
          />
          <div className={classes.cellRowRecipient}>
            <Typography variant="body1">{member.name}</Typography>
            {kind !== COMMUNICATION_KIND_PUSH_NOTIFICATION && (
              <Hidden smUp>
                {memberWithoutPhoneOrEmail ? (
                  <div className={classes.flexRowContainer}>
                    <ReportProblem className={classes.warningIcon} />
                    <Typography
                      className={classes.cellRowRecipientTextWithWarning}
                      variant="body2"
                    >
                      {missingPhoneOrEmailContent}
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="body2">
                    {memberPhoneOrEmailContent}
                  </Typography>
                )}
              </Hidden>
            )}
          </div>
        </div>
      </TableCell>
      <Hidden xsDown>
        <TableCell
          className={clsx(
            classes.cellWithWarningIcon,
            classes.cellWithoutBorder,
          )}
        >
          {memberWithoutPhoneOrEmail ? (
            <ReportProblem className={classes.warningIcon} />
          ) : null}
        </TableCell>
        {kind !== COMMUNICATION_KIND_PUSH_NOTIFICATION ? (
          <TableCell align="left" className={classes.cellWithoutBorder}>
            {memberWithoutPhoneOrEmail ? (
              <Typography className={classes.warningRedColor} variant="body2">
                {missingPhoneOrEmailContent}
              </Typography>
            ) : (
              <Typography variant="body2">
                {memberPhoneOrEmailContent}
              </Typography>
            )}
          </TableCell>
        ) : (
          <TableCell align="left" className={classes.cellWithoutBorder} />
        )}
      </Hidden>
      <TableCell align="right" className={classes.cellWithoutBorder}>
        {memberWithoutPhoneOrEmail ? (
          <IconButton onClick={onEditClick}>
            <Edit className={classes.warningRedColor} />
          </IconButton>
        ) : (
          <Checkbox
            checked={getMemberToggleState(member.id)}
            onChange={handleToggle(member.id)}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default React.memo(CommunicationRecipientsModalRow);
