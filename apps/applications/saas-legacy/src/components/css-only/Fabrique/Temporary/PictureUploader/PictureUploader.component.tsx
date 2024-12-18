import React, { useCallback, useRef } from 'react';
import classNames from 'classnames';
import IconButton from '#Fabrique/IconButton';
import { Pencil02, Plus } from '#src/components/untitledui';
import { ActionType, ActionTypeEnum } from '.';
import './styles.css';

type ClassesType = {
  addButton?: string;
  editButton?: string;
};

export type Props = {
  action: ActionType;
  classeName?: string;
  classes?: ClassesType;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  name: string;
  id: string;
};

type ActionButtonProps = {
  onClick: () => void;
} & Pick<Props, 'action' | 'classes' | 'isDisabled'>;

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  onClick,
  classes,
  isDisabled,
}) => {
  switch (action) {
    case ActionTypeEnum.EDIT:
      return (
        <IconButton
          className={classNames(
            'bs-fabrique-picture-loader__button',
            'bs-fabrique-picture-loader__button--edit',
            classes?.editButton,
          )}
          color="grey"
          isDisabled={isDisabled}
          onClick={onClick}
          size="sm"
          variant="outlined"
        >
          <Pencil02
            className="bs-fabrique-picture-loader__button__edit-icon"
            stroke="currentColor"
          />
        </IconButton>
      );
    default:
      return (
        <IconButton
          className={classNames(
            'bs-fabrique-picture-loader__button',
            'bs-fabrique-picture-loader__button--add',
            classes?.addButton,
          )}
          color="primary"
          isDisabled={isDisabled}
          onClick={onClick}
          size="sm"
          variant="outlined"
        >
          <Plus
            className="bs-fabrique-picture-loader__button__add-icon"
            stroke="currentColor"
          />
        </IconButton>
      );
  }
};

const PictureUploader: React.FC<Props> = ({
  action = ActionTypeEnum.ADD,
  classeName,
  classes,
  onChange,
  isDisabled,
  isRequired,
  name,
  id,
}) => {
  const fileInputRef = useRef(null);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
    },
    [onChange],
  );

  const handleButtonClick = useCallback(() => {
    // Simulate a click on the file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  return (
    <div
      className={classNames('bs-fabrique-picture-loader__wrapper', classeName)}
    >
      <input
        ref={fileInputRef}
        accept="image/*"
        className="bs-fabrique-picture-loader__input"
        id={id}
        name={name}
        onChange={handleChange}
        required={isRequired}
        type="file"
      />
      <label htmlFor={id}>
        <ActionButton
          action={action}
          classes={classes}
          isDisabled={isDisabled}
          onClick={handleButtonClick}
        />
      </label>
    </div>
  );
};

export default React.memo(PictureUploader);
