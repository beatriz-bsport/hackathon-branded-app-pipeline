import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Switch from '@material-ui/core/Switch';
import { DateTime } from 'luxon';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ListItemText from '@material-ui/core/ListItemText';
import type { CoachDetailed } from 'src/api/types';
import { Theme, makeStyles } from '@material-ui/core';
import MetaActivityListItem from '#libs/meta-activity/components/MetaActivityListItem.component';
import DelayedNumericInput from '#components/DelayedNumericInput.component';
// @ts-expect-error

import type { Establishment } from '#libs/establishment/types';
// @ts-expect-error
import EstablishmentListItem from '#libs/establishment/components/EstablishmentListItem.component';
import PaymentPackListItem from '#libs/payment-packs/components/PaymentPackListItem.component';

import CoachListItem from '#libs/associated-coach/components/CoachListItemBasic.component';

import { getLevelTranslation } from '#libs/level/utils';
import type { Level } from '#libs/level/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import type { PaymentPack } from '#libs/payment-packs/types';
import type {
  FetchBulkItemsType,
  FetchItemsType,
} from '#libs/smart-list/types';
import CalendarPicker from '../CalendarPicker.component';
import CheckboxSelector from '../CheckboxSelector.component';
import Selector from '../MultiSelector.component';

const DATE_BETWEEN = 2;

type LevelItem = {
  id: string | number;
  text: string;
  disabled: boolean;
};

type FilterData = {
  filter_identifier: number;

  establishment_filter_active: boolean;
  establishments: Establishment[];
  select_all_establishments: boolean;

  activity_filter_active: boolean;
  meta_activities: MetaActivity[];
  select_all_activities: boolean;

  payment_pack_filter_active: boolean;
  payment_packs: PaymentPack[];
  select_all_payment_packs: boolean;

  coach_filter_active: boolean;
  coaches: CoachDetailed[];
  select_all_coaches: boolean;

  value: number;
  value_second: number;

  date_filter_active: boolean;
  date_filter_type: number;
  date: string;
  date_second: string;

  duration: number;
  duration_second: number;

  hour_filter_active: boolean;
  hour: string;
  hour_second: string;

  attendance_filter_active: boolean;
  attendance: boolean;

  level_filter_active: boolean;
  level: number[];

  is_v2: boolean;
};

type WarningItem =
  | Establishment
  | MetaActivity
  | PaymentPack
  | CoachDetailed
  | number;

type OwnProps = {
  filter_data: FilterData;
  establishments: Establishment[];
  meta_activities: MetaActivity[];
  onChange: (dict: Partial<FilterData>) => void;
  isNew: boolean;
  payment_packs: PaymentPack[];
  coaches: CoachDetailed[];
  fetchBulkItems: FetchBulkItemsType;
  fetchItems: FetchItemsType;
  setNotNullableData: (data: string[]) => void;
  renderSelectorWarning: (
    text: string,
    active: boolean,
    items: WarningItem[],
  ) => void;
  renderAttendanceSelectorWarning: (active: boolean, value?: boolean) => void;
  customLevels: Level[];
};

const BookingsNumberFilterV2: React.FC<OwnProps> = ({
  filter_data,
  isNew,
  onChange,
  payment_packs,
  coaches,
  meta_activities,
  establishments,
  customLevels,
  fetchItems,
  fetchBulkItems,
  setNotNullableData,
  renderAttendanceSelectorWarning,
  renderSelectorWarning,
}) => {
  const { t } = useTranslation('smartList');
  const classes = useStyles();

  React.useEffect(() => {
    if (!filter_data) return;
    if (filter_data.meta_activities?.length === 1) {
      fetchBulkItems.meta_activities(
        filter_data.meta_activities.map((metaActivity) => metaActivity.id),
      );
    }
    if (filter_data.establishments?.length === 1) {
      fetchBulkItems.establishments(
        filter_data.establishments.map((establishment) => establishment.id),
      );
    }
    if (filter_data.coaches?.length === 1) {
      fetchBulkItems.coaches(filter_data.coaches.map((coach) => coach.id));
    }
    if (filter_data.payment_packs?.length === 1) {
      fetchBulkItems.payment_packs(
        filter_data.payment_packs.map((paymentPack) => paymentPack.id),
      );
    }
  }, [
    fetchBulkItems,
    filter_data,
    filter_data.coaches,
    filter_data.establishments,
    filter_data.meta_activities,
    filter_data.payment_packs,
  ]);

  React.useEffect(() => {
    setNotNullableData(['value']);
  }, [setNotNullableData]);

  React.useEffect(() => {
    if (isNew) {
      onChange({
        establishments: [],
        meta_activities: [],
        payment_packs: [],
        coaches: [],
        value: 1,
        value_second: 2,
        date: DateTime.now().toISODate(),
        date_second: DateTime.now().toISODate(),
        duration: 5,
        duration_second: 6,
        date_filter_type: DATE_BETWEEN,
        date_filter_active: false,
        establishment_filter_active: false,
        activity_filter_active: false,
        hour: '08:00',
        hour_second: '18:00',
        hour_filter_active: false,
        attendance_filter_active: false,
        attendance: true,
      });
    }
  }, [isNew, onChange]);

  const getEstablishmentGroupByAddress = React.useCallback(
    (establishmentList: Establishment[]) => {
      const establishmentGroupByAddress = establishmentList.reduce<
        { identifier: string; itemsList: Establishment[] }[]
      >((accumulator, establishmentItem) => {
        const groupIndex = accumulator.findIndex(
          (group) => group.identifier === establishmentItem.location.address,
        );
        if (groupIndex === -1) {
          accumulator.push({
            identifier: establishmentItem.location.address,
            itemsList: [establishmentItem],
          });
        } else {
          accumulator[groupIndex].itemsList.push(establishmentItem);
        }
        return accumulator;
      }, []);
      return establishmentGroupByAddress;
    },
    [],
  );

  const levelItems: LevelItem[] = React.useMemo(
    () =>
      customLevels?.map((level) => ({
        id: level.id,
        text: getLevelTranslation(level.id, level.name, t),
        disabled: !level.enabled,
      })) ?? [],
    [customLevels, t],
  );

  const renderCheckBoxSelectorItem = React.useCallback(
    (item: LevelItem) => <ListItemText primary={item?.text} />,
    [],
  );

  const handleOnChangeCheckboxSelector = React.useCallback(
    (selectedItems: number[]) => {
      onChange({ level: selectedItems });
    },
    [onChange],
  );

  const handleNumberChange = React.useCallback(
    (event: ChangeEvent<{ value: string }>) => {
      onChange({
        value:
          event.target.value !== '' &&
          Math.max(parseInt(event.target.value, 10), 1),
      });
    },
    [onChange],
  );

  const handleAttendanceFilterChange = React.useCallback(
    () =>
      onChange({
        attendance_filter_active: !filter_data.attendance_filter_active,
      }),
    [filter_data.attendance_filter_active, onChange],
  );

  const handleAttendanceValueChange = React.useCallback(
    (event: ChangeEvent<{ value: boolean }>) =>
      onChange({ attendance: event.target.value }),
    [onChange],
  );

  const handleEstablishmentFilterChange = React.useCallback(
    () =>
      onChange({
        establishment_filter_active: !filter_data.establishment_filter_active,
      }),
    [filter_data.establishment_filter_active, onChange],
  );

  const handleEstablishmentsChange = React.useCallback(
    (items: Establishment[], selectAll: boolean) => {
      if (
        filter_data.establishments &&
        !(
          items.length === filter_data.establishments.length &&
          [...items].sort().every((value, index) => {
            return value === [...filter_data.establishments].sort()[index];
          })
        )
      ) {
        onChange({
          establishments: items,
          select_all_establishments: selectAll,
        });
      }
      if (!filter_data.establishments && items.length > 0) {
        onChange({
          establishments: items,
          select_all_establishments: selectAll,
        });
      }
    },
    [filter_data.establishments, onChange],
  );

  const handleCoachFilterChange = React.useCallback(
    () =>
      onChange({
        coach_filter_active: !filter_data.coach_filter_active,
      }),
    [filter_data.coach_filter_active, onChange],
  );

  const handleCoachesChange = React.useCallback(
    (items: CoachDetailed[], selectAll: boolean) => {
      if (
        filter_data.coaches &&
        !(
          items.length === filter_data.coaches.length &&
          [...items].sort().every((value, index) => {
            return value === [...filter_data.coaches].sort()[index];
          })
        )
      ) {
        onChange({ coaches: items, select_all_coaches: selectAll });
      }
      if (!filter_data.coaches && items.length > 0) {
        onChange({ coaches: items, select_all_coaches: selectAll });
      }
    },
    [filter_data.coaches, onChange],
  );

  const handlePaymentPackFilterChange = React.useCallback(
    () =>
      onChange({
        payment_pack_filter_active: !filter_data.payment_pack_filter_active,
      }),
    [filter_data.payment_pack_filter_active, onChange],
  );

  const handlePaymentPacksChange = React.useCallback(
    (items: PaymentPack[], selectAll: boolean) => {
      if (
        filter_data.payment_packs &&
        !(
          items.length === filter_data.payment_packs.length &&
          [...items].sort().every((value, index) => {
            return value === [...filter_data.payment_packs].sort()[index];
          })
        )
      ) {
        onChange({
          payment_packs: items,
          select_all_payment_packs: selectAll,
        });
      }
      if (!filter_data.payment_packs && items.length > 0) {
        onChange({
          payment_packs: items,
          select_all_payment_packs: selectAll,
        });
      }
    },
    [filter_data.payment_packs, onChange],
  );

  const handleActivityFilterChange = React.useCallback(
    () =>
      onChange({
        activity_filter_active: !filter_data.activity_filter_active,
      }),
    [filter_data.activity_filter_active, onChange],
  );

  const handleActivitiesChange = React.useCallback(
    (items: MetaActivity[], selectAll: boolean) => {
      if (
        filter_data.meta_activities &&
        !(
          items.length === filter_data.meta_activities.length &&
          [...items].sort().every((value, index) => {
            return value === [...filter_data.meta_activities].sort()[index];
          })
        )
      ) {
        onChange({
          meta_activities: items,
          select_all_activities: selectAll,
        });
      }
      if (!filter_data.meta_activities && items.length > 0) {
        onChange({
          meta_activities: items,
          select_all_activities: selectAll,
        });
      }
    },
    [filter_data.meta_activities, onChange],
  );

  const handleLevelFilterChange = React.useCallback(
    () =>
      onChange({
        level_filter_active: !filter_data.level_filter_active,
      }),
    [filter_data.level_filter_active, onChange],
  );

  const handleDateFilterChange = React.useCallback(
    () =>
      onChange({
        date_filter_active: !filter_data.date_filter_active,
      }),
    [filter_data.date_filter_active, onChange],
  );

  const handleHourFilterChange = React.useCallback(
    () =>
      onChange({
        hour_filter_active: !filter_data.hour_filter_active,
      }),
    [filter_data.hour_filter_active, onChange],
  );

  const handleHourValueChange = React.useCallback(
    (event: ChangeEvent<{ value: string }>) =>
      onChange({
        hour: event.target.value,
      }),
    [onChange],
  );

  const handleHourSecondValueChange = React.useCallback(
    (event: ChangeEvent<{ value: string }>) =>
      onChange({
        hour_second: event.target.value,
      }),
    [onChange],
  );

  return (
    <div>
      <div className={classes.wrapper}>
        {t(`filters.${filter_data.filter_identifier}.first_v2`)}
        <div className={classes.numericInput}>
          <DelayedNumericInput
            isPositive
            InputProps={{ InputProps: { min: 0 } }}
            onChange={handleNumberChange}
            value={filter_data.value}
          />
        </div>
        {t(`filters.${filter_data.filter_identifier}.second_singular_v2`, {
          count: 1,
          ordinal: true,
        })}
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          required
          checked={
            filter_data.attendance_filter_active === undefined
              ? false
              : filter_data.attendance_filter_active
          }
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleAttendanceFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.attendance_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          {t(`filters.${filter_data.filter_identifier}.attendance`)}
          <Select
            required
            className={classes.input}
            onChange={handleAttendanceValueChange}
            value={
              filter_data.attendance === undefined || filter_data.attendance
                ? 'true'
                : 'false'
            }
          >
            <MenuItem value="true">{t('filters.attendanceTrue')}</MenuItem>
            <MenuItem value="false">{t('filters.attendanceFalse')}</MenuItem>
          </Select>
          {renderAttendanceSelectorWarning(
            filter_data.attendance_filter_active,
            filter_data.attendance,
          )}
        </div>
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          checked={filter_data.establishment_filter_active}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleEstablishmentFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.establishment_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          {t(`filters.${filter_data.filter_identifier}.establishment.first`)}
          <Selector
            fetchItems={fetchItems.establishments}
            groupItemIcon={<LocationOnIcon color="primary" />}
            groupItemsFunction={getEstablishmentGroupByAddress}
            helperAllSelectedText={t(
              'multiSelector.establishments.helperAllSelectedText',
            )}
            helperSelectedText={t(
              'multiSelector.establishments.helperSelectedText',
            )}
            helperText={t('multiSelector.establishments.helperText')}
            items={establishments}
            nameIdentifier="title"
            onChange={handleEstablishmentsChange}
            renderItem={(item: Establishment) => (
              <EstablishmentListItem establishment={item} />
            )}
            selectAll={filter_data.select_all_establishments}
            selectedItems={filter_data.establishments}
            textFieldPlaceholder={t(
              'multiSelector.establishments.textFieldPlaceholder',
            )}
          />
          {renderSelectorWarning(
            t('multiSelector.establishments.warning'),
            filter_data.establishment_filter_active,
            filter_data.establishments,
          )}
        </div>
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          checked={filter_data.coach_filter_active}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleCoachFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.coach_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          {t(`filters.${filter_data.filter_identifier}.coach.first`)}
          <Selector
            fetchItems={fetchItems.coaches}
            helperAllSelectedText={t(
              'multiSelector.coaches.helperAllSelectedText',
            )}
            helperSelectedText={t('multiSelector.coaches.helperSelectedText')}
            helperText={t('multiSelector.coaches.helperText')}
            items={coaches}
            nameIdentifier="name"
            onChange={handleCoachesChange}
            renderItem={(item: CoachDetailed) => (
              <CoachListItem clearIcon coach={item} />
            )}
            selectAll={filter_data.select_all_coaches}
            selectedItems={filter_data.coaches}
            textFieldPlaceholder={t(
              'multiSelector.coaches.textFieldPlaceholder',
            )}
          />
          {renderSelectorWarning(
            t('multiSelector.coaches.warning'),
            filter_data.coach_filter_active,
            filter_data.coaches,
          )}
        </div>
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          checked={filter_data.payment_pack_filter_active}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handlePaymentPackFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.payment_pack_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          {t(`filters.${filter_data.filter_identifier}.payment_pack.first`)}
          <Selector
            fetchItems={fetchItems.payment_packs}
            helperAllSelectedText={t(
              'multiSelector.paymentPacks.helperAllSelectedText',
            )}
            helperSelectedText={t(
              'multiSelector.paymentPacks.helperSelectedText',
            )}
            helperText={t('multiSelector.paymentPacks.helperText')}
            items={payment_packs}
            nameIdentifier="name"
            onChange={handlePaymentPacksChange}
            renderItem={(item: PaymentPack) => (
              <PaymentPackListItem pack={item} />
            )}
            selectAll={filter_data.select_all_payment_packs}
            selectedItems={filter_data.payment_packs}
            textFieldPlaceholder={t(
              'multiSelector.paymentPacks.textFieldPlaceholder',
            )}
          />{' '}
          {renderSelectorWarning(
            t('multiSelector.paymentPacks.warning'),
            filter_data.payment_pack_filter_active,
            filter_data.payment_packs,
          )}
        </div>
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          checked={filter_data.activity_filter_active}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleActivityFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.activity_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          {t(`filters.${filter_data.filter_identifier}.activity.first`)}
          <Selector
            fetchItems={fetchItems.meta_activities}
            helperSelectedText={t(
              'multiSelector.metaActivities.helperSelectedText',
            )}
            helperText={t('multiSelector.metaActivities.helperText')}
            items={meta_activities}
            nameIdentifier="name"
            onChange={handleActivitiesChange}
            renderItem={(item: MetaActivity) => (
              <MetaActivityListItem metaActivity={item} />
            )}
            selectAll={filter_data.select_all_activities}
            selectedItems={filter_data.meta_activities}
            textFieldPlaceholder={t(
              'multiSelector.metaActivities.textFieldPlaceholder',
            )}
          />
          {renderSelectorWarning(
            t('multiSelector.metaActivities.warning'),
            filter_data.activity_filter_active,
            filter_data.meta_activities,
          )}
        </div>
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          checked={filter_data.level_filter_active}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleLevelFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.level_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          <div className={classes.levelTypo}>
            {t(`filters.${filter_data.filter_identifier}.level.first`)}
          </div>
          <CheckboxSelector
            helperText={t('multiSelector.level.select')}
            items={levelItems}
            labelName="text"
            onChange={handleOnChangeCheckboxSelector}
            renderItem={renderCheckBoxSelectorItem}
            selectedItems={filter_data.level}
          />
          {renderSelectorWarning(
            t('multiSelector.level.warning'),
            filter_data.level_filter_active,
            filter_data.level,
          )}
        </div>
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          checked={filter_data.date_filter_active}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleDateFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.date_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          {t(`filters.${filter_data.filter_identifier}.date.first`)}
          <CalendarPicker
            // @ts-expect-error
            blockValidateOnClickAway
            className={classes.calendar}
            filter_data={filter_data}
            onChange={onChange}
          />
        </div>
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          checked={filter_data.hour_filter_active}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleHourFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.hour_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          {t(`filters.${filter_data.filter_identifier}.hour.first`)}
          <TextField
            required
            className={classes.hourPicker}
            onChange={handleHourValueChange}
            style={{ minWidth: 60 }}
            type="time"
            value={filter_data.hour}
          />
          {t(`filters.${filter_data.filter_identifier}.hour.second`)}
          <TextField
            required
            className={classes.hourPicker}
            onChange={handleHourSecondValueChange}
            style={{ minWidth: 60 }}
            type="time"
            value={filter_data.hour_second}
          />
          {t(`filters.${filter_data.filter_identifier}.hour.third`)}
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  hourPicker: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  calendarAntiMargin: {
    marginLeft: theme.spacing(-1),
  },
  numericInput: {
    maxWidth: theme.spacing(9),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  disabled: {
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    background: '#f1f1f1',
    borderRadius: '7px',
    paddingLeft: theme.spacing(1),
  },
  inlineContainer: { display: 'flex', alignItems: 'center' },
  tooltip: {
    backgroundColor: theme.palette.common.white,

    fontSize: 11,
  },
  selectorGrow: {
    flexGrow: 0,
  },
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textInput: {
    width: '50px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  datePicker: {
    width: '160px',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  selector: {
    minWidth: '300px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  levelTypo: {
    marginRight: theme.spacing(1),
  },
  calendar: {
    marginLeft: theme.spacing(1),
  },
}));

export default React.memo(BookingsNumberFilterV2);
