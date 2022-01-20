import ExportableVODSettings from './ExportableVODSettings.form';
import ExportablePassSettings from './ExportablePassSettings.form';
import ExportableCalendarSettings from './ExportableCalendarSettings.form';
import ExportablePlaylistSettings from './ExportablePlaylistSettings.form';
import ExportablePrivateServiceSettings from './ExportablePrivateServiceSettings.form';
import ExportableWorkshopSettings from './ExportableWorkshopSettings.form';
import ExportableGiftcardSettings from './ExportableGiftcardSettings.form';
import ExportablePaymentPackTemplateSettings from './ExportablePaymentPackTemplateSettings.form';

import {
  EXPORTABLE_COMPONENT_TYPE_PLAYLIST,
  EXPORTABLE_COMPONENT_TYPE_VOD,
  EXPORTABLE_COMPONENT_TYPE_PASS,
  EXPORTABLE_COMPONENT_TYPE_CALENDAR,
  EXPORTABLE_COMPONENT_TYPE_WORKSHOP,
  EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE,
  EXPORTABLE_COMPONENT_TYPE_GIFTCARD,
  EXPORTABLE_COMPONENT_TYPE_PAYMENT_PACK_TEMPLATE,
} from '../../constants';

export const EXPORTABLE_COMPONENT_SETTINGS_BY_TYPE = {
  [EXPORTABLE_COMPONENT_TYPE_VOD]: ExportableVODSettings,
  [EXPORTABLE_COMPONENT_TYPE_CALENDAR]: ExportableCalendarSettings,
  [EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE]: ExportablePrivateServiceSettings,
  [EXPORTABLE_COMPONENT_TYPE_PASS]: ExportablePassSettings,
  [EXPORTABLE_COMPONENT_TYPE_PLAYLIST]: ExportablePlaylistSettings,
  [EXPORTABLE_COMPONENT_TYPE_WORKSHOP]: ExportableWorkshopSettings,
  [EXPORTABLE_COMPONENT_TYPE_GIFTCARD]: ExportableGiftcardSettings,
  [EXPORTABLE_COMPONENT_TYPE_PAYMENT_PACK_TEMPLATE]:
    ExportablePaymentPackTemplateSettings,
};

export default EXPORTABLE_COMPONENT_SETTINGS_BY_TYPE;
