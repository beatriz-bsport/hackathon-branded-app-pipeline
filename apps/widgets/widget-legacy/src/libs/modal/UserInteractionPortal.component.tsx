import React from 'react';

import classNames from 'classnames';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, Modal, createStyles, makeStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { MaterialStyleType } from '@bsport/saas-legacy/src/utils/types';
import ApplyCustomCssStyles from '@bsport/saas-legacy/src/libs/widget/components/ApplyCustomCssStyles.component';

import ApplyCustomTheme from '@bsport/saas-legacy/src/libs/exportable-components/ApplyCustomTheme.component';
import {
  DIALOG_MODE_IFRAME,
  DIALOG_MODE_POPUP,
  DIALOG_MODE_TAB,
  DIALOG_MODE_DEACTIVATED,
} from '@bsport/common/lib/master-data/widget-dialog-mode.js';
import WidgetPortalSlidingContainer from '../../components/PortalContainer';
import type { DialogMode } from './types';

interface OwnProps {
  url?: string;
  dialogMode: DialogMode;
  onClose: () => void;
  fullScreenPopup: boolean;
  allowNoPopup?: boolean;
  parentElement: string;
  styles: string;
  customConfiguration: string;
  usePostMessageIframeDimensions?: boolean;
  usePostMessageIfameScrollup?: boolean;
}

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

type UserInteractionModalProps = {
  url: string,
  styles: string,
  customConfiguration: string,
  onClose: () => void,
};

const UserInteractionModal: React.FC<UserInteractionModalProps> = ({
  url,
  styles,
  customConfiguration,
  onClose,
}) => {
  const classes = useModalStyles();

  /* This workaround addresses the issue with the Material-UI (mui) Modal. 
  When the modal is mounted and opened, mui Modal sets the document's overflow to 'hidden.' 
  The problem arises when it fails to reset the overflow on unmount. Instead, it invokes a hook that again sets it to 'hidden.' 
  Consequently, we need to manually set the overflow to 'auto' and use a setTimeout to ensure our setting takes place after mui's, preventing it from being overridden.

  Another alternative found in the mui repository is to use "disableScrollLock". 
  However, this option provides a suboptimal user experience: scrolling on the body is possible when the modal is open, while scrolling inside the modal becomes impossible. */

  React.useEffect(() => {
    return () => {
      setTimeout(() => {
        document.body.style.setProperty('overflow', 'auto');
      }, 200);
    };
  }, []);

  return (
    <Modal
      open={!!url}
      className={classNames(
        classes.container,
        'bsport-user-interaction-modal__container',
      )}
    >
      <>
        <ApplyCustomTheme styles={styles} />
        {!!customConfiguration && (
          <ApplyCustomCssStyles
            customConfiguration={customConfiguration}
            fromWidget
          />
        )}
        <div
          className={classNames(
            classes.innerContainer,
            'bsport-user-interaction-modal__innerContainer',
          )}
        >
          <div
            className={classNames(
              classes.topBar,
              'bsport-user-interaction-modal__topBar',
            )}
          >
            <IconButton
              onClick={onClose}
              className="bsport-user-interaction-modal__closeIcon"
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </div>
          <iframe
            title="bsport-inner-modal"
            className={classNames(
              classes.iframe,
              'bsport-user-interaction-modal__iframe',
            )}
            src={url}
            allow="payment"
          />
        </div>
      </>
    </Modal>
  );
};
class UserInteractionPortal extends React.PureComponent<Props> {
  popupWindow: any = null;

  openPopup = () => {
    const width = window.screen.width * 0.75;
    const height = window.screen.height * 0.75;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const fullScreen = `width=${window.screen.width}, height=${window.screen.height}`;
    const nonFullScreen = `width=${width}, height=${height}, top=${top}, left=${left}`;
    const params = `
      scrollbars=no,
      resizable=no,
      status=no,
      location=no,
      toolbar=no,
      menubar=no,
      ${
        window.screen.width <= 600 ||
        window.screen.height <= 600 ||
        this.props.fullScreenPopup
          ? fullScreen
          : nonFullScreen
      }
    `;

    return window.open(this.props.url, '_blank', params);
  };

  openTab = () => {
    window.open(this.props.url, '_blank');
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.url !== this.props.url && this.props.url) {
      if (this.props.url) {
        switch (this.props.dialogMode) {
          case DIALOG_MODE_POPUP:
            this.openPopup();
            break;
          case DIALOG_MODE_TAB:
            this.openTab();
            break;
          default:
            break;
        }
      }

      if (!this.props.url) {
        this.popupWindow && this.popupWindow.close();
      }
    }
  }

  render() {
    const { classes } = this.props;

    if (!!this.props.url && this.props.dialogMode === DIALOG_MODE_DEACTIVATED) {
      if (this.props.allowNoPopup) {
        return (
          <WidgetPortalSlidingContainer
            isOpen={!!this.props.url}
            parentElement={this.props.parentElement}
            usePostMessageIframeDimensions={
              !!this.props.usePostMessageIframeDimensions
            }
            usePostMessageIfameScrollup={
              !!this.props.usePostMessageIfameScrollup
            }
          >
            <iframe
              title="bsport-inner-modal"
              className={classes.iframe}
              {...(this.props.usePostMessageIframeDimensions
                ? { scrolling: 'no' }
                : {})}
              src={this.props.url}
              allow="payment"
            />
          </WidgetPortalSlidingContainer>
        );
      }
      return (
        <UserInteractionModal
          url={this.props.url}
          styles={this.props.styles}
          customConfiguration={this.props.customConfiguration}
          onClose={this.props.onClose}
        />
      );
    }

    if (!this.props.url || this.props.dialogMode !== DIALOG_MODE_IFRAME)
      return null;

    return (
      <UserInteractionModal
        url={this.props.url}
        styles={this.props.styles}
        customConfiguration={this.props.customConfiguration}
        onClose={this.props.onClose}
      />
    );
  }
}

const styles = () =>
  createStyles({
    iframe: {
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
      display: 'inline-block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      transition: 'opacity .2s ease-in-out',
      borderRadius: 0,
    },
  });

const useModalStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2147483647,
    position: 'fixed',
    width: '100vw',
    minHeight: '100vh -webkit-fill-available',
    /* mobile viewport bug fix */
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,.2)',
    overflow: 'hidden',
  },
  innerContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'white',
    boxShadow: '3px 10px 44px 9px rgba(0,0,0,0.17)',
    borderRadius: 12,
    '@media (min-width: 600px)': {
      maxHeight: (props: any) =>
        props.fullScreenPopup ? window.innerHeight : window.innerHeight * 0.75,
      maxWidth: (props: any) =>
        props.fullScreenPopup ? window.innerWidth : window.innerWidth * 0.75,
    },
  },
  topBar: {
    display: 'flex',
    backgroundColor: 'white',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 12,
  },
  iframe: {
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRadius: 12,

    height: '100%',
    width: '100%',
  },
}));

export default compose<any, OwnProps>(withStyles(styles))(
  UserInteractionPortal,
);
