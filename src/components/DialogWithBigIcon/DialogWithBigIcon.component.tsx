import React, { SVGProps } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import MUIButton from '@material-ui/core/Button';
import type { ButtonTypeMap } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import type { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

import MuiIconComponent from '#components/MuiIcon.component';

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

const SubText: React.FC<SubTextsProps> = ({
  subText,
  index,
  customClasses,
}) => {
  const { t } = useTranslation();

  const classes = useStyles({});

  if (subText.length === 1) {
    return (
      <Typography
        className={classNames(classes.subText, customClasses?.subText)}
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
    <ul className={classNames(classes.subTextList, customClasses?.subTextList)}>
      {subText?.map((line, subIndex) => (
        <li key={`${index}-${subIndex}-${line}`}>
          <Typography
            className={classNames(
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
};

type ButtonComponentProps = {
  button: ButtonProps;
  customClasses?: { [className: string]: string };
};

const Button: React.FC<ButtonComponentProps> = ({ button, customClasses }) => {
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
      className={classNames(classes.button, customClasses?.button)}
      style={{
        color: fontColor,
        backgroundColor:
          buttonProps.variant === 'text' ? 'transparent' : backgroundColor,
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
};

type Props = {
  open: boolean;
  onClose?: () => void;
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
  buttons?: ButtonProps[];
  customClasses?: { [className: string]: string };
  namespaces?: string | string[];
  displayCheckBox?: boolean;
  isChecked?: boolean;
  handleCheck?: () => void;
};

const DialogWithBigIcon: React.FC<Props> = ({
  open,
  onClose,
  maxWidth,
  CustomIcon,
  customIconHeight,
  customIconWidth,
  customIconFillOpacity,
  icon,
  iconColor,
  withoutBackground,
  withCross,
  title,
  subTexts,
  buttons,
  customClasses,
  namespaces,
  displayCheckBox,
  isChecked,
  handleCheck,
}) => {
  const { t } = useTranslation(namespaces);

  const classes = useStyles({ iconColor, withoutBackground });

  return (
    <Dialog
      BackdropProps={{
        className: customClasses?.backdrop,
      }}
      classes={{
        root: customClasses?.root,
      }}
      className={customClasses?.dialog}
      maxWidth={maxWidth ?? 'xs'}
      onClose={onClose}
      open={open}
      PaperProps={{
        className: classNames(classes.dialogPaper, customClasses?.dialogPaper),
      }}
    >
      {withCross && (
        <DialogTitle
          className={classNames(
            classes.dialogTitle,
            customClasses?.dialogTitle,
          )}
        >
          <IconButton
            className={classNames(
              classes.closeButton,
              customClasses?.closeButton,
            )}
            onClick={onClose}
          >
            <CloseIcon
              className={classNames(
                classes.closeIcon,
                customClasses?.closeIcon,
              )}
            />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent
        className={classNames(
          classes.dialogContent,
          customClasses?.dialogContent,
        )}
      >
        <div
          className={classNames(
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
              className={classNames(
                classes.largeIcon,
                customClasses?.largeIcon,
              )}
              defaultIcon="CheckCircle"
              icon={icon}
            />
          )}
        </div>

        {title && (
          <Typography
            className={classNames(classes.title, customClasses?.title)}
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

      {displayCheckBox && (
        <div className={classes.checkboxContainer}>
          <div className={classes.checkbox}>
            <Checkbox
              checked={isChecked}
              disabled={false}
              edge="end"
              onChange={handleCheck}
            />
          </div>
          <Typography align="center" variant="body1">
            {t('cadence.dialog.do_not_display_anymore')}
          </Typography>
        </div>
      )}

      {buttons?.length && (
        <DialogActions
          className={classNames(
            classes.dialogActions,
            customClasses?.dialogActions,
          )}
        >
          {buttons?.map((button, index) => (
            <Button key={index} button={button} customClasses={customClasses} />
          ))}
        </DialogActions>
      )}
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
    gap: theme.spacing(2),
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
      listStyleType: 'disc',
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
}));

export default React.memo(DialogWithBigIcon);
