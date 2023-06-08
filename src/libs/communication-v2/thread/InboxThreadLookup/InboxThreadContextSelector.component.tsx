import React, { memo, useCallback } from 'react';
import classnames from 'classnames';

import { Button, Typography, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';

type Props = {
  handleContextThreadChange: (context: ChatThreadKinds) => void;
  contextSelected: ChatThreadKinds;
};

const InboxThreadContextSelector: React.FC<Props> = ({
  handleContextThreadChange,
  contextSelected,
}) => {
  const { t } = useTranslation('communication');

  const classes = useStyles();

  const isMemberSelected = contextSelected === ChatThreadKinds.Member;
  const isSmartlistSelected = contextSelected === ChatThreadKinds.Smartlist;
  const isOfferSelected = contextSelected === ChatThreadKinds.Offer;

  const getMemberThreads = useCallback(() => {
    handleContextThreadChange(ChatThreadKinds.Member);
  }, [handleContextThreadChange]);

  const getSmartlistThreads = useCallback(() => {
    handleContextThreadChange(ChatThreadKinds.Smartlist);
  }, [handleContextThreadChange]);

  const getOfferThreads = useCallback(() => {
    handleContextThreadChange(ChatThreadKinds.Offer);
  }, [handleContextThreadChange]);

  return (
    <div className={classes.contexts}>
      <div className={classes.buttonsContainer}>
        <Button
          onClick={getMemberThreads}
          className={classnames(classes.kindButton, {
            [classes.buttonActive]: isMemberSelected,
          })}
        >
          <Typography
            variant="subtitle2"
            color={isMemberSelected ? 'textPrimary' : 'textSecondary'}
            className={classes.kindText}
          >
            {t(`thread.kind.${ChatThreadKinds.Member}`)}
          </Typography>
        </Button>
        <Button
          onClick={getSmartlistThreads}
          className={classnames(classes.kindButton, {
            [classes.buttonActive]: isSmartlistSelected,
          })}
        >
          <Typography
            variant="subtitle2"
            color={isSmartlistSelected ? 'textPrimary' : 'textSecondary'}
            className={classes.kindText}
          >
            {t(`thread.kind.${ChatThreadKinds.Smartlist}`)}
          </Typography>
        </Button>
        <Button
          onClick={getOfferThreads}
          className={classnames(classes.kindButton, {
            [classes.buttonActive]: isOfferSelected,
          })}
        >
          <Typography
            variant="subtitle2"
            color={isOfferSelected ? 'textPrimary' : 'textSecondary'}
            className={classes.kindText}
          >
            {t(`thread.kind.${ChatThreadKinds.Offer}`)}
          </Typography>
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  contexts: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  kindButton: {
    textTransform: 'none',
    display: 'flex',
    flex: 1,
  },
  buttonActive: {
    backgroundColor: theme.palette.common.white,
  },
  kindText: {
    fontWeight: 'bold',
  },
  buttonsContainer: {
    backgroundColor: theme.palette.grey[200],
    display: 'flex',
    flexDirection: 'row',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5),
  },
}));

export default memo(InboxThreadContextSelector);
