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
import { openTab } from '../utils/utils';

interface OwnProps {
  url?: string;
  dialogMode: 0 | 1 | 2;
  onClose: () => void;
  isBasket: boolean;
}

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

class Dialog extends React.PureComponent<Props> {
  popupWindow: any = null;

  componentDidUpdate(prevProps: Props) {
    if (prevProps.url !== this.props.url) {
      if (this.props.url) {
        if (this.props.dialogMode === DIALOG_MODE_POPUP) {
          this.popupWindow = openTab(this.props.url);
        } else if (this.props.dialogMode === DIALOG_MODE_TAB) {
          window.open(this.props.url, '_blank');
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
        <div
          className={`${classes.innerContainer} ${
            this.props.isBasket ? classes.innerContainerBasket : ''
          }`}
        >
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
    maxHeight: 720,
    maxWidth: 768,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  innerContainerBasket: {
    maxHeight: 500,
    maxWidth: 600,
  },
  topBar: {
    display: 'flex',
    backgroundColor: 'white',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iframe: {
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,

    height: '100%',
    width: '100%',
  },
});

export default compose<any, OwnProps>(withStyles(styles))(Dialog);
