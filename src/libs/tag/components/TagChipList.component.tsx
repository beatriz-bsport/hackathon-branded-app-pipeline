import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import CancelIcon from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import useTheme from '@material-ui/core/styles/useTheme';
import makeStyles from '@material-ui/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';
import type { Tag, TagGroup } from '../types';
import TagChip from './TagChip.component';

type Props = {
  includes: Array<number>;
  excludes: Array<number>;
  tags: Array<Tag<TagGroup>>;
  handleAdd: () => void;
  handleDeleteTag: (tagId: number, wasIncluded: boolean) => void;
  handleReinit: () => void;
};

export const TagChipList = (props: Props) => {
  const includedTags = props.includes.map((id) =>
    props.tags.find((t) => t.id === id),
  );
  const excludedTags = props.excludes.map((id) =>
    props.tags.find((t) => t.id === id),
  );
  const companyTheme = useTheme();
  const classes = useStyles();
  const { t } = useTranslation('tag');

  return (
    <div className={classes.container}>
      <IconButton onClick={props.handleAdd}>
        <AddIcon />
      </IconButton>
      <div className={classes.list}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {includedTags.map((tag) => (
            <div key={`${(tag || {}).id}`} className={classes.chipContainer}>
              <TagChip
                onDelete={() => props.handleDeleteTag(tag.id, true)}
                size="small"
                tag={
                  tag
                    ? {
                        ...tag,
                        color: companyTheme.palette.primary.main,
                        icon: 'Check',
                      }
                    : null
                }
              />
            </div>
          ))}
          {excludedTags.map((tag) => (
            <div key={`${(tag || {}).id}`} className={classes.chipContainer}>
              <TagChip
                onDelete={() => props.handleDeleteTag(tag.id, false)}
                size="small"
                tag={
                  tag
                    ? {
                        ...tag,
                        color: companyTheme.palette.secondary.main,
                        icon: 'Block',
                      }
                    : null
                }
              />
            </div>
          ))}
          {excludedTags.length === 0 && includedTags.length === 0 ? (
            <ButtonBase onClick={props.handleAdd}>
              <Typography className={classes.emptyText} color="textSecondary">
                {t('filter.addATagFilter')}
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

const useStyles = makeStyles<Theme>((theme) => ({
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
}));

export default React.memo(TagChipList);
