import { showGenericDialog } from './GenericDialog';
// @ts-expect-error
import i18n from '../../i18n';

export enum DialogActionEnum {
  DELETE = 'DELETE',
  CONFIRM = 'CONFIRM',
}

export const showActionDialog = async (
  title: string,
  text: string,
  dialogType: DialogActionEnum,
  delayBeforeButtonActivation?: number,
) => {
  const getActionButtonLabel = () => {
    switch (dialogType) {
      case DialogActionEnum.CONFIRM:
        return i18n.t('common.confirm');
      case DialogActionEnum.DELETE:
        return i18n.t('common.delete');
      default:
        return i18n.t('common.close');
    }
  };

  const getActionButtonVariant = () => {
    switch (dialogType) {
      case DialogActionEnum.CONFIRM:
        return 'contained';
      default:
        return 'text';
    }
  };

  return showGenericDialog(title, text, [
    {
      label: i18n.t('common.cancel'),
      key: false,
    },
    {
      label: getActionButtonLabel(),
      key: true,
      color: 'primary',
      delayBeforeActivation: delayBeforeButtonActivation,
      variant: getActionButtonVariant(),
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
