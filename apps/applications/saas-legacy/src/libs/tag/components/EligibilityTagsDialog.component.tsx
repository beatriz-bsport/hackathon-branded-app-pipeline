import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import { Tag, TagGroup } from '../types';
import { TagChip } from './TagChip.component';

type Props = {
  whitelistTags: Array<Tag<TagGroup>>;
  blacklistTags: Array<Tag<TagGroup>>;
  onClose: () => void;
  onModify: () => void;
  open: boolean;
};

export const EligibilityTagsDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('b2b_tag');
  const { open, whitelistTags, blacklistTags } = props;

  const renderTags = (tags: Array<Tag<TagGroup>>, msg: string) => {
    if (tags?.length) {
      return tags.map((tag: Tag<TagGroup>) => (
        <div key={tag.id} className={classes.tag}>
          <TagChip size="small" tag={tag} />
        </div>
      ));
    }
    return msg;
  };

  return (
    <GenericResponsiveDialog maxWidth="sm" open={open}>
      <DialogContent>
        <div className={classes.tagsBlock}>
          <Typography variant="h6">
            {t('eligibility.dialog.whiteList')}
          </Typography>
          <Divider />
          <div className={classes.tagListSection}>
            {renderTags(whitelistTags, t('eligibility.dialog.noAuthorizedTag'))}
          </div>
        </div>

        <div className={classes.tagsBlock}>
          <Typography variant="h6">
            {t('eligibility.dialog.blackList')}
          </Typography>
          <Divider />
          <div className={classes.tagListSection}>
            {renderTags(
              blacklistTags,
              t('eligibility.dialog.noUnauthorizedTag'),
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button id="button_exit" onClick={props.onClose}>
          {t('eligibility.dialog.close')}
        </Button>
        <Button color="primary" id="button_modify" onClick={props.onModify}>
          {t('eligibility.dialog.edit')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialog: {
    maxHeight: '80vh',
    overflow: 'no',
    minWidth: '60vw',
    justifyContent: 'center',
    margin: theme.spacing(2),
  },

  tagsBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  tagListSection: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  tag: {
    margin: theme.spacing(0.5),
  },
}));

export default EligibilityTagsDialog;
