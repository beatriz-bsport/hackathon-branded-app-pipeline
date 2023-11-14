import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ButtonBase from '@material-ui/core/ButtonBase';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';
import { CadenceChip } from './CadenceChip.component';
import {
  getMarketingActionChipIcon,
  getMarketingActionChipName,
} from '#libs/sequential_marketing/components/helpers/utils';

import type { StepMarketingActions } from '#libs/sequential_marketing/types';
import type { Tag } from '#libs/tag/types';
import type { EmailTemplateSummary } from '#libs/email-editor/types';

type Props = {
  marketingAction: StepMarketingActions;
  getTag: (id: string) => Tag;
  getEmailTemplate: (id: string) => EmailTemplateSummary;
  onClick?: () => void;
};

type ClickableChipProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

const ClickableChip: React.FC<ClickableChipProps> = ({ onClick, children }) => {
  const classes = useStyles();

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();
      onClick();
    },
    [onClick],
  );

  if (onClick) {
    return (
      <ButtonBase className={classes.button} onClick={handleClick}>
        {children}
      </ButtonBase>
    );
  }

  return <>{children} </>;
};

const MarketingActionChip: React.FC<Props> = ({
  marketingAction,
  getTag,
  getEmailTemplate,
  onClick,
}) => (
  <ClickableChip onClick={onClick}>
    <CadenceChip
      withBackgroundOnHover
      color={SequentialMarketingColors.MARKETING_ACTION_COLOR}
      icon={getMarketingActionChipIcon(marketingAction)}
      name={getMarketingActionChipName({
        marketingAction,
        getTag,
        getEmailTemplate,
      })}
    />
  </ClickableChip>
);

const useStyles = makeStyles(() => ({
  button: { justifyContent: 'flex-start' },
}));

export default React.memo(MarketingActionChip);
