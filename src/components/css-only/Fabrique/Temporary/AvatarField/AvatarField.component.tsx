import React, { useCallback, useState } from 'react';
import { useField } from 'formik';

import { createUrl } from '#utils/createUrlHandlers';
import PictureUploader from '#Fabrique/Temporary/PictureUploader';
import Avatar from '#Fabrique/Temporary/Avatar';

import './styles.css';

export type Props = {
  classes?: {
    avatar?: string;
  };
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  name: string;
  id: string;
};

function getUrl(previewUrl: string, value?: string) {
  return previewUrl || (typeof value === 'string' && value);
}

const AvatarField: React.FC<Props> = ({
  onChange,
  classes,
  isDisabled,
  isRequired,
  name,
  id,
}) => {
  const [previewUrl, setPreviewUrl] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, form] = useField<Blob>(name);
  const { setValue } = form;

  React.useEffect(() => {
    if (typeof field.value === 'string') {
      setPreviewUrl(field.value);
    }
    if (field.value instanceof Blob) {
      setPreviewUrl(createUrl(field.value));
    }
    return () => setPreviewUrl('');
  }, [field.value]);

  const action = previewUrl ? 'edit' : 'add';

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      if (files?.length) {
        setValue(files[0]);
      }
      onChange?.(event);
    },
    [onChange, setValue],
  );

  return (
    <div className="bs-fabrique-avatar-field__wrapper">
      <div className="bs-fabrique-avatar-field">
        <Avatar
          className={classes?.avatar}
          picture={getUrl(previewUrl)}
          size="xl"
        />
        <PictureUploader
          action={action}
          classeName="bs-fabrique-avatar-field__button"
          id={id}
          isDisabled={isDisabled}
          isRequired={isRequired}
          name={name}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default React.memo(AvatarField);
