import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { WithStyles } from '@material-ui/styles/withStyles';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import clx from 'classnames';
import { Video } from '#libs/video/types';

type OwnProps = {
  url: string;
  video: Video;
};

type Props = OwnProps & WithTranslation & WithStyles<typeof styles>;

export const EbookDownload = (props: Props) => {
  const { classes, t } = props;
  return (
    <div className={classes.ebook}>
      <div
        className={classes.image}
        style={{ backgroundImage: `url(${props.video.cover_main})` }}
      >
        <Hidden xsDown>
          <div className={clx([classes.container, classes.containerLarge])}>
            <MenuBookIcon className={clx([classes.icon, classes.iconLarge])} />
            <Typography className={classes.helper}>
              {t('video.ebook.downloadHelper', { button: t('video.download') })}
            </Typography>
            <Button
              className={classes.buttonLarge}
              variant="contained"
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={() => window.open(props.url)}
            >
              {t('video.download')}
            </Button>
          </div>
          <div className={clx([classes.overlay, classes.overlayLarge])} />
        </Hidden>
        <Hidden smUp>
          <div className={clx([classes.container, classes.containerSmall])}>
            <MenuBookIcon className={clx([classes.icon, classes.iconSmall])} />
            <Button
              className={classes.buttonSmall}
              variant="contained"
              color="primary"
              onClick={() => window.open(props.url)}
            >
              <CloudDownloadIcon />
            </Button>
          </div>
          <div className={clx([classes.overlay, classes.overlaySmall])} />
        </Hidden>
      </div>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    ebook: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      borderRadius: theme.spacing(0.5),
      paddingBottom: '55%',
      maxWidth: '100%',
    },
    image: {
      backgroundSize: 'cover',
      position: 'absolute',
      zIndex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-around',
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
    },
    container: {
      zIndex: 3,
      width: '90%',
      alignItems: 'center',
      justifyContent: 'space-around',
      display: 'flex',
    },
    containerLarge: {
      flexDirection: 'row',
    },
    containerSmall: {
      position: 'absolute',
      top: 0,
      flexDirection: 'column',
      height: '100%',
    },
    icon: {
      color: theme.palette.primary.main,
    },
    iconLarge: {
      marginBottom: '-40%',
      fontSize: '500%',
    },
    iconSmall: {
      fontSize: '400%',
    },
    helper: {
      maxWidth: '45%',
      marginBottom: '-40%',
      color: 'white',
      marginLeft: '2%',
    },
    buttonLarge: {
      marginBottom: '-40%',
      height: '10%',
    },
    buttonSmall: {
      height: '30px',
      width: '7%',
    },
    overlay: {
      position: 'absolute',
      zIndex: 2,
      left: 0,
      right: 0,
      opacity: 0.4,
      backgroundColor: 'black',
    },
    overlayLarge: {
      top: '65%',
      bottom: '65%',
      height: '35%',
    },
    overlaySmall: {
      top: 0,
      bottom: 0,
      height: '100%',
    },
  });

export default compose<any, OwnProps>(
  withTranslation(['video']),
  withStyles(styles),
)(EbookDownload);
