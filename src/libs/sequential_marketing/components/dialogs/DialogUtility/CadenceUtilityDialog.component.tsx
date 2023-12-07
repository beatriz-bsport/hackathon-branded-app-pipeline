import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/styles/makeStyles';
import green from '@material-ui/core/colors/green';
import useTheme from '@material-ui/core/styles/useTheme';
import type { Theme } from '@material-ui/core/styles';
import type { DialogProps } from '@material-ui/core/Dialog';
import WarningIconRounded from '#components/icons/WarningIconRounded.component';
import WelcomeIcon from '#components/icons/WelcomeIcon.component';

import DialogWithBigIcon from '#components/DialogWithBigIcon';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';

import type { Cadence } from '#libs/sequential_marketing/types';

export enum DialogVariant {
  ACTIVE = 'activate',
  DELETE_STEP = 'delete-step',
  ARCHIVE_WORKFLOW = 'archive-workflow',
  CONVERT_STEP_INTO_EXIT = 'convert-step-into-exit',
  PAUSE_WORKFLOW = 'pause-workflow',
  BLOCK_ARCHIVED_WORKFLOW = 'block-archived-workflow',
  BLOCK_UNACCESSIBLE_WORKFLOW = 'block-unaccessible-workflow',
  WELCOME = 'welcome',
}

type Props = {
  open: boolean;
  onCancel?: () => void;
  onConfirm?: (isCheked?: boolean) => void;
  variant: DialogVariant;
  cadence?: Cadence;
  dialogContainer?: HTMLElement;
  BackdropProps?: DialogProps['BackdropProps'];
  PaperProps?: DialogProps['PaperProps'];
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
    case DialogVariant.ACTIVE:
      return { icon: 'PlayArrow', customIcon: null, color: green[500] };
    case DialogVariant.ARCHIVE_WORKFLOW:
      return {
        icon: null,
        customIcon: WarningIconRounded,
        color: theme.palette.warning.main,
      };
    case DialogVariant.CONVERT_STEP_INTO_EXIT:
    case DialogVariant.DELETE_STEP:
      return {
        icon: null,
        customIcon: WarningIconRounded,
        color: theme.palette.warning.main,
      };
    case DialogVariant.PAUSE_WORKFLOW:
      return {
        icon: 'Pause',
        customIcon: null,
        color: theme.palette.info.main,
      };
    case DialogVariant.WELCOME:
      return {
        icon: null,
        customIcon: WelcomeIcon,
        color: SequentialMarketingColors.WELCOME_COLOR,
      };
    case DialogVariant.BLOCK_ARCHIVED_WORKFLOW:
      return {
        icon: 'Block',
        customIcon: null,
        color: theme.palette.error.main,
      };
    case DialogVariant.BLOCK_UNACCESSIBLE_WORKFLOW:
      return {
        icon: 'HelpOutline',
        customIcon: null,
        color: theme.palette.error.main,
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
  onClose?: () => void,
  onConfirm?: (ignoreFutureWarning?: boolean) => void,
): React.ComponentProps<typeof DialogWithBigIcon>['buttons'] => {
  const { t } = useTranslation('marketing');

  const defaultCancelButtonProps = useMemo(
    () => ({
      title: t('cadence.dialog.cancel'),
      fontColor: 'inherit',
      backgroundColor: 'inherit',
      onClick: onClose,
    }),
    [onClose, t],
  );

  switch (variant) {
    case DialogVariant.ACTIVE:
      return [
        defaultCancelButtonProps,
        {
          title: t('cadence.activate.dialog.confirmButton'),
          fontColor: '',
          backgroundColor: theme.palette.success.main,
          onClick: onConfirm,
        },
      ];
    case DialogVariant.ARCHIVE_WORKFLOW:
      return [
        defaultCancelButtonProps,
        {
          title: t('cadence.archive.dialog.confirmButton'),
          fontColor: '',
          backgroundColor: theme.palette.error.main,
          onClick: onConfirm,
        },
      ];
    case DialogVariant.CONVERT_STEP_INTO_EXIT:
      return [
        defaultCancelButtonProps,
        {
          title: t('cadence.converStepToExit.dialog.confirmButton'),
          fontColor: '',
          backgroundColor: theme.palette.warning.main,
          onClick: onConfirm,
        },
      ];
    case DialogVariant.DELETE_STEP:
      return [
        defaultCancelButtonProps,
        {
          title: t('cadence.deleteStep.dialog.confirmButton'),
          fontColor: '',
          backgroundColor: theme.palette.warning.main,
          onClick: onConfirm,
        },
      ];
    case DialogVariant.PAUSE_WORKFLOW:
      return [
        defaultCancelButtonProps,
        {
          title: t('cadence.pause.dialog.confirmButton'),
          fontColor: '',
          backgroundColor: theme.palette.success.main,
          onClick: onConfirm,
        },
      ];
    case DialogVariant.WELCOME:
      return [
        {
          title: t('cadence.welcome.dialog.return'),
          fontColor: 'inherit',
          backgroundColor: 'inherit',
          onClick: onClose,
        },
        {
          title: t('cadence.welcome.dialog.confirm'),
          fontColor: '',
          backgroundColor: theme.palette.primary.main,
          onClick: onConfirm,
        },
      ];
    case DialogVariant.BLOCK_ARCHIVED_WORKFLOW:
    case DialogVariant.BLOCK_UNACCESSIBLE_WORKFLOW:
      return null;
    default:
      return [
        defaultCancelButtonProps,
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
    case DialogVariant.ACTIVE:
      return {
        title: t('audience.activate.dialog.title'),
        descriptions: [
          [t('audience.activate.dialog.firstHelper')],
          [t('cadence.activate.dialog.secondHelper')],
        ],
      };
    case DialogVariant.ARCHIVE_WORKFLOW:
      return {
        title: t('audience.archive.dialog.title'),
        descriptions: [
          [
            t('audience.archive.dialog.beingArchived', {
              name: cadenceName,
            }),
          ],
          [t('audience.archive.dialog.helper')],
        ],
      };
    case DialogVariant.CONVERT_STEP_INTO_EXIT:
      return {
        title: t('cadence.step.convertExit.dialog.title'),
        descriptions: [[t('cadence.step.convertExit.dialog.helper')]],
      };
    case DialogVariant.DELETE_STEP:
      return {
        title: t('cadence.step.archive.dialog.title'),
        descriptions: [[t('cadence.step.archive.dialog.helper')]],
      };
    case DialogVariant.PAUSE_WORKFLOW:
      return {
        title: t('cadence.pause.dialog.title'),
        descriptions: [[t('cadence.pause.dialog.helper')]],
      };
    case DialogVariant.WELCOME:
      return {
        title: t('cadence.welcome.dialog.title'),
        descriptions: [[t('cadence.welcome.dialog.helper')]],
      };
    case DialogVariant.BLOCK_ARCHIVED_WORKFLOW:
      return {
        title: t('audience.block.archived.dialog.title'),
        descriptions: [[t('audience.block.archived.dialog.helper')]],
      };
    case DialogVariant.BLOCK_UNACCESSIBLE_WORKFLOW:
      return {
        title: t('audience.block.unrecognized.dialog.title'),
        descriptions: [[t('audience.block.unrecognized.dialog.helper')]],
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
    case DialogVariant.ACTIVE:
    case DialogVariant.ARCHIVE_WORKFLOW:
    case DialogVariant.BLOCK_ARCHIVED_WORKFLOW:
    case DialogVariant.BLOCK_UNACCESSIBLE_WORKFLOW:
      return false;

    case DialogVariant.CONVERT_STEP_INTO_EXIT:
    case DialogVariant.DELETE_STEP:
    case DialogVariant.PAUSE_WORKFLOW:
    case DialogVariant.WELCOME:
      return true;

    default:
      return false;
  }
};

const useCadenceUtilitySize = (variant: DialogVariant) => {
  switch (variant) {
    case DialogVariant.WELCOME:
      return 'sm';

    case DialogVariant.ACTIVE:
    case DialogVariant.ARCHIVE_WORKFLOW:
    case DialogVariant.CONVERT_STEP_INTO_EXIT:
    case DialogVariant.DELETE_STEP:
    case DialogVariant.PAUSE_WORKFLOW:
    default:
      return 'xs';
  }
};

export const CadenceUtilityDialog: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
  variant,
  cadence,
  dialogContainer,
  BackdropProps,
  PaperProps,
}) => {
  const classes = useStyles();
  const theme = useTheme?.();
  const { t } = useTranslation('marketing');
  const { icon, customIcon, color } = useCadenceUtilityIcon(variant, theme);
  const displayCheckBox = useCadenceUtilityCheckbox(variant);
  const size = useCadenceUtilitySize(variant);

  const checkBoxLabel = displayCheckBox
    ? t('cadence.dialog.do_not_display_anymore')
    : '';

  const [isChecked, setIsChecked] = React.useState<boolean>(false);

  const handleCheck = React.useCallback(() => {
    setIsChecked((prevIsChecked) => !prevIsChecked);
  }, []);

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

  const handleClose = (ev: React.MouseEvent, reason: string) => {
    reason === 'backdropClick' && onCancel?.();
  };

  return (
    <DialogWithBigIcon
      {...(descriptions?.length > 0 ? { subTexts: descriptions } : {})}
      BackdropProps={BackdropProps}
      buttons={buttons}
      checkBoxLabel={checkBoxLabel}
      customClasses={customClasses}
      CustomIcon={customIcon}
      dialogContainer={dialogContainer}
      handleCheck={handleCheck}
      icon={icon}
      iconColor={color}
      isChecked={isChecked}
      maxWidth={size}
      namespaces="marketing"
      onClose={handleClose}
      open={open}
      PaperProps={PaperProps}
      title={title}
    />
  );
};

const useStyles = makeStyles(() => ({
  button: {
    borderRadius: '4px',
    width: '100%',
  },
}));

export default React.memo(CadenceUtilityDialog);
