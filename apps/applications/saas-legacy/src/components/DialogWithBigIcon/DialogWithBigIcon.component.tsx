import React, { SVGProps } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';
import { QRCodeSVG } from 'qrcode.react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import MUIButton from '@material-ui/core/Button';
import type { ButtonTypeMap } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import type { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

import MuiIconComponent from '#src/components/MuiIcon.component';

export type TranslationProps =
  | string
  | { translationKey: string; options: { [option: string]: string | number } };

type ButtonProps = {
  title?: TranslationProps;
  fontColor?: string;
  backgroundColor?: string;
  onClick?: () => void;
} & ButtonTypeMap['props'];

type SubTextsProps = {
  subText: TranslationProps[];
  index: number;
  customClasses?: { [className: string]: string };
};

const SubText: React.FC<SubTextsProps> = React.memo(
  ({ subText, index, customClasses }) => {
    const { t } = useTranslation();

    const classes = useStyles({});

    if (subText?.length === 1) {
      return (
        <Typography
          className={clsx(classes.subText, customClasses?.subText)}
          variant="body1"
        >
          {typeof subText[0] === 'string'
            ? t(subText[0])
            : t(subText[0].translationKey, {
                ...subText[0].options,
                interpolation: { escapeValue: false },
              })}
        </Typography>
      );
    }

    return (
      <ul className={clsx(classes.subTextList, customClasses?.subTextList)}>
        {subText?.map((line, subIndex) => (
          <li key={`${index}-${subIndex}-${line}`}>
            <Typography
              className={clsx(
                classes.subTextListItem,
                customClasses?.subTextListItem,
              )}
              variant="body1"
            >
              {typeof line === 'string'
                ? t(line)
                : t(line.translationKey, {
                    ...line.options,
                    interpolation: { escapeValue: false },
                  })}
            </Typography>
          </li>
        ))}
      </ul>
    );
  },
);

type ButtonComponentProps = {
  button: ButtonProps;
  customClasses?: { [className: string]: string };
};

const Button: React.FC<ButtonComponentProps> = React.memo(
  ({ button, customClasses }) => {
    const { t } = useTranslation();

    const classes = useStyles({});

    const {
      title: buttonTitle,
      fontColor,
      backgroundColor,
      ...buttonProps
    } = button;

    return (
      <MUIButton
        {...buttonProps}
        className={clsx(classes.button, customClasses?.button)}
        style={{
          color: fontColor,
          backgroundColor:
            buttonProps?.variant === 'text' ? 'transparent' : backgroundColor,
        }}
      >
        {typeof buttonTitle === 'string'
          ? t(buttonTitle)
          : t(buttonTitle.translationKey, {
              ...buttonTitle.options,
              interpolation: { escapeValue: false },
            })}
      </MUIButton>
    );
  },
);

type BottomActionsProps = {
  buttons?: ButtonProps[];
  checkBoxLabel?: string;
  customClasses?: { [className: string]: string };
  isChecked?: boolean;
  handleCheck?: () => void;
};

const BottomActions: React.FC<BottomActionsProps> = React.memo(
  ({ buttons, checkBoxLabel, customClasses, isChecked, handleCheck }) => {
    const classes = useStyles({});

    const displayCheckBox = !!checkBoxLabel && !!handleCheck;

    return (
      <>
        {displayCheckBox && (
          <div className={classes.checkboxContainer}>
            <div className={classes.checkbox}>
              <Checkbox checked={isChecked} edge="end" onClick={handleCheck} />
            </div>
            <Typography align="center" variant="body1">
              {checkBoxLabel}
            </Typography>
          </div>
        )}

        {!!buttons?.length && (
          <DialogActions
            className={clsx(
              classes.dialogActions,
              customClasses?.dialogActions,
            )}
          >
            {buttons?.map((button, index) => (
              <Button
                key={index}
                button={button}
                customClasses={customClasses}
              />
            ))}
          </DialogActions>
        )}
      </>
    );
  },
);

type Props = {
  open: boolean;
  maxWidth?: Breakpoint | false;
  CustomIcon?: React.FC<SVGProps<SVGElement>>;
  customIconHeight?: number | string;
  customIconWidth?: number | string;
  customIconFillOpacity?: number;
  icon?: string;
  iconColor?: string;
  withoutBackground?: boolean;
  withCross?: boolean;
  title?: TranslationProps; // this must be a translation key
  subTexts?: TranslationProps[][]; // these must be translation keys
  namespaces?: string | string[];
  onClose?: (ev?: React.MouseEvent, reason?: string) => void;
  dialogContainer?: HTMLElement;
  BackdropProps?: DialogProps['BackdropProps'];
  PaperProps?: DialogProps['PaperProps'];
  QrCodeProps?: { value: string; title?: string };
} & BottomActionsProps;

const DialogWithBigIcon: React.FC<Props> = ({
  open,
  buttons,
  checkBoxLabel,
  customClasses,
  CustomIcon,
  customIconFillOpacity,
  customIconHeight,
  customIconWidth,
  icon,
  iconColor,
  isChecked,
  maxWidth,
  namespaces,
  subTexts,
  title,
  withCross,
  withoutBackground,
  onClose,
  handleCheck,
  dialogContainer,
  BackdropProps,
  PaperProps,
  QrCodeProps,
}) => {
  const { t } = useTranslation(namespaces);

  const classes = useStyles({ iconColor, withoutBackground });

  return (
    <Dialog
      BackdropProps={{
        ...BackdropProps,
        className: clsx(BackdropProps?.className, customClasses?.backdrop),
      }}
      classes={{
        root: customClasses?.root,
      }}
      className={customClasses?.dialog}
      container={dialogContainer}
      maxWidth={maxWidth ?? 'xs'}
      onClose={onClose}
      open={open}
      PaperProps={{
        ...PaperProps,
        className: clsx(
          classes.dialogPaper,
          PaperProps?.className,
          customClasses?.dialogPaper,
        ),
      }}
      style={{ position: 'absolute' }}
    >
      {withCross && (
        <DialogTitle
          className={clsx(classes.dialogTitle, customClasses?.dialogTitle)}
        >
          <IconButton
            className={clsx(classes.closeButton, customClasses?.closeButton)}
            onClick={onClose}
          >
            <CloseIcon
              className={clsx(classes.closeIcon, customClasses?.closeIcon)}
            />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent
        className={clsx(classes.dialogContent, customClasses?.dialogContent)}
      >
        <div
          className={clsx(
            classes.largeIconContainer,
            customClasses?.largeIconContainer,
          )}
        >
          {CustomIcon ? (
            <CustomIcon
              fill={iconColor}
              fillOpacity={customIconFillOpacity}
              height={customIconHeight}
              width={customIconWidth}
            />
          ) : (
            <MuiIconComponent
              className={clsx(classes.largeIcon, customClasses?.largeIcon)}
              defaultIcon="CheckCircle"
              icon={icon}
            />
          )}
        </div>

        {title && (
          <Typography
            className={clsx(classes.title, customClasses?.title)}
            variant="h6"
          >
            {typeof title === 'string'
              ? t(title)
              : t(title.translationKey, {
                  ...title.options,
                  interpolation: { escapeValue: false },
                })}
          </Typography>
        )}

        {subTexts?.map((subText, index) => (
          <SubText
            key={`${index}-${subText}`}
            customClasses={customClasses}
            index={index}
            subText={subText}
          />
        ))}
      </DialogContent>

      {QrCodeProps && (
        <>
          <Divider className={classes.qrDivider} />
          <div className={classes.qrSection}>
            {QrCodeProps?.value ? (
              <>
                {QrCodeProps.title && (
                  <Typography className={classes.qrTitle} variant="subtitle1">
                    {t(QrCodeProps.title)}
                  </Typography>
                )}
                <QRCodeSVG size={180} value={QrCodeProps.value} />
              </>
            ) : (
              <CircularProgress />
            )}
          </div>
        </>
      )}

      <BottomActions
        buttons={buttons}
        checkBoxLabel={checkBoxLabel}
        customClasses={customClasses}
        handleCheck={handleCheck}
        isChecked={isChecked}
      />
    </Dialog>
  );
};

const useStyles = makeStyles<
  Theme,
  { iconColor?: string; withoutBackground?: boolean }
>((theme) => ({
  dialogPaper: {
    padding: theme.spacing(2),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    gap: theme.spacing(4),
    width: '100%',
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'end',
    padding: 0,
  },
  closeButton: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  closeIcon: {
    height: 36,
    width: 36,
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
    padding: 0,
  },
  largeIconContainer: ({ iconColor, withoutBackground }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    ...(!withoutBackground
      ? {
          backgroundColor: chroma(iconColor ?? theme.palette.primary.main)
            .alpha(0.09)
            .hex(),
        }
      : {}),
    width: '110px',
    height: '110px',
  }),
  largeIcon: ({ iconColor }) => ({
    fontSize: '72px',
    color: iconColor ?? theme.palette.primary.main,
  }),
  title: {
    textAlign: 'center',
  },
  subTextList: {
    '& > li': {
      listStyleType: 'none',
    },
  },
  subText: {
    textAlign: 'center',
  },
  subTextListItem: {},
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    width: '42px',
  },
  dialogActions: {
    justifyContent: 'center',
    gap: theme.spacing(2),
  },
  button: {
    borderRadius: theme.spacing(1.5),
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    color: 'white',
  },
  inlineBottom: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'space-between',
  },
  qrDivider: {
    width: '100%',
    margin: theme.spacing(2, 0),
  },
  qrSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
  },
  qrTitle: {
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
}));

export default React.memo(DialogWithBigIcon);
