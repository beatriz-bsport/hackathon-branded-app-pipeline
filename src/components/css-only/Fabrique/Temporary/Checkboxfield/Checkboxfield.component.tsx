import React from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import Checkbox from '#Fabrique/Checkbox';

type Props = {
  name: string;
  id: string;
  label: string | React.ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
};

const Checkboxfield: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation('marketing');

  const [field, meta, form] = useField<boolean>({ name: props.name });
  const { touched, error } = meta;
  const { value } = field;
  const { setValue } = form;

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setValue(checked);
    },
    [setValue],
  );

  return (
    <Checkbox
      {...field}
      {...props}
      errorMessage={error && t(error)}
      isChecked={value}
      isError={!!(touched && error)}
      onChange={handleChange}
    />
  );
};

export default React.memo(Checkboxfield);
