import React, { memo } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ItemClickIcon from '#src/components/icons/ItemClick.component';

type Props = {};

const InboxNoThread: React.FC<Props> = () => {
  const { t } = useTranslation('communication');
  const classes = useStyles();

  return (
    <div className={classes.noThread}>
      <ItemClickIcon color="primary" />
      <Typography align="center" className={classes.noThreadTitle} variant="h6">
        {t('thread.selectThread.title')}
      </Typography>
      <Typography align="center" variant="body1">
        {t('thread.selectThread.description')}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  noThread: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // Size taken from Figma, never displayed on responsive view
    width: '435px',
  },
  noThreadTitle: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1.5),
  },
}));

export default memo(InboxNoThread);
