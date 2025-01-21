import React, {
  forwardRef,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
} from 'react';
import clsx from 'clsx';
import useMergeRef from './utils';

export type OwnProps = {
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
  /**
   * Callback function triggered when the input field loses focus (blurred).
   *
   * This function is invoked when the user interacts with the input and then moves focus away from it.
   *
   * @param event - The optional React FocusEvent containing information about the blur event.
   *                If not provided, the event parameter is undefined.
   */
  onBlur?: (event?: React.FocusEvent<HTMLInputElement, Element>) => void;
  /**
   * Callback function triggered when the content of the input changes.
   *
   * This function is invoked when the user interacts with the input and modifies its content.
   *
   * @param event - The optional React ChangeEvent containing information about the change event.
   *                If not provided, the event parameter is undefined.
   */
  onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Callback function triggered when the input receives focus.
   *
   * This function is invoked when the user interacts with the input and it becomes the active element.
   *
   * @param event - The optional React FocusEvent containing information about the focus event.
   *                If not provided, the event parameter is undefined.
   */
  onFocus?: (event?: React.FocusEvent<HTMLInputElement, Element>) => void;
  /**
   * Callback function triggered when the input is clicked.
   *
   * This function is invoked when the user interacts with the input by clicking on it.
   *
   * @param event - The optional React MouseEvent containing information about the click event.
   *                If not provided, the event parameter is undefined.
   */
  onClick?: (event?: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  /**
   * If true, the input is disabled and cannot be interacted with.
   */
  isDisabled?: boolean;
  /**
   * The unique identifier for the input element.
   *
   * If provided, it associates the input with a label and aids accessibility.
   */
  id?: string;
  /**
   * The name attribute of the input element.
   *
   * It is used to identify the input data when submitting a form.
   */
  name?: string;
  /**
   * The text displayed in the input when it is empty, providing a hint to the user.
   */
  placeholder?: string;
  /**
   * The type of the input, determining the data format and validation rules.
   *
   * Refer to [HTMLInputTypeAttribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) for valid values.
   */
  type?: HTMLInputTypeAttribute;
  /**
   * If true, the input is marked as required, indicating that the user must provide a value.
   *
   * When the input is part of a form, the browser may prevent form submission if this field is not filled in.
   */
  isRequired?: boolean;
  /**
   * The current value of the input field.
   *
   * If provided, this prop sets the initial value of the input. Subsequent changes to this prop
   * will update the displayed value of the input, allowing programmatic control of the input's content.
   */
  value?: string | number;
  /**
   * If true, the input is checked. This is typically used for checkbox or radio input types.
   *
   * When applied to a checkbox, setting this prop to `true` will mark the checkbox as checked,
   * while setting it to `false` will uncheck the checkbox. For radio inputs, it determines if the
   * radio button is selected among a group of radio buttons.
   */
  isChecked?: boolean;
  readOnly?: boolean;
};

export type Props = {
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   * @default {}
   */
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, keyof OwnProps>;
} & OwnProps;

const InputBase: React.ForwardRefExoticComponent<
  Props & React.RefAttributes<HTMLInputElement>
> = forwardRef(
  (
    {
      inputRef,
      className,
      onBlur,
      onChange,
      onFocus,
      onClick,
      id,
      isDisabled,
      name,
      isRequired,
      value,
      isChecked,
      readOnly,
      ...inputProps
    },
    inputForwardedRef,
  ) => {
    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
    };

    const handleInputRef = useMergeRef(inputRef, inputForwardedRef);

    return (
      <input
        {...inputProps}
        ref={handleInputRef}
        checked={isChecked}
        className={clsx('bs-fabrique-input-base', className)}
        disabled={isDisabled}
        id={id}
        name={name}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={onClick}
        onFocus={handleFocus}
        readOnly={!!readOnly}
        required={isRequired}
        value={value}
      />
    );
  },
);

export default React.memo(InputBase);
