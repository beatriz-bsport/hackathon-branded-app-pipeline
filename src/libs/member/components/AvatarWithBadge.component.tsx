import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import type { BadgeClassKey } from '@material-ui/core/Badge';

import CreditMemberBadge from './CreditMemberBadge.component';
import TagBadge from './TagBadge/TagBadge.component';
import type { Member } from '../types';
import type { Tag, TagGroup } from '../../tag/types';

type Props = {
  member: Member<Tag<TagGroup>>;
  classes?: { [classKey in BadgeClassKey]+?: string };
};

export const AvatarWithBadge: React.FC<Props> = ({ member, classes }) => {
  return (
    <TagBadge tags={member?.tags} name={member?.name} topLeftIcons>
      <CreditMemberBadge
        credit={member?.credit_account_balance}
        classes={classes}
        bottomCredit
      >
        <Avatar src={member?.photo} />
      </CreditMemberBadge>
    </TagBadge>
  );
};
export default AvatarWithBadge;
