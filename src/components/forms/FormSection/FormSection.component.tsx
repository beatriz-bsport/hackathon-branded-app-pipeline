// @ts-nocheck
import { Box, Divider, IconProps, makeStyles } from '@material-ui/core';
import React from 'react';
import FormSectionTitle from '../FormSectionTitle';

type Props = {
  children: React.ReactNode;
  sectionTitle: string;
  sectionIcon: React.ComponentType<IconProps>;
  sectionIconStyle?: IconProps['color'];
};

const FormSection = React.memo((props: Props) => {
  const classes = useStyle();
  return (
    <>
      <Box className={classes.container}>
        <FormSectionTitle
          Icon={props.sectionIcon}
          title={props.sectionTitle}
          iconStyle={props.sectionIconStyle}
        />
        {props.children}
      </Box>
      <Divider />
    </>
  );
});

const useStyle = makeStyles((theme) => ({
  container: {
    paddingRight: theme.spacing(4.25),
    paddingLeft: theme.spacing(4.25),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
    '& > *:last-child': {
      marginBottom: theme.spacing(0),
    },
  },
}));

export default FormSection;
