import React from 'react';

import { useTranslation } from 'react-i18next';

import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';

import SubdirectoryArrowRight from '#src/components/icons/SubdirectoryArrowRight';
import useFinerGrainEventsItemProvider from '#src/libs/sequential_marketing/components/graph/nodes/hooks/useFinerGrainEventsItemProvider.hook';
import { CadenceChip } from '#src/libs/sequential_marketing/components/graph/chips/CadenceChip.component';
import { CadenceStatusColors } from '#src/libs/sequential_marketing/constants';

type FinerGrainEventItemContainerProps = {
  itemIds: number[];
  disabled: boolean;
  eventType: string;
  color: string;
};

const FinerGrainEventItemContainer: React.FC<
  FinerGrainEventItemContainerProps
> = ({ disabled, eventType, itemIds, color }) => {
  const { t } = useTranslation('marketing');
  const classes = useFinerGrainStyles();
  const { handleFetchFinerGrainEventsItem, getFinerGrainEventsItem } =
    useFinerGrainEventsItemProvider();

  React.useEffect(() => {
    if (eventType && itemIds)
      handleFetchFinerGrainEventsItem(eventType, itemIds);
  }, [eventType, itemIds, handleFetchFinerGrainEventsItem]);

  const itemList = React.useMemo(
    () => eventType && itemIds && getFinerGrainEventsItem(eventType, itemIds),
    [getFinerGrainEventsItem, eventType, itemIds],
  );

  if (!itemList || itemList.length <= 0) return null;

  const hasOneOrSeveralFinerGrainItemsDisabled =
    itemList.filter(
      (item) =>
        ('private_services' in item && !item?.available) || item?.disabled,
    )?.length > 0;

  return (
    <div className={classes.finerGrainContainer}>
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
                <FinerGrainEventSpecificItemChips
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
      {hasOneOrSeveralFinerGrainItemsDisabled && (
        <Alert
          classes={{
            root: classes.alert,
          }}
          icon={false}
          severity="error"
          variant="standard"
        >
          {t('audience.form.trigger.oneOrMoreFinerGrainDisabledText')}
        </Alert>
      )}
    </div>
  );
};

type FinerGrainEventSpecificItemChipsProps = {
  color: string;
  label: string;
  disabled: boolean;
  isItemArchived: boolean;
};

const FinerGrainEventSpecificItemChips: React.FC<
  FinerGrainEventSpecificItemChipsProps
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

const useFinerGrainStyles = makeStyles(() => ({
  finerGrainContainer: {
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

export default React.memo(FinerGrainEventItemContainer);
