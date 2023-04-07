// @ts-nocheck
import React, { useState, useCallback } from 'react';

import { Box, Divider, IconProps, makeStyles } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';

import FormSectionTitle from '../FormSectionTitle';

type Props = {
  id?: string;
  children: React.ReactNode;
  sectionTitle: string;
  sectionIcon: React.ComponentType<IconProps>;
  sectionIconStyle?: IconProps['color'];
  sectionIconContainerStyle?: string;
  sectionCustomIconStyle?: string;
  isCollapse?: boolean;
};

const FormSection = React.memo((props: Props) => {
  const {
    children,
    sectionTitle,
    sectionIcon,
    sectionIconStyle,
    sectionIconContainerStyle,
    sectionCustomIconStyle,
    id,
    isCollapse,
  } = props;
  const classes = useStyle();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpandSection = useCallback(
    () => setIsExpanded((prevExpanded) => !prevExpanded),
    [],
  );

  if (isCollapse) {
    return (
      <div id={id}>
        <Box className={classes.container}>
          <FormSectionTitle
            Icon={sectionIcon}
            title={sectionTitle}
            iconStyle={sectionIconStyle}
            iconContainerStyle={sectionIconContainerStyle}
            customIconStyle={sectionCustomIconStyle}
            isCollapse
            isExpanded={isExpanded}
            onToggleExpandSection={toggleExpandSection}
          />
          <Collapse in={isExpanded}>
            <Box className={classes.collapseContainer}>{children}</Box>
          </Collapse>
        </Box>
        <Divider />
      </div>
    );
  }

  return (
    <div id={id}>
      <Box className={classes.container}>
        <FormSectionTitle
          Icon={sectionIcon}
          title={sectionTitle}
          iconStyle={sectionIconStyle}
          iconContainerStyle={sectionIconContainerStyle}
          customIconStyle={sectionCustomIconStyle}
        />
        {children}
      </Box>
      <Divider />
    </div>
  );
});

const useStyle = makeStyles((theme) => ({
  container: {
    paddingRight: theme.spacing(4.25),
    paddingLeft: theme.spacing(4.25),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(3),
    },
    '& > *:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
  collapseContainer: {
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(3),
    },
    '& > *:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
}));

export default FormSection;
