// @flow

import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { DateTime } from 'luxon';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';
import {
  DURATION_COMPARATORS_DICT_BETWEEN,
  BETWEEN_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';
import { getLevelTranslation } from '#src/libs/level/utils';
import { Level } from '#src/libs/level/types';
import CheckboxSelector from '../CheckboxSelector.component';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';

import MetaActivityListItem from '../../../meta-activity/components/MetaActivityListItem.component';
import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';
import Selector from '../MultiSelector.component';
import CalendarPicker from '../CalendarPicker.component';
import { Establishment } from '../../../establishment/types';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';
import CoachListItem from '../../../associated-coach/components/CoachListItemBasic.component';

type LevelItem = {
  id: string | number,
  text: string,
  disabled: boolean,
};

type Props = {
  filter_data: any,
  t: TFunction,
  establishments: Array<Establishment>,
  meta_activities: Array<any>,
  classes: Object,
  onChange: (any) => void,
  fetchItems: any,
  isNew: boolean,
  fetchBulkItems: any,
  payment_packs: Array<any>,
  coaches: Array<any>,
  setNotNullableData: (data: Array<string>) => void,
  renderSelectorWarning: (string, boolean) => void,
  renderAttendanceSelectorWarning: (string, boolean) => void,
  customLevels: Level[],
};

export class BookingsNumberFilter extends Component<Props, state> {
  componentDidMount() {
    const { meta_activities, establishments, payment_packs, coaches } =
      this.props.filter_data;
    if (meta_activities && meta_activities.length === 1) {
      this.props.fetchBulkItems.meta_activities(meta_activities);
    }
    if (coaches && coaches.length === 1) {
      this.props.fetchBulkItems.coaches(coaches);
    }
    if (establishments && establishments.length === 1) {
      this.props.fetchBulkItems.establishments(establishments);
    }
    if (payment_packs && payment_packs.length === 1) {
      this.props.fetchBulkItems.payment_packs(payment_packs);
    }
    this.props.setNotNullableData(['comparator', 'value']);
    if (this.props.isNew) {
      this.props.onChange({
        establishments: [],
        meta_activities: [],
        payment_packs: [],
        coaches: [],
        coach_filter_active: false,
        payment_pack_filter_active: false,
        comparator: 2,
        value: 1,
        value_second: 2,
        date: DateTime.now().toISODate(),
        date_second: DateTime.now().toISODate(),
        duration: -5,
        duration_second: -10,
        date_filter_type: 0,
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
  }

  getEstablishmentGroupByAddres = (establishmentList: Array<Establishment>) => {
    const establishmentGourpByAddress = establishmentList.reduce(
      (accumulator, establishmentItem) => {
        const temp = accumulator.findIndex(
          (group) => group.identifier === establishmentItem.location.address,
        );
        if (temp === -1) {
          accumulator.push({
            identifier: establishmentItem.location.address,
            itemsList: [establishmentItem],
          });
        } else {
          accumulator[temp].itemsList.push(establishmentItem);
        }
        return accumulator;
      },
      [],
    );
    return establishmentGourpByAddress;
  };

  render() {
    const {
      filter_data,
      t,
      classes,
      onChange,
      meta_activities,
      establishments,
      payment_packs,
      coaches,
      customLevels,
    } = this.props;

    const levelItems: LevelItem[] =
      customLevels?.map((level) => ({
        id: level.id,
        text: getLevelTranslation(level.id, level.name, this.props.t),
        disabled: !level.enabled,
      })) ?? [];

    const renderCheckBoxSelectorItem = (item: LevelItem) => {
      return <ListItemText primary={item?.text} />;
    };

    const handleOnChangeCheckboxSelector = (selectedItems: number[]) => {
      onChange({ level: selectedItems });
    };

    return (
      <div>
        <div className={classes.wrapper}>
          {this.props.t(`filters.${filter_data.filter_identifier}.first`)}
          <Select
            required
            className={classes.input}
            onChange={(ev) => onChange({ comparator: ev.target.value })}
            value={filter_data.comparator}
          >
            {DURATION_COMPARATORS_DICT_BETWEEN.map((item) => (
              <MenuItem key={item.key} value={item.value}>
                {t(`filters.durations_comparators.${item.value}`)}
              </MenuItem>
            ))}
          </Select>
          <DelayedNumericInput
            classes={classes}
            InputProps={{ inputProps: { min: 0 } }}
            onChange={(ev) =>
              onChange({
                value: ev.target.value === '' ? null : ev.target.value,
              })
            }
            value={filter_data.value}
          />{' '}
          {filter_data.comparator === BETWEEN_COMPARATOR
            ? t(`filters.${filter_data.filter_identifier}.between`)
            : null}
          {filter_data.comparator === BETWEEN_COMPARATOR ? (
            <DelayedNumericInput
              classes={classes}
              onChange={(ev) =>
                onChange({
                  value_second: ev.target.value === '' ? null : ev.target.value,
                })
              }
              value={filter_data.value_second}
            />
          ) : null}
          {this.props.t(`filters.${filter_data.filter_identifier}.second`)}
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
            onChange={() =>
              onChange({
                attendance_filter_active: !filter_data.attendance_filter_active,
              })
            }
            value="checkedA"
          />
          <div
            className={
              filter_data.attendance_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.attendance`,
            )}
            <Select
              required
              className={classes.input}
              onChange={(ev) => onChange({ attendance: ev.target.value })}
              value={
                filter_data.attendance === undefined
                  ? true
                  : filter_data.attendance
              }
            >
              <MenuItem value>{t('filters.attendanceTrue')}</MenuItem>
              <MenuItem value={false}>{t('filters.attendanceFalse')}</MenuItem>
            </Select>
            {this.props.renderAttendanceSelectorWarning(
              filter_data.attendance_filter_active,
              filter_data.attendance,
            )}
          </div>
        </div>
        <div className={classes.inlineContainer}>
          <Switch
            checked={filter_data.establishment_filter_active}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            onChange={() =>
              onChange({
                establishment_filter_active:
                  !filter_data.establishment_filter_active,
              })
            }
            value="checkedA"
          />
          <div
            className={
              filter_data.establishment_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.establishment.first`,
            )}
            <Selector
              fetchItems={this.props.fetchItems.establishments}
              groupItemIcon={<LocationOnIcon color="primary" />}
              groupItemsFunction={this.getEstablishmentGroupByAddres}
              helperAllSelectedText={t(
                'multiSelector.establishments.helperAllSelectedText',
              )}
              helperSelectedText={t(
                'multiSelector.establishments.helperSelectedText',
              )}
              helperText={t('multiSelector.establishments.helperText')}
              items={establishments}
              nameIdentifier="title"
              onChange={(items, selectAll) => {
                if (
                  filter_data.establishments &&
                  !(
                    items.length === filter_data.establishments.length &&
                    [...items].sort().every((value, index) => {
                      return (
                        value === [...filter_data.establishments].sort()[index]
                      );
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
              }}
              renderItem={(item) => (
                <EstablishmentListItem establishment={item} />
              )}
              selectAll={this.props.filter_data.select_all_establishments}
              selectedItems={filter_data.establishments}
              textFieldPlaceholder={t(
                'multiSelector.establishments.textFieldPlaceholder',
              )}
            />
            {this.props.renderSelectorWarning(
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
            onChange={() =>
              onChange({
                coach_filter_active: !filter_data.coach_filter_active,
              })
            }
            value="checkedA"
          />
          <div
            className={
              filter_data.coach_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.coach.first`,
            )}
            <Selector
              fetchItems={this.props.fetchItems.coaches}
              helperAllSelectedText={t(
                'multiSelector.coaches.helperAllSelectedText',
              )}
              helperSelectedText={t('multiSelector.coaches.helperSelectedText')}
              helperText={t('multiSelector.coaches.helperText')}
              items={coaches}
              nameIdentifier="name"
              onChange={(items, selectAll) => {
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
              }}
              renderItem={(item) => {
                return <CoachListItem coach={item} />;
              }}
              selectAll={this.props.filter_data.select_all_coaches}
              selectedItems={filter_data.coaches}
              textFieldPlaceholder={t(
                'multiSelector.coaches.textFieldPlaceholder',
              )}
            />
            {this.props.renderSelectorWarning(
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
            onChange={() =>
              onChange({
                payment_pack_filter_active:
                  !filter_data.payment_pack_filter_active,
              })
            }
            value="checkedA"
          />{' '}
          <div
            className={
              filter_data.payment_pack_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.payment_pack.first`,
            )}
            <Selector
              fetchItems={this.props.fetchItems.payment_packs}
              helperAllSelectedText={t(
                'multiSelector.paymentPacks.helperAllSelectedText',
              )}
              helperSelectedText={t(
                'multiSelector.paymentPacks.helperSelectedText',
              )}
              helperText={t('multiSelector.paymentPacks.helperText')}
              items={payment_packs}
              nameIdentifier="name"
              onChange={(items, selectAll) => {
                if (
                  filter_data.payment_packs &&
                  !(
                    items.length === filter_data.payment_packs.length &&
                    [...items].sort().every((value, index) => {
                      return (
                        value === [...filter_data.payment_packs].sort()[index]
                      );
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
              }}
              renderItem={(item) => {
                return <PaymentPackListItem pack={item} />;
              }}
              selectAll={this.props.filter_data.select_all_payment_packs}
              selectedItems={filter_data.payment_packs}
              textFieldPlaceholder={t(
                'multiSelector.paymentPacks.textFieldPlaceholder',
              )}
            />{' '}
            {this.props.renderSelectorWarning(
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
            onChange={() =>
              onChange({
                activity_filter_active: !filter_data.activity_filter_active,
              })
            }
            value="checkedA"
          />
          <div
            className={
              filter_data.activity_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.activity.first`,
            )}
            <Selector
              fetchItems={this.props.fetchItems.meta_activities}
              helperAllSelectedText={t(
                'multiSelector.metaActivities.helperAllSelectedText',
              )}
              helperSelectedText={t(
                'multiSelector.metaActivities.helperSelectedText',
              )}
              helperText={t('multiSelector.metaActivities.helperText')}
              items={meta_activities}
              nameIdentifier="name"
              onChange={(items, selectAll) => {
                if (
                  filter_data.meta_activities &&
                  !(
                    items.length === filter_data.meta_activities.length &&
                    [...items].sort().every((value, index) => {
                      return (
                        value === [...filter_data.meta_activities].sort()[index]
                      );
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
              }}
              renderItem={(item) => {
                return <MetaActivityListItem metaActivity={item} />;
              }}
              selectAll={this.props.filter_data.select_all_activities}
              selectedItems={filter_data.meta_activities}
              textFieldPlaceholder={t(
                'multiSelector.metaActivities.textFieldPlaceholder',
              )}
            />
            {this.props.renderSelectorWarning(
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
            onChange={() =>
              onChange({
                level_filter_active: !filter_data.level_filter_active,
              })
            }
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
              {this.props.t(
                `filters.${filter_data.filter_identifier}.level.first`,
              )}
            </div>
            <CheckboxSelector
              filterItemsCallback={(l) => l.enabled}
              helperText={t('multiSelector.level.select')}
              items={levelItems}
              labelName="text"
              onChange={handleOnChangeCheckboxSelector}
              renderItem={renderCheckBoxSelectorItem}
              selectedItems={filter_data.level}
            />
            {this.props.renderSelectorWarning(
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
            onChange={() =>
              onChange({
                date_filter_active: !filter_data.date_filter_active,
              })
            }
            value="checkedA"
          />
          <div
            className={
              filter_data.date_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.date.first`,
            )}
            <CalendarPicker
              blockValidateOnClickAway
              filter_data={filter_data}
              onChange={onChange}
            />
          </div>
        </div>
        <div className={classes.inlineContainer}>
          <Switch
            checked={filter_data.hour_filter_active}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            onChange={() =>
              onChange({
                hour_filter_active: !filter_data.hour_filter_active,
              })
            }
            value="checkedA"
          />
          <div
            className={
              filter_data.hour_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.hour.first`,
            )}
            <TextField
              required
              className={classes.hourPicker}
              onChange={(ev) =>
                onChange({
                  hour: ev.target.value,
                })
              }
              style={{ minWidth: 60 }}
              type="time"
              value={filter_data.hour}
            />
            {this.props.t(
              `filters.${filter_data.filter_identifier}.hour.second`,
            )}
            <TextField
              required
              className={classes.hourPicker}
              onChange={(ev) =>
                onChange({
                  hour_second: ev.target.value,
                })
              }
              style={{ minWidth: 60 }}
              type="time"
              value={filter_data.hour_second}
            />
            {this.props.t(
              `filters.${filter_data.filter_identifier}.hour.third`,
            )}
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  calendarAntiMargin: {
    marginLeft: theme.spacing(-1),
  },
  hourPicker: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
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
  levelTypo: { marginRight: theme.spacing(1) },
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(BookingsNumberFilter);
