// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withTranslation, TFunction } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';

import type { Tag, TagGroup } from '../types';

import TagEditor from './TagEditor';
import TagGroupCreator from './TagGroupCreator.component';
import type { Member } from '../../member/types';

type Props = {
  tagGroups: Array<TagGroup>,
  attributedTags: Array<number>,
  untag: (number) => void,
  tagGroupsLoading: boolean,
  attributeTag: (tagId: number) => void,
  createTag: (data: { name: string, group: number }) => void,
  createTagGroup: (data: { name: string }) => void,
  deleteTagGroup: (id: number) => void,
  updateTag: (tag: Tag | TagGroup) => void,
  updateTagGroup: ({ name: string, id: number }) => void,
  deleteTag: (id: number) => void,

  setCreateMode: (boolean) => void,
  createMode: boolean,
  setExpanded: (boolean) => void,
  expanded: boolean,
  t: TFunction,
  classes: Object,
  member: Member,
};

const EmptyTags = (props: { t: TFunction, classes: Object }) => (
  <Typography
    className={props.classes.noTagText}
    color="textSecondary"
    variant="caption"
  >
    {props.t('panel.noTagAvailable')}
  </Typography>
);

export function MemberTagPanel(props: Props) {
  const {
    classes,
    t,
    tagGroups,
    attributedTags,
    attributeTag,
    untag,
    tagGroupsLoading,
  } = props;
  return (
    <div>
      <ButtonBase
        disableRipple
        onClick={() => props.setExpanded(!props.expanded)}
        style={{ width: '100%' }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            className={classes.title}
            color={props.expanded ? 'inherit' : 'textSecondary'}
            component="h3"
            variant="h6"
          >
            {t('panel.title')}
          </Typography>
          {props.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
      </ButtonBase>
      <Divider />
      <Collapse in={props.expanded}>
        {tagGroupsLoading ? <LinearProgress /> : null}
        <div className={classes.tagsContainer}>
          {tagGroups.length === 0 && !tagGroupsLoading ? (
            <EmptyTags classes={classes} t={t} />
          ) : (
            tagGroups.map((tG) => (
              <TagEditor
                key={tG.id}
                deleteTag={(tag) => props.deleteTag(tag.id)}
                deleteTagGroup={(tagGroup: TagGroup) =>
                  props.deleteTagGroup(tagGroup.id)
                }
                disabled={props.member.archived}
                onCreate={(data) => props.createTag({ ...data, group: tG.id })}
                selectTag={attributeTag}
                tag={tG.tags.find((tag) => attributedTags.includes(tag.id))}
                tagGroup={tG}
                untag={untag}
                updateTag={props.updateTag}
                updateTagGroup={props.updateTagGroup}
              />
            ))
          )}
        </div>
        {props.createMode ? (
          <TagGroupCreator
            onCancel={() => props.setCreateMode(false)}
            onCreate={(data) => {
              props.setCreateMode(false);
              props.createTagGroup(data);
            }}
            t={props.t}
          />
        ) : (
          <Button
            color="primary"
            disabled={props.member.archived}
            onClick={() => props.setCreateMode(!props.createMode)}
            variant="outlined"
          >
            <AddIcon className={classes.leftIcon} />
            {t('form.group.addTagGroup')}
          </Button>
        )}
      </Collapse>
    </div>
  );
}
const styles = (theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
  tagsContainer: {
    marginBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  noTagText: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
});

export default compose(
  withTranslation(['tag']),
  withStyles(styles),
  withState('createMode', 'setCreateMode', false),
  withState('expanded', 'setExpanded', true),
)(MemberTagPanel);
