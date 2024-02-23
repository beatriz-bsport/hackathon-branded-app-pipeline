import React, { ChangeEvent } from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import Textfield from '#Fabrique/TextFieldV2';
import IconButton from '#Fabrique/IconButton';
import { Calendar } from '#components/untitledui';
import DatePicker from '#Fabrique/Temporary/DatePicker';
import './styles.css';

export type Props = {
  name: string;
  id: string;
  label?: string;
  onBlur?: () => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  isForcedDatePicker?: boolean;
};

type ButtonProps = {
  onClick: () => void;
  onMouseDown: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const DatePickerButton: React.FC<ButtonProps> = ({ onClick, onMouseDown }) => {
  return (
    <IconButton
      onClick={onClick}
      onMouseDown={onMouseDown}
      size="sm"
      variant="text"
    >
      <Calendar />
    </IconButton>
  );
};

const DateField: React.FC<Props> = ({
  name,
  id,
  label,
  onBlur,
  isDisabled,
  isRequired,
  isForcedDatePicker,
}) => {
  const { t } = useTranslation('marketing');

  const anchorRef = React.useRef<HTMLDivElement | null>(null);

  const [anchorElement, setAnchorElement] =
    React.useState<HTMLDivElement | null>(null);

  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string>(
    moment().format('YYYY-MM-DD'),
  );
  const [{ value }, { touched, error }, { setValue }] = useField<string>(name);

  const handleOpenDatePicker = React.useCallback(() => {
    setAnchorElement(anchorRef.current);
    setIsDatePickerOpen(true);
  }, []);

  const handleCloseDatePicker = React.useCallback(() => {
    setIsDatePickerOpen(false);
    setAnchorElement(null);
  }, []);

  const handleMouseDownPrevention = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
      event.preventDefault(),
    [],
  );

  const handleSelect = React.useCallback(
    (date: string) => {
      setSelectedDate(date);
      setValue(date);
    },
    [setValue],
  );

  const handleChange = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (isForcedDatePicker && !isDatePickerOpen) {
        handleOpenDatePicker();
      } else {
        const newValue = event.target.value;
        setSelectedDate(newValue);
        setValue(newValue);
      }
    },
    [setValue, handleOpenDatePicker, isForcedDatePicker, isDatePickerOpen],
  );

  const handleOnFocus = () => {
    if (isForcedDatePicker && !isDatePickerOpen) {
      handleOpenDatePicker();
    }
  };

  const handleBlur = () => {
    if (isForcedDatePicker && !isDatePickerOpen) {
      handleOpenDatePicker();
    } else {
      onBlur?.();
    }
  };

  return (
    <>
      <div ref={anchorRef}>
        <Textfield
          classes={{
            inputContainer: 'bs-fabrique-datefield__input-container',
          }}
          errorMessage={error && t(error)}
          inputId={id}
          isDisabled={isDisabled}
          isError={!!(touched && error)}
          isRequired={isRequired}
          label={label}
          name={name}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleOnFocus}
          rightIcon={
            <DatePickerButton
              onClick={handleOpenDatePicker}
              onMouseDown={handleMouseDownPrevention}
            />
          }
          size="sm"
          // Commented below because of annoying native behavior
          // that must be taken regarding placeholder.
          // type="date"
          value={value}
        />
      </div>
      <DatePicker
        anchorEl={anchorElement}
        dateSelected={selectedDate}
        id={`${id}-date-picker`}
        isOpen={isDatePickerOpen}
        onClose={handleCloseDatePicker}
        onSelect={handleSelect}
      />
    </>
  );
};

export default React.memo(DateField);
