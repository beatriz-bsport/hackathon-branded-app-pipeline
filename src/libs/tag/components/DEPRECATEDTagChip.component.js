// @flow
import React from 'react';
import Chip from '@material-ui/core/Chip';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';

import type { Tag, TagGroup } from '../types';

type Props = {
  tag: ?Tag,
  tagGroup: ?TagGroup,
  handleDelete: (id: number, include: boolean) => void,
  include: boolean,
  key?: number,
};

export const TagChip = (props: Props) => (
  <Chip
    key={props.key ? `${props.key}` : null}
    icon={props.include ? <CheckIcon /> : <BlockIcon />}
    label={`${(props.tagGroup || {}).name}: ${(props.tag || {}).name}`}
    onDelete={() => props.handleDelete((props.tag || {}).id, props.include)}
    size="small"
    color={props.include ? 'primary' : 'secondary'}
  />
);

export default TagChip;
