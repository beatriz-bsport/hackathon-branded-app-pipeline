import React from 'react';

import { withStyles, createStyles } from '@material-ui/core';
import { compose } from 'recompose';
import { MaterialStyleType } from '@bsport/saas-legacy/src/utils/types';
import {
  DIALOG_MODE_POPUP,
  DIALOG_MODE_TAB,
} from '@bsport/common/lib/master-data/widget-dialog-mode.js';
import { shouldDisplayInPageInteractionPortal } from '../../libs/modal/helpers';
import type { DialogMode } from '../../libs/modal/types';
import UserInteractionModal from './modal-interaction-portal.component';
import InPageInteractionPortal from './in-page-interaction-portal.component';

interface OwnProps {
  url?: string;
  dialogMode: DialogMode;
  onClose: () => void;
  fullScreenPopup: boolean;
  allowNoPopup?: boolean;
  parentElementId: string;
  styles: string;
  customConfiguration: string;
  usePostMessageIframeDimensions?: boolean;
  usePostMessageIfameScrollup?: boolean;
}

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

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
    return window.open(this.props.url, '_blank');
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.url !== this.props.url && this.props.url) {
      switch (this.props.dialogMode) {
        case DIALOG_MODE_POPUP:
          this.popupWindow = this.openPopup();
        case DIALOG_MODE_TAB:
          this.popupWindow = this.openTab();
      }
    }

    if (!this.props.url && this.popupWindow) {
      this.popupWindow.close();
    }
  }

  render() {
    if (
      !this.props.url ||
      [DIALOG_MODE_POPUP, DIALOG_MODE_TAB].includes(this.props.dialogMode)
    )
      return null;

    if (
      shouldDisplayInPageInteractionPortal(
        this.props.dialogMode,
        this.props.allowNoPopup,
        this.props.url,
      )
    ) {
      return <InPageInteractionPortal url={this.props.url} />;
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

export default compose<any, OwnProps>(withStyles(styles))(
  UserInteractionPortal,
);
