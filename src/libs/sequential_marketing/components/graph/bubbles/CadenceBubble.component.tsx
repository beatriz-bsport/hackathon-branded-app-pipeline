import React, { useMemo } from 'react';
import chroma from 'chroma-js';
import { makeStyles, type Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import type { ClassNameMap } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import BubbleCard from '#components/card/BubbleCard.component';
import {
  CADENCE_BUBBLE_HEADER_FONT_SIZE,
  CADENCE_BUBBLE_WIDTH,
  HEADER_ICON_SIZE,
} from '#libs/sequential_marketing/constants/steps';

export type CadenceBubbleProps = {
  title: string;
  icon: string;
  color: string;
  children?: React.ReactNode;
  minimalIcon?: boolean;
  withoutBottomActions?: boolean;
  onCancelClick?: () => void;
  onCancelText?: string;
  onConfirmClick?: () => void;
  onConfirmText?: string;
  isSubmissionForbidden?: boolean;
  withDeleteIcon?: boolean;
};

type CadenceBubbleHeaderProps = { classes: ClassNameMap<string> } & Pick<
  CadenceBubbleProps,
  'title' | 'icon' | 'color' | 'minimalIcon' | 'onCancelClick'
>;

const CadenceBubbleHeader: React.FC<CadenceBubbleHeaderProps> = React.memo(
  ({ classes, color, icon, minimalIcon, title, onCancelClick }) => {
    return (
      <div className={classes.title}>
        <div className={classes.flexIconAndText}>
          {minimalIcon ? (
            <CustomMuiIcon
              defaultBackGround
              customColor={color}
              icon={icon}
              withBackground={false}
            />
          ) : (
            <div className={classes.diamond}>
              <div className={classes.centerAbsolute}>
                <CustomMuiIcon
                  defaultBackGround
                  customColor={color}
                  icon={icon}
                  withBackground={false}
                />
              </div>
            </div>
          )}
          <div className={classes.labelContainer}>
            <Typography className={classes.label} variant="subtitle2">
              {title}
            </Typography>
          </div>
          {onCancelClick && (
            <IconButton
              className={classes.deleteButton}
              onClick={onCancelClick}
              size="small"
            >
              <CustomMuiIcon
                defaultBackGround
                icon="Close"
                withBackground={false}
              />
            </IconButton>
          )}
        </div>
      </div>
    );
  },
);

const CadenceBubble: React.FC<CadenceBubbleProps> = ({
  title,
  isSubmissionForbidden,
  icon,
  color,
  children,
  minimalIcon,
  withoutBottomActions,
  onCancelClick,
  onCancelText,
  onConfirmClick,
  onConfirmText,
  withDeleteIcon,
}) => {
  const { t } = useTranslation('marketing');

  const bottomButtonPosition = useMemo(() => {
    if ((!onCancelClick || withDeleteIcon) && onConfirmClick) {
      return 'flex-end';
    }
    if (onCancelClick && !onConfirmClick) {
      return 'flex-start';
    }
    return 'space-between';
  }, [onCancelClick, onConfirmClick, withDeleteIcon]);

  const classes = useStyles({ color, bottomButtonPosition });

  return (
    <BubbleCard withShadow width={CADENCE_BUBBLE_WIDTH}>
      <div className={classes.header}>
        <CadenceBubbleHeader
          classes={classes}
          color={color}
          icon={icon}
          minimalIcon={minimalIcon}
          onCancelClick={withDeleteIcon ? onCancelClick : null}
          title={title}
        />
      </div>
      {!!children && children}
      {!withoutBottomActions && (
        <div className={classes.footer}>
          {!withDeleteIcon && !!onCancelClick && (
            <Button
              className={classes.button}
              color="default"
              onClick={onCancelClick}
              variant="text"
            >
              {onCancelText || t('cadence.bubble.cancel')}
            </Button>
          )}
          {!!onConfirmClick && (
            <Button
              className={classes.button}
              color="primary"
              disabled={isSubmissionForbidden}
              onClick={onConfirmClick}
              variant="contained"
            >
              {onConfirmText || t('cadence.bubble.confirm')}
            </Button>
          )}
        </div>
      )}
    </BubbleCard>
  );
};

type StylesProps = { color: string; bottomButtonPosition: string };

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  footer: {
    width: '100%',
    display: 'flex',
    justifyContent: ({ bottomButtonPosition }) => bottomButtonPosition,
    gap: theme.spacing(1),
  },
  button: {
    elevation: 5,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1, 2, 1, 2),
    fontWeight: 'bold',
  },
  header: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: theme.spacing(2),
    width: '100%',
  },
  title: {
    display: 'flex',
    position: 'relative',
    alignItems: 'flex-start',
    width: '100%',
  },
  flexIconAndText: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: '100%',
    flex: 1,
  },
  labelContainer: {
    overflow: 'hidden',
  },
  label: {
    fontSize: CADENCE_BUBBLE_HEADER_FONT_SIZE,
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  },
  diamond: {
    flexShrink: 0,
    position: 'relative',
    backgroundColor: ({ color }) =>
      chroma(color || theme.palette.primary.main)
        .alpha(0.09)
        .hex(),
    transform: 'rotate(45deg)',
    height: HEADER_ICON_SIZE,
    width: HEADER_ICON_SIZE,
    borderRadius: theme.spacing(0.5),
    margin: theme.spacing(1),
  },
  centerAbsolute: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-45%,-45%) rotate(-45deg)',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
  },
}));

export default React.memo(CadenceBubble);
