// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import moment from 'moment-timezone';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ListItemText from '@material-ui/core/ListItemText';
import LEVELS from '@bsport/common/lib/master-data/levels';
import MetaActivityListItem from '../../../meta-activity/components/MetaActivityListItem.component';
import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';
import Selector from '../MultiSelector.component';
import CheckboxSelector from '../CheckboxSelector.component';

import CalendarPicker from '../CalendarPicker.component';
import { Establishment } from '../../../establishment/types';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';

import CoachListItem from '../../../associated-coach/components/CoachListItemBasic.component';

const DATE_BETWEEN = 2;

type Props = {
  filter_data: any,
  t: TFunction,
  establishments: Array<Establishment>,
  meta_activities: Array<any>,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
  payment_packs: Array<any>,
  coaches: Array<any>,
  fetchBulkItems: any,
  fetchItems: any,
  setNotNullableData: (Array<string>) => void,
  renderSelectorWarning: (string, boolean) => void,
  renderAttendanceSelectorWarning: (string, boolean | null) => void,
};

export class BookingsNumberFilter extends Component<Props, state> {
  componentDidMount() {
    const {
      meta_activities,
      establishments,
      coaches,
      payment_packs,
    } = this.props.filter_data;
    if (meta_activities && meta_activities.length === 1) {
      this.props.fetchBulkItems.meta_activities(meta_activities);
    }
    if (establishments && establishments.length === 1) {
      this.props.fetchBulkItems.establishments(establishments);
    }
    if (coaches && coaches.length === 1) {
      this.props.fetchBulkItems.coaches(coaches);
    }
    if (payment_packs && payment_packs.length === 1) {
      this.props.fetchBulkItems.payment_packs(payment_packs);
    }
    this.props.setNotNullableData(['value']);
    if (this.props.new) {
      this.props.onChange({
        establishments: [],
        meta_activities: [],
        payment_packs: [],
        coaches: [],
        value: 1,
        value_second: 2,
        date: moment().format('YYYY-MM-DD'),
        date_second: moment().format('YYYY-MM-DD'),
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
      payment_packs,
      coaches,
      meta_activities,
      establishments,
    } = this.props;
    return (
      <div>
        <div className={classes.wrapper}>
          {this.props.t(`filters.${filter_data.filter_identifier}.first`)}
          <DelayedNumericInput
            classes={classes}
            value={filter_data.value}
            onChange={(ev) => {
              onChange({
                value:
                  ev.target.value === ''
                    ? null
                    : Math.max(parseInt(ev.target.value, 10), 1),
              });
            }}
          />
          {filter_data.value === '1' || filter_data.value === 1
            ? this.props.t(
                `filters.${filter_data.filter_identifier}.second_singular`,
              )
            : this.props.t(
                `filters.${filter_data.filter_identifier}.second_plural`,
              )}
        </div>
        <div className={classes.inlineContainer}>
          <Switch
            checked={
              filter_data.attendance_filter_active === undefined
                ? false
                : filter_data.attendance_filter_active
            }
            onChange={() =>
              onChange({
                attendance_filter_active: !filter_data.attendance_filter_active,
              })
            }
            value="checkedA"
            required
            inputProps={{ 'aria-label': 'secondary checkbox' }}
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
              className={classes.input}
              required
              value={
                filter_data.attendance === undefined
                  ? true
                  : filter_data.attendance
              }
              onChange={(ev) => onChange({ attendance: ev.target.value })}
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
            onChange={() =>
              onChange({
                establishment_filter_active: !filter_data.establishment_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
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
              helperText={t('multiSelector.establishments.helperText')}
              helperSelectedText={t(
                'multiSelector.establishments.helperSelectedText',
              )}
              textFieldPlaceholder={t(
                'multiSelector.establishments.textFieldPlaceholder',
              )}
              helperAllSelectedText={t(
                'multiSelector.establishments.helperAllSelectedText',
              )}
              groupItemsFunction={this.getEstablishmentGroupByAddres}
              groupItemIcon={<LocationOnIcon color="primary" />}
              renderItem={(item) => {
                return <EstablishmentListItem establishment={item} />;
              }}
              selectAll={this.props.filter_data.select_all_establishments}
              nameIdentifier="title"
              fetchItems={this.props.fetchItems.establishments}
              items={establishments}
              selectedItems={filter_data.establishments}
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
            onChange={() =>
              onChange({
                coach_filter_active: !filter_data.coach_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
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
              helperText={t('multiSelector.coaches.helperText')}
              helperSelectedText={t('multiSelector.coaches.helperSelectedText')}
              textFieldPlaceholder={t(
                'multiSelector.coaches.textFieldPlaceholder',
              )}
              helperAllSelectedText={t(
                'multiSelector.coaches.helperAllSelectedText',
              )}
              selectAll={this.props.filter_data.select_all_coaches}
              fetchItems={this.props.fetchItems.coaches}
              renderItem={(item) => {
                return <CoachListItem coach={item} />;
              }}
              nameIdentifier="name"
              items={coaches}
              selectedItems={filter_data.coaches}
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
            onChange={() =>
              onChange({
                payment_pack_filter_active: !filter_data.payment_pack_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
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
              helperText={t('multiSelector.paymentPacks.helperText')}
              helperSelectedText={t(
                'multiSelector.paymentPacks.helperSelectedText',
              )}
              textFieldPlaceholder={t(
                'multiSelector.paymentPacks.textFieldPlaceholder',
              )}
              renderItem={(item) => {
                return <PaymentPackListItem pack={item} />;
              }}
              helperAllSelectedText={t(
                'multiSelector.paymentPacks.helperAllSelectedText',
              )}
              fetchItems={this.props.fetchItems.payment_packs}
              nameIdentifier="name"
              selectAll={this.props.filter_data.select_all_payment_packs}
              items={payment_packs}
              selectedItems={filter_data.payment_packs}
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
            onChange={() =>
              onChange({
                activity_filter_active: !filter_data.activity_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
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
              helperText={t('multiSelector.metaActivities.helperText')}
              helperSelectedText={t(
                'multiSelector.metaActivities.helperSelectedText',
              )}
              textFieldPlaceholder={t(
                'multiSelector.metaActivities.textFieldPlaceholder',
              )}
              renderItem={(item) => {
                return <MetaActivityListItem metaActivity={item} />;
              }}
              selectAll={this.props.filter_data.select_all_activities}
              nameIdentifier="name"
              items={meta_activities}
              fetchItems={this.props.fetchItems.meta_activities}
              selectedItems={filter_data.meta_activities}
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
            onChange={() =>
              onChange({
                level_filter_active: !filter_data.level_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
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
              items={LEVELS.map((level) => ({
                id: level.id,
                text: t(`multiSelector.level.${level.text}`),
              }))}
              renderItem={(item) => <ListItemText primary={item.text} />}
              onChange={(item) => {
                onChange({ level: item });
              }}
              selectedItems={filter_data.level}
              labelName="text"
              helperText={t('multiSelector.level.select')}
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
            onChange={() =>
              onChange({
                date_filter_active: !filter_data.date_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
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
            <CalendarPicker filter_data={filter_data} onChange={onChange} />
          </div>
        </div>
        <div className={classes.inlineContainer}>
          <Switch
            checked={filter_data.hour_filter_active}
            onChange={() =>
              onChange({
                hour_filter_active: !filter_data.hour_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
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
              style={{ minWidth: 60 }}
              type="time"
              value={filter_data.hour}
              onChange={(ev) =>
                onChange({
                  hour: ev.target.value,
                })
              }
              required
              className={classes.hourPicker}
            />
            {this.props.t(
              `filters.${filter_data.filter_identifier}.hour.second`,
            )}
            <TextField
              style={{ minWidth: 60 }}
              type="time"
              value={filter_data.hour_second}
              onChange={(ev) =>
                onChange({
                  hour_second: ev.target.value,
                })
              }
              required
              className={classes.hourPicker}
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
  hourPicker: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  calendarAntiMargin: {
    marginLeft: theme.spacing(-1),
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
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(BookingsNumberFilter);
