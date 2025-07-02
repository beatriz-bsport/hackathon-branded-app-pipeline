import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import clsx from 'clsx';
import TextField, {
  Props as TextfieldProps,
} from '#src/components/css-only/Fabrique/TextFieldV2';
import './styles.css';

type Props = {
  layoutActive?: boolean;
  spaceField?: boolean;
  name: string;
} & Omit<
  TextfieldProps,
  'onChange' | 'errorMessage' | 'isError' | 'value' | 'name'
>;

const Textfield: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation(['marketing', 'booking']);
  const [field, meta, form] = useField(props.name);
  const { setValue } = form;

  const handleChange = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
    },
    [setValue],
  );

  return (
    <TextField
      {...field}
      {...props}
      classes={{
        root: clsx('bs-fabrique-textfield', {
          'bs-fabrique-textfield--layout-active': props.layoutActive,
          'bs-fabrique-textfield--space-field': props.spaceField,
        }),
        inputContainer: 'bs-fabrique-textfield__input-container',
        ...props.classes,
      }}
      errorMessage={meta.error && t(meta.error)}
      isError={!!(meta.touched && meta.error)}
      onChange={handleChange}
      size={props.size ?? 'sm'}
    />
  );
};

export default React.memo(Textfield);
