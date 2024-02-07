import React, { useCallback } from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';

import { Calendar } from '#components/untitledui';
import ActionTab from '#Fabrique/ActionTab';
import IconButton from '#Fabrique/IconButton';
import DatePicker from '#Fabrique/DatePicker';

import './styles.css';

const CALENDAR_INITIAL_DATE = moment().format('YYYY-MM-DD');

type Props<TabType> = {
  onDatePickerClick?: (selectedDate: string) => void;
  selectedTab: TabType;
  filters: {
    className?: string;
    hasBadge?: boolean;
    label: string;
    onClick: () => void;
    type: TabType;
    value?: number;
  }[];
  isMobile?: boolean;
};

export const ConsumerGenericFilters = <TabType,>({
  filters,
  onDatePickerClick,
  selectedTab,
  isMobile,
}: Props<TabType>) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
  const [date, setDate] = React.useState<string>(CALENDAR_INITIAL_DATE);

  const handleOnClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const currentTarget = event.currentTarget;
      setAnchorEl(currentTarget);
      setIsOpen(true);
    },
    [],
  );

  const handleOnClose = useCallback(() => {
    setAnchorEl(null);
    setIsOpen(false);
  }, []);

  const handleSelect = useCallback(
    (selectedDate: string) => {
      setDate(selectedDate);
      onDatePickerClick?.(selectedDate);
    },
    [onDatePickerClick],
  );

  return (
    <div className="bs-consumer-generic-filters">
      <div className="bs-consumer-generic-filters__tabs">
        {(filters || []).map(
          ({ className, hasBadge, label, onClick, type, value }) => (
            <ActionTab
              key={`${className}-${type}`}
              className={classNames(
                'bs-consumer-generic-filters__tabs__tab',
                className,
              )}
              hasBadge={hasBadge}
              isSelected={selectedTab === type}
              label={label}
              onClick={onClick}
              value={value}
            />
          ),
        )}
      </div>

      <IconButton
        className={classNames('bs-consumer-generic-filters__date-picker', {
          'bs-consumer-generic-filters__date-picker--hidden':
            isMobile || !onDatePickerClick,
        })}
        color="grey"
        onClick={handleOnClick}
        size="md"
        variant="outlined"
      >
        <Calendar stroke="currentColor" />
      </IconButton>
      <DatePicker
        anchorEl={anchorEl}
        className="bs-consumer-generic-filters__date-picker__menu"
        dateSelected={date}
        id="basic-date-picker"
        isOpen={isOpen}
        onClose={handleOnClose}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default React.memo(
  ConsumerGenericFilters,
) as typeof ConsumerGenericFilters;
