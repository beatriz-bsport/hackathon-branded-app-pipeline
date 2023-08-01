import React, { memo } from 'react';

import type { CallHistoryMethodAction } from 'connected-react-router';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';

import type { Member } from '#libs/member/types';
import type { Tag, TagGroup } from '#libs/tag/types';
import InboxPanelMemberDetail from './InboxPanelMemberDetail.component';
import InboxPanelMemberTags from '#libs/communication-v2/thread/InboxPanel/InboxPanelMember/InboxPanelMemberTags.component';
import InboxPanelMemberAccountBalance from '#libs/communication-v2/thread/InboxPanel/InboxPanelMember/InboxPanelMemberAccountBalance.component';
import InboxPanelMemberUnpaidInvoices from '#libs/communication-v2/thread/InboxPanel/InboxPanelMember/InboxPanelMemberUnpaidInvoices.component';
import InboxPanelMemberSection from '#libs/communication-v2/thread/InboxPanel/InboxPanelMember/InboxPanelMemberSection.component';

type Props = {
  member: Member;
  tags: Tag<TagGroup>[];
  goToMemberPage?: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
  unpaidInvoicesCount?: number;
};

const InboxPanelMember: React.FC<Props> = ({
  member,
  tags,
  goToMemberPage,
  unpaidInvoicesCount,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('communication');

  const docCount = member?.files ? member.files.length : 0;
  const notesCount = member?.notes ? member.notes.length : 0;

  return (
    <div className={classes.memberContainer}>
      <InboxPanelMemberDetail goToMemberPage={goToMemberPage} member={member} />
      {!!member?.tags?.length && (
        <InboxPanelMemberTags memberTags={member?.tags} tags={tags} />
      )}
      <InboxPanelMemberAccountBalance
        accountBalance={member?.credit_account_balance}
      />

      <InboxPanelMemberUnpaidInvoices
        unpaidInvoicesCount={unpaidInvoicesCount}
      />

      {!!docCount && (
        <InboxPanelMemberSection
          count={docCount}
          title={t('thread.panel.member.files')}
        />
      )}
      {!!notesCount && (
        <InboxPanelMemberSection
          count={notesCount}
          title={t('thread.panel.member.notes')}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  memberContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(1),
  },
}));

export default memo(InboxPanelMember);
