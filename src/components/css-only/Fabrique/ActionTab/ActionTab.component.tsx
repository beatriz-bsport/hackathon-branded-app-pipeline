import React from 'react';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import ButtonBase from '#Fabrique/ButtonBaseV2';
import Badge from '#Fabrique/Badge';

import './styles.css';

type Props = {
  label: string;
  value: number;
  isSelected?: boolean;
  hasBadge?: boolean;
  className?: string;
  classes?: { text: string };
  onClick: () => void;
};

export const ActionTab: React.FC<Props> = ({
  label,
  value,
  isSelected,
  hasBadge,
  className,
  classes,
  onClick,
}) => {
  return (
    <ButtonBase
      className={classNames(
        'bs-fabrique-action-tab-container',
        {
          'bs-fabrique-action-tab-container--selected': isSelected,
        },
        className,
      )}
      color="primary"
      onClick={onClick}
    >
      <Typography
        className={classNames(
          'bs-fabrique-action-tab-text',
          {
            'bs-fabrique-action-tab-text-weak': !isSelected,
            'bs-fabrique-action-tab-text-on-strong': isSelected,
          },
          classes?.text,
        )}
        variant="body-sm"
      >
        {label}
      </Typography>
      {hasBadge && (
        <Badge color={isSelected ? 'onstrong' : 'grey'} value={value} />
      )}
    </ButtonBase>
  );
};

export const ActionTabStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof ActionTab>>()(ActionTab);

export default React.memo(ActionTab);
