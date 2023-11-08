import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/styles/makeStyles';
import green from '@material-ui/core/colors/green';
import { useTheme, type Theme } from '@material-ui/core/styles';

import WarningIconRounded from '#components/icons/WarningIconRounded.component';

import DialogWithBigIcon from '#components/DialogWithBigIcon';
import type { Cadence } from '#libs/sequential_marketing/types';

export type DialogVariant =
  | 'active'
  | 'delete-step'
  | 'archive-workflow'
  | 'convert-step-into-exit'
  | 'pause-workflow';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: (isCheked?: boolean) => void;
  variant: DialogVariant;
  cadence?: Cadence;
};

const useCadenceUtilityIcon = (
  variant: DialogVariant,
  theme: Theme,
): {
  icon: string | null;
  customIcon: React.FC<React.SVGProps<SVGElement>> | null;
  color: string;
} => {
  switch (variant) {
    case 'active':
      return { icon: 'PlayArrow', customIcon: null, color: green[500] };
    case 'archive-workflow':
      return {
        icon: 'Delete',
        customIcon: null,
        color: theme.palette.error.main,
      };
    case 'convert-step-into-exit':
    case 'delete-step':
      return {
        icon: null,
        customIcon: WarningIconRounded,
        color: theme.palette.warning.main,
      };
    case 'pause-workflow':
      return {
        icon: 'Pause',
        customIcon: null,
        color: theme.palette.info.main,
      };
    default:
      return {
        icon: 'Error',
        customIcon: null,
        color: theme.palette.error.main,
      };
  }
};

const useCadenceUtilityButtons = (
  variant: DialogVariant,
  theme: Theme,
  onClose: () => void,
  onConfirm: (ignoreFutureWarning?: boolean) => void,
): React.ComponentProps<typeof DialogWithBigIcon>['buttons'] => {
  const { t } = useTranslation('marketing');

  const classicCancelButton = useMemo(
    () => ({
      title: t('cadence.dialog.cancel'),
      fontColor: 'inherit',
      backgroundColor: 'inherit',
      onClick: onClose,
    }),
    [onClose, t],
  );

  switch (variant) {
    case 'active':
      return [
        classicCancelButton,
        {
          title: t('cadence.activate.button'),
          fontColor: '',
          backgroundColor: '',
          onClick: onConfirm,
        },
      ];
    case 'archive-workflow':
      return [
        classicCancelButton,
        {
          title: t('cadence.dialog.confirm'),
          fontColor: '',
          backgroundColor: '',
          onClick: onConfirm,
        },
      ];
    case 'convert-step-into-exit':
    case 'delete-step':
      return [
        classicCancelButton,
        {
          title: t('cadence.dialog.confirm'),
          fontColor: '',
          backgroundColor: theme.palette.warning.main,
          onClick: onConfirm,
        },
      ];
    case 'pause-workflow':
      return [
        classicCancelButton,
        {
          title: t('cadence.dialog.confirm'),
          fontColor: '',
          backgroundColor: '',
          onClick: onConfirm,
        },
      ];
    default:
      return [
        classicCancelButton,
        {
          title: t('cadence.dialog.confirm'),
          fontColor: '',
          backgroundColor: '',
          onClick: onConfirm,
        },
      ];
  }
};

const useCadenceUtilityTexts = (
  variant: DialogVariant,
  cadenceName: string,
): {
  title: string;
  descriptions: React.ComponentProps<typeof DialogWithBigIcon>['subTexts'];
} => {
  const { t } = useTranslation('marketing');
  switch (variant) {
    case 'active':
      return {
        title: t('cadence.activate.dialog.title'),
        descriptions: [
          [t('cadence.activate.dialog.firstHelper')],
          [t('cadence.activate.dialog.secondHelper')],
        ],
      };
    case 'archive-workflow':
      return {
        title: t('cadence.archive.dialog.title'),
        descriptions: [
          [t('cadence.archive.dialog.beingArchived', { name: cadenceName })],
          [t('cadence.archive.dialog.helper', { name: cadenceName })],
        ],
      };
    case 'convert-step-into-exit':
      return {
        title: t('cadence.step.convertExit.dialog.title'),
        descriptions: [[t('cadence.step.convertExit.dialog.helper')]],
      };
    case 'delete-step':
      return {
        title: t('cadence.step.archive.dialog.title'),
        descriptions: [[t('cadence.step.archive.dialog.helper')]],
      };

    case 'pause-workflow':
      return {
        title: t('cadence.pause.dialog.title'),
        descriptions: [[t('cadence.pause.dialog.helper')]],
      };

    default:
      return {
        title: '',
        descriptions: [] as string[][],
      };
  }
};

const useCadenceUtilityCheckbox = (variant: DialogVariant) => {
  switch (variant) {
    case 'active':
    case 'archive-workflow':
      return { displayCheckBox: false };

    case 'convert-step-into-exit':
    case 'delete-step':
    case 'pause-workflow':
      return { displayCheckBox: true };

    default:
      return { displayCheckBox: false };
  }
};

export const CadenceUtilityDialog: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
  variant,
  cadence,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const { icon, customIcon, color } = useCadenceUtilityIcon(variant, theme);
  const displayCheckBox = useCadenceUtilityCheckbox(variant);

  const [isChecked, setIsChecked] = React.useState<boolean>(false);

  const handleCheck = React.useCallback(
    () => setIsChecked(!isChecked),
    [isChecked],
  );

  const handleOnConfirm = React.useCallback(
    () => onConfirm(isChecked),
    [isChecked, onConfirm],
  );

  const buttons = useCadenceUtilityButtons(
    variant,
    theme,
    onCancel,
    handleOnConfirm,
  );

  const { title, descriptions } = useCadenceUtilityTexts(
    variant,
    cadence?.name ?? '',
  );

  const customClasses = { button: classes.button };

  return (
    <DialogWithBigIcon
      buttons={buttons}
      CustomIcon={customIcon}
      icon={icon}
      iconColor={color}
      maxWidth="xs"
      namespaces="marketing"
      open={open}
      {...(descriptions?.length > 0 ? { subTexts: descriptions } : {})}
      customClasses={customClasses}
      displayCheckBox={displayCheckBox.displayCheckBox}
      handleCheck={handleCheck}
      isChecked={isChecked}
      title={title}
    />
  );
};

const useStyles = makeStyles(() => ({
  button: {
    borderRadius: '4px',
  },
}));

export default React.memo(CadenceUtilityDialog);
