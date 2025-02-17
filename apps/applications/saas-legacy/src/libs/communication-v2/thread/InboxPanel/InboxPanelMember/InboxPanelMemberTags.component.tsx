import React, { memo, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import type { Tag, TagGroup } from '#src/libs/tag/types';
import TagChip from '#src/libs/tag/components/TagChip.component';

type Props = { memberTags: number[]; tags: Tag<TagGroup>[] };

const InboxMemberTags: React.FC<Props> = ({ memberTags, tags }) => {
  const classes = useStyles();
  const { t } = useTranslation('communication');

  const getMemberTagsWithData = useMemo(
    () =>
      memberTags.map((id: number) =>
        tags.find((tag: Tag<TagGroup>) => tag.id === id),
      ),
    [memberTags, tags],
  );

  return (
    <div className={classes.container}>
      <Typography variant="body1">{t('thread.panel.tags')}</Typography>
      <div className={classes.tagContainer}>
        {getMemberTagsWithData?.map((tag) => (
          <div key={tag?.id} className={classes.chipContainer}>
            <TagChip tag={tag} />
          </div>
        ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.grey[300],
  },
  tagContainer: {
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chipContainer: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default memo(InboxMemberTags);
