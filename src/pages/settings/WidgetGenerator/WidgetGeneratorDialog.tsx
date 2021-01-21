import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import WidgetGeneratorPage from './WidgetGenerator.page';
import {
  MarketplaceComponentsEnum,
  MarketplaceTabConfig,
  WidgetComponentsEnum,
} from '../../../libs/marketplace/types';

type Ownprops = {
  open: boolean;
  onClose: () => void;
  componentType: MarketplaceComponentsEnum | WidgetComponentsEnum;
  config: MarketplaceTabConfig['config'];
};

type Props = Ownprops & WithTranslation;
class WidgetGeneratorDialog extends React.PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <Dialog
        aria-labelledby="simple-dialog-title"
        open={this.props.open}
        onClose={this.props.onClose}
        keepMounted
      >
        <DialogTitle id="simple-dialog-title">
          {t('widget:widget.dialogTitle')}
        </DialogTitle>
        <DialogContent>
          <WidgetGeneratorPage
            defaultValue={{
              componentType: this.props.componentType,
              config: this.props.config,
            }}
            hideTypeSelector
            hidePreview
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={this.props.onClose} color="secondary">
            {t('widget:widget.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default compose<any, Ownprops>(withTranslation())(WidgetGeneratorDialog);
