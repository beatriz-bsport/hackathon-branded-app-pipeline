import React from 'react';

import { useTranslation } from 'react-i18next';

import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';

import SubdirectoryArrowRight from '#src/components/icons/SubdirectoryArrowRight';
import useFinnerGrainEventsItemProvider from '#src/libs/sequential_marketing/components/graph/nodes/hooks/useFinnerGrainEventsItemProvider.hook';
import { CadenceChip } from '#src/libs/sequential_marketing/components/graph/chips/CadenceChip.component';
import { CadenceStatusColors } from '#src/libs/sequential_marketing/constants';

type FinnerGrainEventItemContainerProps = {
  itemIds: number[];
  disabled: boolean;
  eventType: string;
  color: string;
};

const FinnerGrainEventItemContainer: React.FC<
  FinnerGrainEventItemContainerProps
> = ({ disabled, eventType, itemIds, color }) => {
  const { t } = useTranslation('marketing');
  const classes = useFinnerGrainStyles();
  const { handleFetchFinnerGrainEventsItem, getFinnerGrainEventsItem } =
    useFinnerGrainEventsItemProvider();

  React.useEffect(() => {
    if (eventType && itemIds)
      handleFetchFinnerGrainEventsItem(eventType, itemIds);
  }, [eventType, itemIds, handleFetchFinnerGrainEventsItem]);

  const itemList = React.useMemo(
    () => eventType && itemIds && getFinnerGrainEventsItem(eventType, itemIds),
    [getFinnerGrainEventsItem, eventType, itemIds],
  );

  if (!itemList || itemList.length <= 0) return null;

  const hasOneOrSeveralFinnerGrainItemsDisabled =
    itemList.filter(
      (item) =>
        ('private_services' in item && !item?.available) || item?.disabled,
    )?.length > 0;

  return (
    <div className={classes.finnerGrainContainer}>
      <div className={classes.filteredItemContainer}>
        <SubdirectoryArrowRight />
        <div className={classes.filteredItemChipContainer}>
          {itemIds &&
            (itemList ?? []).map((filteredItem) => {
              const isItemDisabled =
                ('private_services' in filteredItem &&
                  !filteredItem?.available) ||
                filteredItem?.disabled;

              return (
                <FinnerGrainEventSpecificItemChips
                  key={filteredItem?.id}
                  color={color}
                  disabled={disabled}
                  isItemArchived={isItemDisabled}
                  label={filteredItem?.name}
                />
              );
            })}
        </div>
      </div>
      {hasOneOrSeveralFinnerGrainItemsDisabled && (
        <Alert
          classes={{
            root: classes.alert,
          }}
          icon={false}
          severity="error"
          variant="standard"
        >
          {t('audience.form.trigger.oneOrMoreFinnerGrainDisabledText')}
        </Alert>
      )}
    </div>
  );
};

type FinnerGrainEventSpecificItemChipsProps = {
  color: string;
  label: string;
  disabled: boolean;
  isItemArchived: boolean;
};

const FinnerGrainEventSpecificItemChips: React.FC<
  FinnerGrainEventSpecificItemChipsProps
> = ({ color, label, disabled, isItemArchived }) => {
  const chipColor = React.useMemo(
    () => (isItemArchived ? CadenceStatusColors.ERROR_DARK_COLOR : color),
    [isItemArchived, color],
  );
  return (
    <CadenceChip
      toolTip
      color={chipColor}
      disabled={disabled}
      icon={isItemArchived ? 'Warning' : ''}
      name={label}
      toolTipValue={label}
    />
  );
};

const useFinnerGrainStyles = makeStyles(() => ({
  finnerGrainContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filteredItemContainer: {
    display: 'flex',
    paddingTop: '4px',
    width: '100%',
    alignItems: 'baseline',
  },
  filteredItemChipContainer: {
    display: 'flex',
    gap: '4px',
    padding: '4px',
    width: '100%',
    flexWrap: 'wrap',
  },
  alert: {
    alignItems: 'center',
  },
}));

export default React.memo(FinnerGrainEventItemContainer);
