import React from 'react';

import { Field } from 'formik';
import CarouselInput, {
  Props as CarouselInputProps,
} from './CarouselInput.component';

type Props = Omit<CarouselInputProps, 'handleClick'> & {
  textFieldName?: string;
  handleSelectedImage?: (index: number) => void;
};

export const CarouselInputField = (props: Props) => {
  return (
    <Field {...props} name={props.textFieldName}>
      {/* @ts-expect-error */}
      {({ field, form: { touched, errors, setFieldValue } }) => {
        return (
          <div>
            <CarouselInput
              {...field}
              error={!!(touched[field.name] && errors[field.name])}
              handleClick={(index) => {
                setFieldValue(field.name, props.imagesArr[index]);
                props.handleSelectedImage?.(index);
              }}
              handleSelectedImage={props.handleSelectedImage}
              imagesArr={props.imagesArr}
              isManager={props.isManager}
              onRemoveImage={props.onRemoveImage}
              selectedImage={props.selectedImage}
              title={props.title}
            />
          </div>
        );
      }}
    </Field>
  );
};

export default CarouselInputField;
