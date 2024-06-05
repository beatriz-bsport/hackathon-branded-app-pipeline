import React from 'react';
import { makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import type { BadgeClassKey } from '@material-ui/core/Badge';

import classNames from 'classnames';
import type { Member } from '#src/libs/member/types';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import CreditMemberBadge from './CreditMemberBadge.component';
import TagBadge from './TagBadge/TagBadge.component';

type Props = {
  member: Member<Tag<TagGroup>>;
  classes?: { [classKey in BadgeClassKey]+?: string };
  bottomCredit?: boolean;
};

const AvatarWithBadge: React.FC<Props> = ({
  member,
  classes,
  bottomCredit,
}) => {
  const classesStyle = useStyles();
  return (
    <div
      className={classNames({
        [classesStyle.hoverCredit]: member?.tags?.some(
          (tag) => !!tag?.icon && tag?.icon.length !== 0,
        ),
      })}
    >
      <TagBadge topLeftIcons member={member}>
        <CreditMemberBadge
          bottomCredit={bottomCredit}
          classes={classes}
          credit={member?.credit_account_balance}
          unpaidAmount={member?.total_unpaid_amount}
        >
          <Avatar src={member?.photo} />
        </CreditMemberBadge>
      </TagBadge>
    </div>
  );
};
const useStyles = makeStyles(() => ({
  hoverCredit: {
    '& $span.currencyBadge': {
      opacity: 1,
      transition: 'opacity 0.2s',
    },
    '&:hover': {
      '& $span.currencyBadge': {
        opacity: 0,
        transition: 'opacity 0.2s',
      },
    },
  },
}));

export default React.memo(AvatarWithBadge);
