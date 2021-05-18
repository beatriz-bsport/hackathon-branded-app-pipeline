// @flow

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

import Switch from '@material-ui/core/Switch';
import moment from 'moment-timezone';
import TextField from '@material-ui/core/TextField';

import {
  DURATION_COMPARATORS_DICT_BETWEEN,
  BETWEEN_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';

import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';
import Selector from '../MultiSelector.component';
import CalendarPicker from '../CalendarPicker.component';
import { Establishment } from '../../../establishment/types';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';
import CoachListItem from '../../../associated-coach/components/CoachListItemBasic.component';
import PrivatePassListItem from '../../../private-service/components/pass/PrivatePassListItem.component';
import type { PrivatePass } from '../../../private-service/types';
import { PrivateService } from '../../../private-service/types';
import PrivateServiceListItem from '../../../private-service/components/service/PrivateServiceListItem.component';

type Props = {
  filter_data: any,
  t: TFunction,
  establishments: Array<Establishment>,
  classes: Object,
  onChange: (any) => void,
  fetchItems: any,
  new: boolean,
  fetchBulkItems: any,
  private_passes: Array<PrivatePass>,
  private_services: Array<PrivateService>,
  coaches: Array<any>,
  setNotNullableData: (Array<string>) => void,
  renderSelectorWarning: (string, boolean) => void,
};

export class PrivateBookingsFilter extends Component<Props, state> {
  componentDidMount() {
    const {
      establishments,
      private_passes,
      coaches,
      private_services,
    } = this.props.filter_data;
    if (coaches && coaches.length === 1) {
      this.props.fetchBulkItems.coaches(coaches);
    }
    if (establishments && establishments.length === 1) {
      this.props.fetchBulkItems.establishments(establishments);
    }
    if (private_passes && private_passes.length === 1) {
      this.props.fetchBulkItems.private_passes(private_passes);
    }
    if (private_services && private_services.length === 1) {
      this.props.fetchBulkItems.private_services(private_services);
    }
    this.props.setNotNullableData(['comparator', 'value']);
    if (this.props.new) {
      this.props.onChange({
        at_home: false,
        establishments: [],
        private_passes: [],
        private_services: [],
        coaches: [],
        coach_filter_active: false,
        private_pass_filter_active: false,
        comparator: 2,
        value: 1,
        value_second: 2,
        date: moment().format('YYYY-MM-DD'),
        date_second: moment().format('YYYY-MM-DD'),
        duration: -5,
        duration_second: -10,
        date_filter_type: 0,
        date_filter_active: false,
        establishment_filter_active: false,
        hour: '08:00',
        hour_second: '18:00',
        hour_filter_active: false,
      });
    }
  }

  render() {
    const {
      filter_data,
      t,
      classes,
      onChange,
      establishments,
      private_passes,
      private_services,
      coaches,
    } = this.props;

    return (
      <div>
        <div className={classes.wrapper}>
          {this.props.t(`filters.${filter_data.filter_identifier}.first`)}
          <Select
            className={classes.input}
            required
            value={filter_data.comparator}
            onChange={(ev) => onChange({ comparator: ev.target.value })}
          >
            {DURATION_COMPARATORS_DICT_BETWEEN.map((item) => (
              <MenuItem key={item.key} value={item.value}>
                {t(`filters.durations_comparators.${item.value}`)}
              </MenuItem>
            ))}
          </Select>
          <DelayedNumericInput
            classes={classes}
            value={filter_data.value}
            onChange={(ev) =>
              onChange({
                value: ev.target.value === '' ? null : ev.target.value,
              })
            }
          />{' '}
          {filter_data.comparator === BETWEEN_COMPARATOR
            ? t(`filters.${filter_data.filter_identifier}.between`)
            : null}
          {filter_data.comparator === BETWEEN_COMPARATOR ? (
            <DelayedNumericInput
              classes={classes}
              value={filter_data.value_second}
              onChange={(ev) =>
                onChange({
                  value_second: ev.target.value === '' ? null : ev.target.value,
                })
              }
            />
          ) : null}
          {this.props.t(`filters.${filter_data.filter_identifier}.second`)}
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
              helperAllSelectedText={t(
                'multiSelector.establishments.helperAllSelectedText',
              )}
              textFieldPlaceholder={t(
                'multiSelector.establishments.textFieldPlaceholder',
              )}
              selectAll={this.props.filter_data.select_all_establishments}
              fetchItems={this.props.fetchItems.establishments}
              renderItem={(item) => {
                return <EstablishmentListItem establishment={item} />;
              }}
              nameIdentifier="title"
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
            {this.props.t(
              `filters.${filter_data.filter_identifier}.establishment.second`,
            )}
            <Checkbox
              checked={filter_data.at_home}
              onChange={() => onChange({ at_home: !filter_data.at_home })}
            />
            {this.props.t(
              `filters.${filter_data.filter_identifier}.establishment.third`,
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
            checked={filter_data.private_pass_filter_active}
            onChange={() =>
              onChange({
                private_pass_filter_active: !filter_data.private_pass_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />{' '}
          <div
            className={
              filter_data.private_pass_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.private_pass.first`,
            )}
            <Selector
              helperText={t('multiSelector.privatePass.helperText')}
              helperSelectedText={t(
                'multiSelector.privatePass.helperSelectedText',
              )}
              textFieldPlaceholder={t(
                'multiSelector.privatePass.textFieldPlaceholder',
              )}
              renderItem={(item) => {
                return <PrivatePassListItem pass={item} />;
              }}
              helperAllSelectedText={t(
                'multiSelector.privatePass.helperAllSelectedText',
              )}
              fetchItems={this.props.fetchItems.private_passes}
              nameIdentifier="name"
              selectAll={this.props.filter_data.select_all_private_passes}
              items={private_passes}
              selectedItems={filter_data.private_passes}
              onChange={(items, selectAll) => {
                if (
                  filter_data.private_passes &&
                  !(
                    items.length === filter_data.private_passes.length &&
                    [...items].sort().every((value, index) => {
                      return (
                        value === [...filter_data.private_passes].sort()[index]
                      );
                    })
                  )
                ) {
                  onChange({
                    private_passes: items,
                    select_all_private_passes: selectAll,
                  });
                }
                if (!filter_data.private_passes && items.length > 0) {
                  onChange({
                    private_passes: items,
                    select_all_private_passes: selectAll,
                  });
                }
              }}
            />{' '}
            {this.props.renderSelectorWarning(
              t('multiSelector.privatePass.warning'),
              filter_data.private_pass_filter_active,
              filter_data.private_passes,
            )}
          </div>
        </div>

        <div className={classes.inlineContainer}>
          <Switch
            checked={filter_data.private_service_filter_active}
            onChange={() =>
              onChange({
                private_service_filter_active: !filter_data.private_service_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />{' '}
          <div
            className={
              filter_data.private_service_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            {this.props.t(
              `filters.${filter_data.filter_identifier}.private_service.first`,
            )}
            <Selector
              helperText={t('multiSelector.privateServices.helperText')}
              helperSelectedText={t(
                'multiSelector.privateServices.helperSelectedText',
              )}
              textFieldPlaceholder={t(
                'multiSelector.privateServices.textFieldPlaceholder',
              )}
              renderItem={(item) => {
                return <PrivateServiceListItem privateService={item} />;
              }}
              helperAllSelectedText={t(
                'multiSelector.privateServices.helperAllSelectedText',
              )}
              fetchItems={this.props.fetchItems.private_services}
              nameIdentifier="name"
              selectAll={this.props.filter_data.select_all_private_services}
              items={private_services}
              selectedItems={filter_data.private_services}
              onChange={(items, selectAll) => {
                if (
                  filter_data.private_services &&
                  !(
                    items.length === filter_data.private_services.length &&
                    [...items].sort().every((value, index) => {
                      return (
                        value ===
                        [...filter_data.private_services].sort()[index]
                      );
                    })
                  )
                ) {
                  onChange({
                    private_services: items,
                    select_all_private_services: selectAll,
                  });
                }
                if (!filter_data.private_services && items.length > 0) {
                  onChange({
                    private_services: items,
                    select_all_private_services: selectAll,
                  });
                }
              }}
            />
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
});

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(PrivateBookingsFilter);
