import { Button, DialogActions, DialogContent } from '@material-ui/core';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import WidgetGeneratorPage from '../../../pages/settings/WidgetGenerator.page';

type Ownprops = {
  open: boolean;
  onClose: () => void;
  componentType: string;
  config: any;
};

type Props = Ownprops & WithTranslation;
class WidgetGeneratorDialog extends React.PureComponent<Props> {
  render() {
    const { t } = this.props;

    return (
      <GenericResponsiveDrawer
        open={this.props.open}
        onClose={this.props.onClose}
        title={t('widget:widget.dialogTitle')}
        width="85%"
      >
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
      </GenericResponsiveDrawer>
    );
  }
}

export default compose<any, Ownprops>(withTranslation())(WidgetGeneratorDialog);
