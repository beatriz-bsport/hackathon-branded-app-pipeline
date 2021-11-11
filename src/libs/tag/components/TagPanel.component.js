// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
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

import TagEditor from './TagEditor.component';
import TagGroupCreator from './TagGroupCreator.component';

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
};

const EmptyTags = (props: { t: TFunction, classes: Object }) => (
  <Typography
    className={props.classes.noTagText}
    variant="caption"
    color="textSecondary"
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
        style={{ width: '100%' }}
        disableRipple
        onClick={() => props.setExpanded(!props.expanded)}
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
            component="h3"
            color={props.expanded ? 'inherit' : 'textSecondary'}
            variant="h6"
            className={classes.title}
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
            <EmptyTags t={t} classes={classes} />
          ) : (
            tagGroups.map((tG) => (
              <TagEditor
                key={tG.id}
                updateTag={props.updateTag}
                updateTagGroup={props.updateTagGroup}
                deleteTag={(tag) => props.deleteTag(tag.id)}
                tagGroup={tG}
                tag={tG.tags.find((tag) => attributedTags.includes(tag.id))}
                selectTag={attributeTag}
                untag={untag}
                onCreate={(data) => props.createTag({ ...data, group: tG.id })}
                deleteTagGroup={(tagGroup: TagGroup) =>
                  props.deleteTagGroup(tagGroup.id)
                }
              />
            ))
          )}
        </div>
        {props.createMode ? (
          <TagGroupCreator
            t={props.t}
            onCreate={(data) => {
              props.setCreateMode(false);
              props.createTagGroup(data);
            }}
            onCancel={() => props.setCreateMode(false)}
          />
        ) : (
          <Button
            color="primary"
            variant="outlined"
            onClick={() => props.setCreateMode(!props.createMode)}
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
