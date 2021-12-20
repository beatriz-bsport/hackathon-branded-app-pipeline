import { showGenericDialog } from './GenericDialog';
import i18n from '../../i18n';

export const showDeleteDialog = async (title: string, text: string) => {
  return showGenericDialog(title, text, [
    {
      label: i18n.t('common.cancel'),
      key: false,
    },
    {
      label: i18n.t('common.confirm'),
      key: true,
      color: 'primary',
    },
  ]);
};

export const showInformativeDialog = async (title: string, text: string) => {
  return showGenericDialog(title, text, [
    {
      label: i18n.t('common:close'),
      key: false,
      color: 'primary',
    },
  ]);
};
