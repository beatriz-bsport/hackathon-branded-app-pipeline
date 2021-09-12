import {
  EXPORTABLE_COMPONENT_TYPE_CALENDAR,
  EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE,
} from 'bsport-saas/src/libs/exportable-components/constants';
import { WIDGET_SUPPORTED_EXPORTABLE_COMPONENTS } from 'bsport-saas/src/libs/widget/constants';
import { DIALOG_MODE_TAB } from '@bsport/common/lib/master-data/widget-dialog-mode';

export const migrateOldProps = (props: any) => {
  const _props = { ...props };

  /**
   * Migrate old calendar config to new config
   */
  if (
    _props.widgetType === EXPORTABLE_COMPONENT_TYPE_CALENDAR &&
    !('config' in _props)
  ) {
    _props.config = {
      calendar: {
        ..._props.defaultFilters,
        compactMode: _props.compactMode,
      },
    };
  }

  /**
   * Migrate to private service groups
   */
  if (_props.widgetType === EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE) {
    if (!_props.config.privateService) {
      _props.config.privateService = {};
    }

    let privateServiceType = _props.config.privateService.type;

    if (!privateServiceType) {
      if (typeof _props.config.privateService.serviceId === 'number') {
        privateServiceType = 'detail';
      } else {
        privateServiceType = 'list';
      }
    }

    _props.config.privateService.type = privateServiceType;
  }

  /**
   * Use a default config when the current config is wrong
   */
  if (!WIDGET_SUPPORTED_EXPORTABLE_COMPONENTS.includes(_props.widgetType)) {
    _props.widgetType = EXPORTABLE_COMPONENT_TYPE_CALENDAR;
  }

  if (_props.dialogMode === undefined) {
    _props.dialogMode = DIALOG_MODE_TAB;
  }

  return _props;
};
