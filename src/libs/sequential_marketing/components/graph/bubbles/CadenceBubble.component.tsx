import React, { useMemo } from 'react';
import chroma from 'chroma-js';
import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import BubbleCard from '#components/card/BubbleCard.component';
import {
  CADENCE_BUBBLE_WIDTH,
  HEADER_ICON_SIZE,
} from '#libs/sequential_marketing/constants/steps';

type Props = {
  color: string;
  icon: string;
  title: string;
  children?: React.ReactNode;
  onCancelText?: string;
  onConfirmText?: string;
  isSubmissionForbidden?: boolean;
  minimalIcon?: boolean;
  smallTitle?: boolean;
  squareIcon?: boolean;
  withDeleteIcon?: boolean;
  withoutBottomActions?: boolean;
  withUpwardPointingTail?: boolean;
  onCancelClick?: () => void;
  onConfirmClick?: () => void;
};

type CadenceBubbleHeaderProps = Pick<
  Props,
  'title' | 'smallTitle' | 'icon' | 'color' | 'minimalIcon' | 'onCancelClick'
>;

const CadenceBubbleHeader: React.FC<CadenceBubbleHeaderProps> = React.memo(
  ({ color, icon, minimalIcon, smallTitle, title, onCancelClick }) => {
    const classes = useStyles({ color });
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
            <Typography
              className={classes.label}
              variant={smallTitle ? 'subtitle1' : 'h6'}
            >
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

const CadenceBubble: React.FC<Props> = ({
  color,
  icon,
  title,
  children,
  isSubmissionForbidden,
  minimalIcon,
  onCancelText,
  onConfirmText,
  smallTitle,
  squareIcon,
  withDeleteIcon,
  withoutBottomActions,
  withUpwardPointingTail,
  onCancelClick,
  onConfirmClick,
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

  const classes = useStyles({ color, bottomButtonPosition, squareIcon });

  return (
    <BubbleCard
      withShadow
      width={CADENCE_BUBBLE_WIDTH}
      withUpwardPointingTail={withUpwardPointingTail}
    >
      <div className={classes.header}>
        <CadenceBubbleHeader
          color={color}
          icon={icon}
          minimalIcon={minimalIcon}
          onCancelClick={withDeleteIcon ? onCancelClick : null}
          smallTitle={smallTitle}
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

type StylesProps = {
  color: string;
  bottomButtonPosition?: string;
  squareIcon?: boolean;
};

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
    paddingBottom: ({ squareIcon }) => !squareIcon && theme.spacing(1),
    width: '100%',
    flex: 1,
  },
  labelContainer: {
    overflow: 'hidden',
  },
  label: {
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  diamond: {
    flexShrink: 0,
    position: 'relative',
    backgroundColor: ({ color }) =>
      chroma(color || theme.palette.primary.main)
        .alpha(0.09)
        .hex(),
    transform: ({ squareIcon }) => !squareIcon && 'rotate(45deg)',
    height: HEADER_ICON_SIZE,
    width: HEADER_ICON_SIZE,
    borderRadius: theme.spacing(0.5),
    margin: ({ squareIcon }) => !squareIcon && theme.spacing(1),
  },
  centerAbsolute: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: ({ squareIcon }) =>
      squareIcon
        ? 'translate(-45%,-45%)'
        : 'translate(-45%,-45%) rotate(-45deg)',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
  },
}));

export default React.memo(CadenceBubble);
