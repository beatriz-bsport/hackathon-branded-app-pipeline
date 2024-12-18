import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import GridLayoutWrapper from './consumer-form-layout/GridLayoutWrapper.component';
import { CustomForm, CustomFormField, ResponsiveLayouts } from '../types';

type OwnProps = {
  layouts?: ResponsiveLayouts;
  customForm: CustomForm;
};
export const CustomFormSkeleton = (props: OwnProps) => {
  if (props.layouts) {
    return (
      <GridLayoutWrapper layouts={props.layouts}>
        {props.customForm?.custom_form_field?.map((field: CustomFormField) => (
          <div key={field?.id?.toString()}>
            <Box mt={2} />
            <Skeleton
              animation="wave"
              height={30}
              variant="text"
              width="100%"
            />
          </div>
        ))}
      </GridLayoutWrapper>
    );
  }
  return (
    <div>
      <Skeleton animation="wave" height={100} variant="circle" width={100} />
      <Skeleton animation="wave" height={30} variant="text" width="100%" />
      <Skeleton animation="wave" height={30} variant="text" width="80%" />
      <Skeleton animation="wave" height={30} variant="text" width="50%" />

      <Box mt={2} />
      <Skeleton animation="wave" height={50} variant="rect" width="100%" />
    </div>
  );
};
export default CustomFormSkeleton;
