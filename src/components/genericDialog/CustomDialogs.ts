import { showGenericDialog } from './GenericDialog';
// @ts-expect-error
import i18n from '../../i18n';

export const showDeleteDialog = async (
  title: string,
  text: string,
  delayBeforeButtonActivation?: number,
) => {
  return showGenericDialog(title, text, [
    {
      label: i18n.t('common.cancel'),
      key: false,
    },
    {
      label: i18n.t('common.delete'),
      key: true,
      color: 'primary',
      delayBeforeActivation: delayBeforeButtonActivation,
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
