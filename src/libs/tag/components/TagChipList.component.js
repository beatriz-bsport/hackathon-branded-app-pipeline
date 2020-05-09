// @flow
import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import withStyles from '@material-ui/core/styles/withStyles';
import CancelIcon from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import TagChip from './TagChip.component';

import type { Tag, TagGroup } from '../types';

type Props = {
  includes: Array<number>,
  excludes: Array<number>,
  tagGroups: Array<TagGroup>,
  tags: Array<Tag>,
  handleAdd: () => void,
  handleDeleteTag: (tagId: number, wasIncluded: boolean) => void,
  handleReinit: () => void,

  classes: Object,
  t: TFunction,
};

export const TagChipList = (props: Props) => {
  const includedTags = props.includes.map((id) =>
    props.tags.find((t) => t.id === id),
  );
  const excludedTags = props.excludes.map((id) =>
    props.tags.find((t) => t.id === id),
  );
  return (
    <div className={props.classes.container}>
      <IconButton onClick={props.handleAdd}>
        <AddIcon />
      </IconButton>
      <div className={props.classes.list}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {includedTags.map((tag) => (
            <div
              className={props.classes.chipContainer}
              key={`${(tag || {}).id}`}
            >
              <TagChip
                tag={tag}
                include
                tagGroup={props.tagGroups.find(
                  (tg) => tg.id === (tag || {}).group,
                )}
                handleDelete={(id) => props.handleDeleteTag(id, true)}
              />
            </div>
          ))}
          {excludedTags.map((tag) => (
            <div
              className={props.classes.chipContainer}
              key={`${(tag || {}).id}`}
            >
              <TagChip
                key={(tag || {}).id}
                tag={tag}
                include={false}
                tagGroup={props.tagGroups.find(
                  (tg) => tg.id === (tag || {}).group,
                )}
                handleDelete={(id) => props.handleDeleteTag(id, false)}
              />
            </div>
          ))}
          {excludedTags.length === 0 && includedTags.length === 0 ? (
            <ButtonBase onClick={props.handleAdd}>
              <Typography
                color="textSecondary"
                className={props.classes.emptyText}
              >
                {props.t('filter.addATagFilter')}
              </Typography>
            </ButtonBase>
          ) : null}
        </div>
        {excludedTags.length !== 0 || includedTags.length !== 0 ? (
          <IconButton onClick={props.handleReinit}>
            <CancelIcon />
          </IconButton>
        ) : null}
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8E8E8',
    borderRadius: theme.spacing(1),
  },
  chipContainer: {
    paddingLeft: theme.spacing(1),
  },
  emptyText: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    '&:hover': {
      color: '#A0A0A0',
    },
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['tag']),
)(TagChipList);
