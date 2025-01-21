import ExportableVODSettings from './ExportableVODSettings.form';
import ExportablePassSettings from './ExportablePassSettings.form';
import ExportableCalendarSettings from './ExportableCalendarV2Settings.form';
import ExportablePlaylistSettings from './ExportablePlaylistSettings.form';
import ExportablePrivateServiceSettings from './ExportablePrivateServiceSettings.form';
import ExportableWorkshopSettings from './ExportableWorkshopSettings.form';
import ExportableGiftcardSettings from './ExportableGiftcardSettings.form';
import ExportablePaymentPackTemplateSettings from './ExportablePaymentPackTemplateSettings.form';
import ExportableNewsletterV2Settings from './ExportableNewsletterV2Settings.form';
import ExportableConsumerSpaceSettingsForm from './ExportableConsumerSpaceSettings.form';
import ExportableLoginButtonSettingsForm from './ExportableLoginButtonSettings.form';

import {
  EXPORTABLE_COMPONENT_TYPE_PLAYLIST,
  EXPORTABLE_COMPONENT_TYPE_VOD,
  EXPORTABLE_COMPONENT_TYPE_PASS,
  EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2,
  EXPORTABLE_COMPONENT_TYPE_WORKSHOP,
  EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE,
  EXPORTABLE_COMPONENT_TYPE_GIFTCARD,
  EXPORTABLE_COMPONENT_TYPE_PAYMENT_PACK_TEMPLATE,
  EXPORTABLE_COMPONENT_TYPE_CALENDAR,
  EXPORTABLE_COMPONENT_TYPE_NEWSLETTER_V2,
  EXPORTABLE_COMPONENT_TYPE_CONSUMER_SPACE,
  EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON,
} from '../../constants';

const EXPORTABLE_COMPONENT_SETTINGS_BY_TYPE = {
  [EXPORTABLE_COMPONENT_TYPE_VOD]: ExportableVODSettings,
  [EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2]: ExportableCalendarSettings,
  [EXPORTABLE_COMPONENT_TYPE_CALENDAR]: ExportableCalendarSettings,
  [EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE]: ExportablePrivateServiceSettings,
  [EXPORTABLE_COMPONENT_TYPE_PASS]: ExportablePassSettings,
  [EXPORTABLE_COMPONENT_TYPE_PLAYLIST]: ExportablePlaylistSettings,
  [EXPORTABLE_COMPONENT_TYPE_WORKSHOP]: ExportableWorkshopSettings,
  [EXPORTABLE_COMPONENT_TYPE_GIFTCARD]: ExportableGiftcardSettings,
  [EXPORTABLE_COMPONENT_TYPE_PAYMENT_PACK_TEMPLATE]:
    ExportablePaymentPackTemplateSettings,
  [EXPORTABLE_COMPONENT_TYPE_NEWSLETTER_V2]: ExportableNewsletterV2Settings,
  [EXPORTABLE_COMPONENT_TYPE_CONSUMER_SPACE]:
    ExportableConsumerSpaceSettingsForm,
  [EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON]: ExportableLoginButtonSettingsForm,
};

export default EXPORTABLE_COMPONENT_SETTINGS_BY_TYPE;
