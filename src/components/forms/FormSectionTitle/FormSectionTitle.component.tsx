import React from 'react';

import { SvgIconProps, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

type Props = {
  Icon: React.ComponentType<SvgIconProps>;
  title: string;
  iconStyle?: SvgIconProps['color'];
  customIconStyle?: string;
  iconContainerStyle?: string;
  isCollapse?: boolean;
  isExpanded?: boolean;
  onToggleExpandSection?: () => void;
};

const FormSectionTitle = React.memo((props: Props) => {
  const {
    Icon,
    title,
    iconStyle,
    iconContainerStyle,
    customIconStyle,
    isCollapse,
    isExpanded,
    onToggleExpandSection,
  } = props;
  const classes = useStyles();

  if (isCollapse) {
    return (
      <Button className={classes.expandButton} onClick={onToggleExpandSection}>
        <div className={classes.sectionTitleContainer}>
          <div className={iconContainerStyle ?? classes.iconContainer}>
            <Icon
              className={customIconStyle ?? classes.icon}
              color={iconStyle}
            />
          </div>
          <Typography className={classes.text}>{title}</Typography>
          <div className={classes.expandIcon}>
            {isExpanded && <ExpandLessIcon />}
            {!isExpanded && <ExpandMoreIcon />}
          </div>
        </div>
      </Button>
    );
  }

  return (
    <div className={classes.sectionTitleContainer}>
      <div className={iconContainerStyle ?? classes.iconContainer}>
        <Icon className={customIconStyle ?? classes.icon} color={iconStyle} />
      </div>
      <Typography className={classes.text}>{title}</Typography>
    </div>
  );
});

const useStyles = makeStyles((theme) => ({
  sectionTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    height: theme.spacing(3),
    marginRight: theme.spacing(1.25),
  },
  icon: {
    height: theme.spacing(3),
    width: theme.spacing(3),
  },
  text: {
    fontWeight: 500,
    fontSize: theme.spacing(2.5),
  },
  expandButton: {
    textTransform: 'none',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    '&:hover': {
      background: 'none',
    },
    padding: 0,
  },
  expandIcon: {
    display: 'flex',
    marginLeft: theme.spacing(1.25),
  },
}));

export default FormSectionTitle;
