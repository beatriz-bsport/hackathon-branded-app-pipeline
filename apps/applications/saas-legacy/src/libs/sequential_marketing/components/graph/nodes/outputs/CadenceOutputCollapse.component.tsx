import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import WarningIcon from '@material-ui/icons/Warning';
import { type Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Typography from '@material-ui/core/Typography';

import {
  OUTPUT_SECTION_WIDTH,
  OUTPUT_SECTION_BUTTON_BORDER_RADIUS,
} from '#src/libs/sequential_marketing/constants';

export type CadenceOutputCollapseProps = {
  children: React.ReactNode;
  isOpen?: boolean;
  disabled?: boolean;
  hasFinerGrainItemsError: boolean;
};

const CadenceOutputCollapse: React.FC<CadenceOutputCollapseProps> = ({
  children,
  isOpen,
  disabled,
  hasFinerGrainItemsError,
}) => {
  const { t } = useTranslation('marketing');

  const [isExpanded, setIsExpanded] = useState(false);

  const textRef = React.useRef<HTMLSpanElement>(null);

  const classes = useStyles({
    expand: isExpanded,
    textWidth:
      (textRef?.current?.getBoundingClientRect().height -
        textRef?.current?.getBoundingClientRect().width) /
      2,
  });

  const handleExpandClick = useCallback(
    () => !isOpen && setIsExpanded((previousIsExpended) => !previousIsExpended),
    [isOpen],
  );

  useEffect(() => {
    setIsExpanded(isOpen);
  }, [isOpen]);

  return (
    <div className={classes.card}>
      {isExpanded && !!children && (
        <div className={classes.collapseSection}>{children}</div>
      )}
      <ButtonBase
        className={classes.container}
        disabled={disabled || isOpen}
        onClick={handleExpandClick}
      >
        <div className={classes.output}>
          <KeyboardArrowLeftIcon className={classes.expandIcon} />
          <div className={classes.label}>
            <Typography ref={textRef} variant="subtitle1">
              {t('cadence.cadenceCard.outputRules')}
            </Typography>
          </div>
          {hasFinerGrainItemsError && (
            <div className={classes.errorBackground}>
              <WarningIcon className={classes.errorIcon} color="error" />
            </div>
          )}
        </div>
      </ButtonBase>
    </div>
  );
};

type StylesProps = { expand: boolean; textWidth?: number };

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderRadius: `${OUTPUT_SECTION_BUTTON_BORDER_RADIUS}px`,
  },
  card: {
    display: 'inline-flex',
    position: 'relative',
    justifyContent: 'flex-start',
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.common.white,
    border: '2px solid',
    borderColor: theme.palette.grey[300],
  },
  collapseSection: {
    display: 'flex',
    alignItems: 'start',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
  output: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    width: `${OUTPUT_SECTION_WIDTH}px`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
  expandIcon: {
    transform: ({ expand }) => expand && 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  label: {
    display: 'flex',
    paddingTop: ({ textWidth }) => textWidth && `${textWidth}px`,
    paddingBottom: ({ textWidth }) => textWidth && `${textWidth}px`,
    transform: 'rotate(-90deg)',
    whiteSpace: 'nowrap',
  },
  errorBackground: {
    display: 'flex',
    width: '100%',
    height: theme.spacing(3),
    backgroundColor: '#FEE9E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(0.5),
  },
  errorIcon: {
    height: theme.spacing(2),
    width: theme.spacing(2),
  },
}));

export default React.memo(CadenceOutputCollapse);
