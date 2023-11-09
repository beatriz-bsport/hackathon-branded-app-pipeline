import React, { useCallback, useEffect, useState } from 'react';
import { type Theme, makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Typography from '@material-ui/core/Typography';
import {
  OUTPUT_SECTION_HEIGHT,
  OUTPUT_SECTION_WIDTH,
} from '#libs/sequential_marketing/constants';

export type CadenceOutputCollapseProps = {
  children: React.ReactNode;
  isOpen?: boolean;
  disabled?: boolean;
};

const CadenceOutputCollapse: React.FC<CadenceOutputCollapseProps> = ({
  children,
  isOpen,
  disabled,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const classes = useStyles({ expand: isExpanded });

  useEffect(() => {
    setIsExpanded(isOpen);
  }, [isOpen]);

  const handleExpandClick = useCallback(
    () => !isOpen && setIsExpanded((previousIsExpended) => !previousIsExpended),
    [isOpen],
  );

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
          <div className={classes.title}>
            <Typography variant="subtitle1">Output</Typography>
          </div>
        </div>
      </ButtonBase>
    </div>
  );
};

type StylesProps = { expand: boolean };

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  container: {
    borderRadius: theme.spacing(1),
    alignItems: 'flex-start',
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
    gap: theme.spacing(1),
    width: `${OUTPUT_SECTION_WIDTH}px`,
    height: `${OUTPUT_SECTION_HEIGHT}px`,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
  },
  expandIcon: {
    transform: ({ expand }) => expand && 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  title: {
    display: 'flex',
    position: 'relative',
    padding: theme.spacing(1),
    transform: 'rotate(-90deg)',
  },
}));

export default React.memo(CadenceOutputCollapse);
