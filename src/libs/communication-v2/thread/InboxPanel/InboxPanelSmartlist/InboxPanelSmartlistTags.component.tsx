import React, { memo } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import type { Tag, TagGroup } from '#libs/tag/types';
import TagChip from '#libs/tag/components/TagChip.component';

type Props = {
  includedTags: Tag<TagGroup>[];
  excludedTags: Tag<TagGroup>[];
};

const InboxPanelSmartlistTags: React.FC<Props> = ({
  includedTags,
  excludedTags,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('communication');

  return (
    <div className={classes.sectionContainer}>
      <Typography variant="body1" color="textPrimary">
        {t('thread.panel.tags')}
      </Typography>
      <div className={classes.tagContainer}>
        {includedTags?.map((tag) => (
          <div className={classes.chipContainer} key={`${(tag || {}).id}`}>
            <TagChip
              tag={
                tag && {
                  ...tag,
                  color: theme.palette.primary.main,
                  icon: 'Check',
                }
              }
              size="small"
            />
          </div>
        ))}
        {excludedTags?.map((tag) => (
          <div className={classes.chipContainer} key={`${(tag || {}).id}`}>
            <TagChip
              tag={
                tag && {
                  ...tag,
                  color: theme.palette.secondary.main,
                  icon: 'Block',
                }
              }
              size="small"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: theme.spacing(4),
  },
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  chipContainer: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default memo(InboxPanelSmartlistTags);
