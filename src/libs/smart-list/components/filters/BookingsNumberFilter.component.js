// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';

import Switch from '@material-ui/core/Switch';
import moment from 'moment';

import MetaActivityListItem from '../../../meta-activity/components/MetaActivityListItem.component';
import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';
import Selector from '../MultiSelector.component';
import CalendarPicker from '../CalendarPicker.component';
import type { Establishment } from '../../../establishment/types';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';

const DATE_BETWEEN = 2;

type Props = {
  filter_data: any,
  t: TFunction,
  establishments: Array<Establishment>,
  meta_activities: Array<any>,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
  fetchBulkItems: any,
  fetchItems: any,
  setNotNullableData: (Array<string>) => void,
  renderSelectorWarning: (string, boolean) => void,
};

export class BookingsNumberFilter extends Component<Props, state> {
  componentDidMount() {
    const { meta_activities, establishments } = this.props.filter_data;
    if (meta_activities && meta_activities.length === 1) {
      this.props.fetchBulkItems.meta_activities(meta_activities);
    }
    if (establishments && establishments.length === 1) {
      this.props.fetchBulkItems.establishments(establishments);
    }
    this.props.setNotNullableData(['value']);
    if (this.props.new) {
      this.props.onChange({
        establishments: [],
        meta_activities: [],
        value: null,
        value_second: 2,
        date: moment().format('YYYY-MM-DD'),
        date_second: moment().format('YYYY-MM-DD'),
        duration: 5,
        duration_second: 6,
        date_filter_type: DATE_BETWEEN,
        date_filter_active: false,
        establishment_filter_active: false,
        activity_filter_active: false,
      });
    }
  }

  render() {
    const {
      filter_data,
      t,
      classes,
      onChange,
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
            onChange={(ev) =>
              onChange({
                value: ev.target.value === '' ? null : ev.target.value,
              })
            }
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
      </div>
    );
  }
}

const styles = (theme) => ({
  calendarAntiMargin: {
    marginLeft: -theme.spacing.unit,
  },
  disabled: {
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    background: '#f1f1f1',
    borderRadius: '7px',
    paddingLeft: theme.spacing.unit,
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
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  textInput: {
    width: '50px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
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
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(BookingsNumberFilter);
