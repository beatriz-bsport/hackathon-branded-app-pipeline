import React from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import { makeStyles } from '@material-ui/core/styles';
import { Tag, TagGroup } from '../../tag/types';
import TagChip from '../../tag/components/TagChip.component';

type Props = {
  whitelistTags: Array<Tag<TagGroup>>;
  blacklistTags: Array<Tag<TagGroup>>;
  onClose: () => void;
  onModify: () => void;
  open: boolean;
};

export const PaymentPackCompatibilityDialog = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);
  const { open, whitelistTags, blacklistTags } = props;

  const renderTags = (tags: Array<Tag<TagGroup>>, msg: string) => {
    if (tags.length) {
      return tags.map((tag: Tag<TagGroup>) => (
        <div className={classes.tag}>
          <TagChip key={tag.id} tag={tag} size="small" />
        </div>
      ));
    }
    return msg;
  };

  return (
    <Dialog open={open} className={classes.dialog} maxWidth="xl">
      <div className={classes.dialogContent}>
        <div className={classes.tagsBlock}>
          <Typography variant="h6">{t('whiteList')}</Typography>
          <Divider />
          <div className={classes.tagListSection}>
            {renderTags(whitelistTags, t('noAuthorizedTag'))}
          </div>
        </div>

        <div className={classes.tagsBlock}>
          <Typography variant="h6">{t('blackList')}</Typography>
          <Divider />
          <div className={classes.tagListSection}>
            {renderTags(blacklistTags, t('noUnauthorizedTag'))}
          </div>
        </div>
      </div>
      <DialogActions>
        <Button id="button_modify" color="primary" onClick={props.onModify}>
          {t('actions.edit')}
        </Button>
        <Button id="button_exit" onClick={props.onClose}>
          {t('actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
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
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4),
    width: 750,
    maxWidth: '100%',
    maxHeight: '70vh',
    overflow: 'scroll',
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
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  tag: {
    margin: theme.spacing(0.5),
  },
}));

export default PaymentPackCompatibilityDialog;
