import React, { memo } from 'react';

import { useTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ItemClickIcon from '#components/icons/ItemClick.component';
import InfoBox from '#components/box/InfoBox.component';

type Props = {
  count: number;
  contextSelected: ChatThreadKinds;
};

const InboxNoThread: React.FC<Props> = ({ count, contextSelected }) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();

  return (
    <>
      {count ? (
        <div className={classes.noThread}>
          <ItemClickIcon />
          <Typography
            variant="h6"
            align="center"
            className={classes.noThreadTitle}
          >
            {t('thread.selectThread.title')}
          </Typography>
          <Typography variant="body1" align="center">
            {t('thread.selectThread.description')}
          </Typography>
        </div>
      ) : (
        <InfoBox content={t(`thread.noThread.item.${contextSelected}`)} />
      )}
    </>
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
