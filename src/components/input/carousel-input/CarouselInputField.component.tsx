import React from 'react';

import { Field } from 'formik';
import CarouselInput, {
  Props as CarouselInputProps,
} from './CarouselInput.component';

type Props = CarouselInputProps & {
  textFieldName?: string;
  handleSelectedImage?: (index: number) => void;
};

export const CarouselInputField = (props: Props) => {
  return (
    <Field {...props} name={props.textFieldName}>
      {({ field, form: { touched, errors, setFieldValue } }) => {
        return (
          <div>
            <CarouselInput
              {...field}
              selectedImage={props.selectedImage}
              imagesArr={props.imagesArr}
              onRemoveImage={props.onRemoveImage}
              isManager={props.isManager}
              title={props.title}
              handleSelectedImage={props.handleSelectedImage}
              handleClick={(index) => {
                setFieldValue(field.name, props.imagesArr[index]);
                props.handleSelectedImage(index);
              }}
              error={!!(touched[field.name] && errors[field.name])}
            />
          </div>
        );
      }}
    </Field>
  );
};

export default CarouselInputField;
