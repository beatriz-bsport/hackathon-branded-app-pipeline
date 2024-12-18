import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import TextForm, { Props as TextFormProps } from '#Fabrique/TextForm';

export type Props = {
  layoutActive?: boolean;
  spaceField?: boolean;
} & Omit<TextFormProps, 'onChange' | 'errorMessage' | 'isError' | 'value'>;

const TextFormField: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation('marketing');
  const [field, meta, form] = useField(props.name);
  const { setValue } = form;

  const handleChange = React.useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
    },
    [setValue],
  );

  return (
    <TextForm
      {...field}
      {...props}
      classes={{ textAreaContainer: 'bs-textform-field-text-area' }}
      errorMessage={meta.error && t(meta.error)}
      isError={!!(meta.touched && meta.error)}
      onChange={handleChange}
    />
  );
};

export default React.memo(TextFormField);
