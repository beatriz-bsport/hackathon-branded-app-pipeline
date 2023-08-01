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
          classes={{
            root: classnames({ [classes.noHoverOnSelectd]: isMemberSelected }),
          }}
          className={classnames(classes.kindButton, {
            [classes.buttonActive]: isMemberSelected,
          })}
          disableRipple={isMemberSelected}
          onClick={getMemberThreads}
        >
          <Typography
            color={isMemberSelected ? 'textPrimary' : 'textSecondary'}
            variant="subtitle2"
          >
            {t(`thread.kind.${ChatThreadKinds.Member}`)}
          </Typography>
        </Button>
        <Button
          classes={{
            root: classnames({
              [classes.noHoverOnSelectd]: isSmartlistSelected,
            }),
          }}
          className={classnames(classes.kindButton, {
            [classes.buttonActive]: isSmartlistSelected,
          })}
          disableRipple={isSmartlistSelected}
          onClick={getSmartlistThreads}
        >
          <Typography
            color={isSmartlistSelected ? 'textPrimary' : 'textSecondary'}
            variant="subtitle2"
          >
            {t(`thread.kind.${ChatThreadKinds.Smartlist}`)}
          </Typography>
        </Button>
        <Button
          classes={{
            root: classnames({ [classes.noHoverOnSelectd]: isOfferSelected }),
          }}
          className={classnames(classes.kindButton, {
            [classes.buttonActive]: isOfferSelected,
          })}
          disableRipple={isOfferSelected}
          onClick={getOfferThreads}
        >
          <Typography
            color={isOfferSelected ? 'textPrimary' : 'textSecondary'}
            variant="subtitle2"
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
    '&:hover': {
      '@media (hover: none)': {
        backgroundColor: theme.palette.common.white,
      },
    },
  },
  buttonActive: {
    backgroundColor: theme.palette.common.white,
  },
  noHoverOnSelectd: {
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
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
