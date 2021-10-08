import React from 'react';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core';

import { compose } from 'recompose';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';

import {
  DIALOG_MODE_IFRAME,
  DIALOG_MODE_POPUP,
  DIALOG_MODE_TAB,
} from '@bsport/common/lib/master-data/widget-dialog-mode';

interface OwnProps {
  url?: string;
  dialogMode: 0 | 1 | 2;
  onClose: () => void;
  isBasket: boolean;
}

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

class UserInteractionPortal extends React.PureComponent<Props> {
  popupWindow: any = null;

  openPopup = () => {
    const width = window.screen.width * 0.75;
    const height = window.screen.height * 0.65;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const windowParams = `width=${width}, height=${height}, top=${top}, left=${left}`;
    const params = `
      scrollbars=no,
      resizable=no,
      status=no,
      location=no,
      toolbar=no,
      menubar=no,
      ${
        window.screen.width <= 600 || window.screen.height <= 600
          ? ''
          : windowParams
      }
    `;

    return window.open(this.props.url, '_blank', params);
  };

  openTab = () => {
    window.open(this.props.url, '_blank');
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.url !== this.props.url) {
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
    if (!this.props.url || this.props.dialogMode !== DIALOG_MODE_IFRAME)
      return null;

    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div className={classes.topBar}>
            <IconButton onClick={this.props.onClose}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </div>
          <iframe
            title="bsport-inner-modal"
            className={classes.iframe}
            src={this.props.url}
          />
        </div>
      </div>
    );
  }
}

const styles = () => ({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2147483647,
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,.2)',
  },
  innerContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    maxHeight: window.innerHeight * 0.65,
    maxWidth: window.innerWidth * 0.75,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: '3px 10px 44px 9px rgba(0,0,0,0.17)',
    borderRadius: 12,
    '@media (max-width: 600px), (max-height: 600px)': {
      maxHeight: window.screen.height,
      maxWidth: window.screen.width,
    },
  },
  topBar: {
    display: 'flex',
    backgroundColor: 'white',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 12,
    '@media (max-width: 600px), (max-height: 600px)': {
      maxHeight: 25,
    },
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
});

export default compose<any, OwnProps>(withStyles(styles))(
  UserInteractionPortal,
);
