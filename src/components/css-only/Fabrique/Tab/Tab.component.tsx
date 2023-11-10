import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import ButtonBase from '#Fabrique/ButtonBaseV2';
import { TabColor } from './types';
import { TabColorEnum } from './constants';

import './styles.css';

type Props = {
  className?: string;
  classes?: { text: string };
  children?: React.ReactNode;
  isSelected?: boolean;
  hasSelect?: boolean;
  color: TabColor;
  onClick: () => void;
};

const tabColorClassNamesMap = {
  [TabColorEnum.MAIN]: 'bs-fabrique-tab-root-main--selected',
  [TabColorEnum.GREY]: 'bs-fabrique-tab-root-grey--selected',
};

const ChevronIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M3.52859 5.52851C3.78894 5.26816 4.21105 5.26816 4.4714 5.52851L8 9.05711L11.5286 5.52851C11.7889 5.26816 12.2111 5.26816 12.4714 5.52851C12.7317 5.78886 12.7317 6.21097 12.4714 6.47132L8.4714 10.4713C8.21105 10.7317 7.78894 10.7317 7.52859 10.4713L3.52859 6.47132C3.26824 6.21097 3.26824 5.78886 3.52859 5.52851Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export const Tab: React.FC<Props> = ({
  classes,
  className,
  children,
  isSelected,
  hasSelect,
  color = 'main',
  onClick,
}) => {
  return (
    <ButtonBase
      className={classNames(
        'bs-fabrique-tab-root',
        {
          'bs-fabrique-tab-root--selected': isSelected,
          [tabColorClassNamesMap[color]]: isSelected,
        },
        className,
      )}
      onClick={onClick}
    >
      <Typography
        className={classNames('bs-fabrique-tab-text', classes?.text)}
        variant="body-md"
      >
        {children}
      </Typography>

      {hasSelect && <ChevronIcon className="bs-fabrique-tab-select-icon" />}
    </ButtonBase>
  );
};

export const TabStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Tab>>()(Tab);

export default React.memo(Tab);
