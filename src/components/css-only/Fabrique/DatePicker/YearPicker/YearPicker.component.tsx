import React, { useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import classNames from 'classnames';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Button from '#components/css-only/Fabrique/ButtonV2';
import './styles.css';

type Props = {
  className?: string;
  isOpen: boolean;
  onSelectYear?: (year: number) => void;
};

const YEAR_OFFSET = 120;

const YearPicker: React.FC<Props> = ({ className, onSelectYear, isOpen }) => {
  const currentYear = DateTime.now().year;
  const startYear = DateTime.now().minus({ year: YEAR_OFFSET }).year;

  const yearsArray = useMemo(
    () =>
      Array.from(
        { length: currentYear - startYear + 1 },
        (_, index) => startYear + index,
      ),
    [currentYear, startYear],
  );

  const handleSelectYear = useCallback(
    (year: number) => () => {
      onSelectYear?.(year);
    },
    [onSelectYear],
  );

  return (
    <div
      className={classNames(
        {
          'bs-fabrique-year-picker-root': isOpen,
          'bs-fabrique-year-picker-root--hidden': !isOpen,
        },
        className,
      )}
    >
      {yearsArray.map((year) => (
        <Button
          key={year}
          onClick={handleSelectYear(year)}
          size="small"
          variant="text"
        >
          {year}
        </Button>
      ))}
    </div>
  );
};

export const YearPickerStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof YearPicker>>()(YearPicker);
export default React.memo(YearPicker);
