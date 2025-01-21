import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';

import Tooltip from '#src/components/Tooltip.component';

type Props = {
  name?: string;
  picture?: string;
  isEditOffer?: boolean;
  onCancel: () => void;
  onBannerGoBack?: () => void;
};

const OfferFormBanner = (props: Props) => {
  const { name, picture, isEditOffer, onCancel, onBannerGoBack } = props;
  const classes = useStyles();
  const { t } = useTranslation('common');

  const backgroundImage = useMemo(() => {
    if (picture) {
      return `url(${picture})`;
    }
    return 'none';
  }, [picture]);

  return (
    <div
      className={clsx(classes.container, {
        [classes.containerWithoutName]: !name,
      })}
      id="offer-form-banner"
      style={{ backgroundImage }}
    >
      {picture && <div className={classes.gradientContainer} />}

      <div
        className={clsx(classes.titleContainer, {
          [classes.whiteText]: picture,
        })}
      >
        {!isEditOffer && onBannerGoBack ? (
          <Tooltip title={t('back')}>
            <IconButton
              classes={{
                root: classes.cancelButtonRoot,
                label: picture ? classes.whiteText : null,
              }}
              onClick={onBannerGoBack}
            >
              <KeyboardArrowLeft className={classes.cancelButtonIcon} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={t('cancel')}>
            <IconButton
              classes={{
                root: classes.cancelButtonRoot,
                label: picture ? classes.whiteText : null,
              }}
              onClick={onCancel}
            >
              <HighlightOffIcon className={classes.cancelButtonIcon} />
            </IconButton>
          </Tooltip>
        )}
        <div className={classes.titleContainerText}>
          <Typography variant="h4">{t('translation:common.offers')}</Typography>
          <Typography variant="body1">
            {t(
              isEditOffer
                ? 'translation:common.offerEdition'
                : 'translation:common.offerCreation',
            )}
          </Typography>
        </div>
      </div>

      {name && onBannerGoBack && (
        <div className={classes.buttonContainer}>
          <Button
            classes={{
              root: clsx(classes.backButtonRoot, {
                [classes.whiteText]: picture,
              }),
              label: classes.backButtonLabel,
            }}
            color="primary"
            id="offer-form-banner-back"
            onClick={onBannerGoBack}
            size="small"
            startIcon={
              <ArrowBackIcon className={classes.backButtonsStartIcon} />
            }
            variant="contained"
          >
            {name}
          </Button>
        </div>
      )}

      {name && !onBannerGoBack && (
        <div className={classes.colorIndicatorContainer}>
          <div className={classes.colorIndicator} />
          <Typography
            className={clsx(classes.whiteText, classes.fontMedium)}
            variant="subtitle1"
          >
            {name}
          </Typography>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    height: '158px',
    position: 'relative',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      height: 'auto',
    },
  },
  containerWithoutName: {
    justifyContent: 'center',
  },
  gradientContainer: {
    zIndex: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(94.24deg, #2F3033 3.49%, rgba(0, 0, 0, 0) 99.42%);',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    zIndex: 1,
  },
  titleContainerText: {
    display: 'flex',
    flexDirection: 'column',
  },
  cancelButtonIcon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
  buttonContainer: { zIndex: 1 },
  backButtonRoot: {
    boxShadow: 'none',
    borderRadius: '5px',
    '&:hover': {
      boxShadow: 'none',
    },
  },
  backButtonLabel: {
    textTransform: 'none',
    fontSize: '14px',
  },
  backButtonsStartIcon: {
    fontSize: '20px',
  },
  cancelButtonRoot: {
    paddingTop: theme.spacing(1),
  },
  whiteText: {
    color: theme.palette.common.white,
  },
  colorIndicatorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    zIndex: 1,
  },
  fontMedium: {
    fontWeight: 500,
  },
  colorIndicator: {
    width: 5,
    height: 28,
    background: theme.palette.primary.main,
    borderRadius: '0px 5px 5px 0px',
  },
}));

export default React.memo(OfferFormBanner);
