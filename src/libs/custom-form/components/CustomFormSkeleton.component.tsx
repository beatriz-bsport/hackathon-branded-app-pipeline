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
              width="100%"
              variant="text"
              height={30}
            />
          </div>
        ))}
      </GridLayoutWrapper>
    );
  }
  return (
    <div>
      <Skeleton animation="wave" width={100} variant="circle" height={100} />
      <Skeleton animation="wave" width="100%" variant="text" height={30} />
      <Skeleton animation="wave" width="80%" variant="text" height={30} />
      <Skeleton animation="wave" width="50%" variant="text" height={30} />

      <Box mt={2} />
      <Skeleton animation="wave" width="100%" variant="rect" height={50} />
    </div>
  );
};
export default CustomFormSkeleton;
