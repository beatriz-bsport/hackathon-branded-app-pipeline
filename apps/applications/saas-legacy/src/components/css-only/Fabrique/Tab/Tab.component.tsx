import React from 'react';
import clsx from 'clsx';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import ButtonBase from '#Fabrique/ButtonBaseV2';
import { ChevronDown } from '#src/components/untitledui';
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
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const tabColorClassNamesMap = {
  [TabColorEnum.MAIN]: 'bs-fabrique-tab-root-main--selected',
  [TabColorEnum.GREY]: 'bs-fabrique-tab-root-grey--selected',
};

export const Tab: React.FC<Props> = ({
  classes,
  className,
  children,
  isSelected,
  hasSelect,
  color = TabColorEnum.MAIN,
  onClick,
}) => {
  return (
    <ButtonBase
      className={clsx(
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
        className={clsx('bs-fabrique-tab-text', classes?.text)}
        variant="body-md"
      >
        {children}
      </Typography>

      {hasSelect && (
        <ChevronDown
          className="bs-fabrique-tab-select-icon"
          pathProps={{
            stroke: 'currentColor',
          }}
        />
      )}
    </ButtonBase>
  );
};

export const TabStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof Tab>>()(Tab);

export default React.memo(Tab);
