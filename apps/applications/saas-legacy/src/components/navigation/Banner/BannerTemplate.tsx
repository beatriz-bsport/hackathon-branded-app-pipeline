import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Slide from '@material-ui/core/Slide';

import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

enum BannerMode {
  NETWORK_ERROR = 'networkError',
  SERVER_ERROR = 'serverError',
  NETWORK_RESTORED = 'networkRestored',
  BACKEND_RESTORED = 'backendRestored',
  NONE = 'none',
}

type BannerTemplateProps = {
  isOpened: boolean;
  bannerMode: BannerMode;
  onClick?: () => void;
};

type BannerConfig = {
  style: string;
  textKey: string;
};

type Props = { isOpened: boolean };

const BannerTemplate: React.FC<BannerTemplateProps> = ({
  isOpened,
  bannerMode,
  onClick,
}) => {
  const { t } = useTranslation('titles');
  const classes = useStyles();

  const defaultOnClick = () => window.location.reload();

  const bannerConfigs = useMemo<
    Record<Exclude<BannerMode, BannerMode.NONE>, BannerConfig>
  >(() => {
    return {
      [BannerMode.NETWORK_ERROR]: {
        style: classes.errorBanner,
        textKey: 'banner.networkError',
      },
      [BannerMode.SERVER_ERROR]: {
        style: classes.errorBanner,
        textKey: 'banner.serverError',
      },
      [BannerMode.NETWORK_RESTORED]: {
        style: classes.restoredBanner,
        textKey: 'banner.networkConnectionRestored',
      },
      [BannerMode.BACKEND_RESTORED]: {
        style: classes.restoredBanner,
        textKey: 'banner.serverConnectionRestored',
      },
    };
  }, [classes]);

  const bannerConfig = useMemo(
    () => (bannerMode !== BannerMode.NONE ? bannerConfigs[bannerMode] : null),
    [bannerConfigs, bannerMode],
  );

  if (bannerConfig === null) {
    return null;
  }

  return (
    <Slide in={isOpened}>
      <ButtonBase
        className={clsx(classes.banner, bannerConfig.style)}
        onClick={onClick ?? defaultOnClick}
      >
        <div className={classes.text}>{t(bannerConfig.textKey)}</div>
      </ButtonBase>
    </Slide>
  );
};
export default React.memo(BannerTemplate);

export const ServerErrorBanner: React.FC<Props> = React.memo(({ isOpened }) => {
  return (
    <BannerTemplate bannerMode={BannerMode.SERVER_ERROR} isOpened={isOpened} />
  );
});

export const NetworkErrorBanner: React.FC<Props> = React.memo(
  ({ isOpened }) => {
    return (
      <BannerTemplate
        bannerMode={BannerMode.NETWORK_ERROR}
        isOpened={isOpened}
      />
    );
  },
);

export const NetworkRestoredBanner: React.FC<Props> = React.memo(
  ({ isOpened }) => {
    return (
      <BannerTemplate
        bannerMode={BannerMode.NETWORK_RESTORED}
        isOpened={isOpened}
      />
    );
  },
);

export const BackendRestoredBanner: React.FC<Props> = React.memo(
  ({ isOpened }) => {
    return (
      <BannerTemplate
        bannerMode={BannerMode.BACKEND_RESTORED}
        isOpened={isOpened}
      />
    );
  },
);

const useStyles = makeStyles((theme) => ({
  banner: {
    display: 'flex',
    top: 0,
    padding: theme.spacing(0.5),
    width: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBanner: {
    backgroundColor: theme.palette.grey[800],
  },
  restoredBanner: {
    backgroundColor: theme.palette.primary.main,
  },
  text: {
    color: theme.palette.common.white,
    fontSize: 14,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
  },
}));
