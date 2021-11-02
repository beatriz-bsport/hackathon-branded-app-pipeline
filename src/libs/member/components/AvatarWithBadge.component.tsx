import React from 'react';
import { Avatar } from '@material-ui/core';
import { CreditMemberBadge } from './CreditMemberBadge.component.js';
import { TagBadge } from './TagBadge';
import { Member } from '../types';
import { Tag, TagGroup } from '../../tag/types';

type Props = {
  member: Member<Tag<TagGroup>>;
};

export const AvatarWithBadge = (props: Props) => {
  return (
    <TagBadge tags={props.member?.tags} name={props.member?.name}>
      <CreditMemberBadge credit={props.member?.credit_account_balance}>
        <Avatar src={props.member?.photo} />
      </CreditMemberBadge>
    </TagBadge>
  );
};
export default AvatarWithBadge;
