import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import classnames from 'classnames';
import { compose } from 'recompose';
import {
  createStyles,
  IconButton,
  Switch,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { DateTime } from 'luxon';
import {
  COMPARATORS_DICT_BETWEEN,
  BETWEEN_COMPARATOR,
  GTE_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';
import DelayedNumericInput from '#src/components/DelayedNumericInput.component';

import ToolTip from '#src/components/Tooltip.component';
import { MaterialStyleType } from '../../../../utils/types';

import CalendarPicker from '../CalendarPicker.component';
import { DATE_BETWEEN } from '../constants';

type OwnProps = {
  filter_data: any;
  onChange: (dict: any) => void;
  isNew: boolean;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class RelationsFilter extends Component<Props> {
  componentDidMount() {
    if (this.props.isNew) {
      this.props.onChange({
        value_number_relations: 1,
        value_number_relations_second: 1,
        comparator_number_relations: GTE_COMPARATOR,
        date_filter_active: false,
        date_filter_type: DATE_BETWEEN,
        date: DateTime.now().toISODate(),
        date_second: DateTime.now().toISODate(),
        duration: -5,
        duration_second: -10,

        // consumer payment packs
        number_number_relations_consumer_payment_packs_filter_active: false,
        value_number_relations_consumer_payment_packs: 1,
        value_number_relations_consumer_payment_packs_second: 1,
        comparator_number_relations_consumer_payment_packs: GTE_COMPARATOR,
        consumer_payment_packs_must_be_valid: false,
        // private consumer passes
        number_number_relations_consumer_private_passes_filter_active: false,
        value_number_relations_consumer_private_passes: 1,
        value_number_relations_consumer_private_passes_second: 1,
        comparator_number_relations_consumer_private_passes: GTE_COMPARATOR,
        consumer_private_passes_must_be_valid: false,
        // bookings/private bookings
        number_number_relations_bookings_filter_active: false,
        value_number_relations_bookings: 1,
        value_number_relations_bookings_second: 1,
        comparator_number_relations_bookings: GTE_COMPARATOR,
        // relation marketing notification
        relation_receive_copy_of_email_filter_active: false,
        relation_receive_copy_of_email: true,
        relation_accept_sms_filter_active: false,
        relation_accept_sms: true,
        relation_accept_email_filter_active: false,
        relation_accept_email: true,
      });
    }
  }

  getNameList = () => [
    'consumerPaymentPacks',
    'consumerPrivatePasses',
    'bookings',
  ];

  getFilterActiveList = () => [
    this.props.filter_data
      .number_relations_consumer_payment_packs_filter_active,
    this.props.filter_data
      .number_relations_consumer_private_passes_filter_active,
    this.props.filter_data.number_relations_bookings_filter_active,
  ];

  getValueList = () => [
    this.props.filter_data.value_number_relations_consumer_payment_packs,
    this.props.filter_data.value_number_relations_consumer_private_passes,
    this.props.filter_data.value_number_relations_bookings,
  ];

  getValueSecondList = () => [
    this.props.filter_data.value_number_relations_consumer_payment_packs_second,
    this.props.filter_data
      .value_number_relations_consumer_private_passes_second,
    this.props.filter_data.value_number_relations_bookings_second,
  ];

  getComparatorList = () => [
    this.props.filter_data.comparator_number_relations_consumer_payment_packs,
    this.props.filter_data.comparator_number_relations_consumer_private_passes,
    this.props.filter_data.comparator_number_relations_bookings,
  ];

  getFilterActiveDictList = () => [
    {
      number_relations_consumer_payment_packs_filter_active:
        !this.props.filter_data
          .number_relations_consumer_payment_packs_filter_active,
    },
    {
      number_relations_consumer_private_passes_filter_active:
        !this.props.filter_data
          .number_relations_consumer_private_passes_filter_active,
    },
    {
      number_relations_bookings_filter_active:
        !this.props.filter_data.number_relations_bookings_filter_active,
    },
  ];

  getFilterMustBeValidList = () => [
    this.props.filter_data.consumer_payment_packs_must_be_valid,
    this.props.filter_data.consumer_private_passes_must_be_valid,
    null,
  ];

  getComparatorRelationDictList = (value: number) => [
    { comparator_number_relations_consumer_payment_packs: value },
    { comparator_number_relations_consumer_private_passes: value },
    { comparator_number_relations_bookings: value },
  ];

  getValueRelationDictList = (value: number) => [
    { value_number_relations_consumer_payment_packs: value },
    { value_number_relations_consumer_private_passes: value },
    { value_number_relations_bookings: value },
  ];

  getValueSecondRelationDictList = (value: number) => [
    { value_number_relations_consumer_payment_packs_second: value },
    { value_number_relations_consumer_private_passes_second: value },
    { value_number_relations_bookings_second: value },
  ];

  getMustBeValidRelationDictList = (value: number) => [
    { consumer_payment_packs_must_be_valid: value },
    { consumer_private_passes_must_be_valid: value },
    {},
  ];

  getBooleanNameList = () => ['receiveCopyOfEmail', 'acceptSms', 'acceptEmail'];

  getBooleanFilterActiveList = () => [
    this.props.filter_data.relation_receive_copy_of_email_filter_active,
    this.props.filter_data.relation_accept_sms_filter_active,
    this.props.filter_data.relation_accept_email_filter_active,
  ];

  getBooleanValueList = () => [
    this.props.filter_data.relation_receive_copy_of_email,
    this.props.filter_data.relation_accept_sms,
    this.props.filter_data.relation_accept_email,
  ];

  getBooleanFilterActiveDictList = () => [
    {
      relation_receive_copy_of_email_filter_active:
        !this.props.filter_data.relation_receive_copy_of_email_filter_active,
    },
    {
      relation_accept_sms_filter_active:
        !this.props.filter_data.relation_accept_sms_filter_active,
    },
    {
      relation_accept_email_filter_active:
        !this.props.filter_data.relation_accept_email_filter_active,
    },
  ];

  getBooleanValueRelationDictList = (value: number) => [
    { relation_receive_copy_of_email: value },
    { relation_accept_sms: value },
    { relation_accept_email: value },
  ];

  render() {
    const { filter_data, t, classes, onChange } = this.props;

    const nameList = this.getNameList();
    const filterActiveList = this.getFilterActiveList();
    const valueList = this.getValueList();
    const valueSecondList = this.getValueSecondList();
    const comparatorList = this.getComparatorList();
    const filterActiveDictList = this.getFilterActiveDictList();
    const filterMustBeValidList = this.getFilterMustBeValidList();
    const booleanNameList = this.getBooleanNameList();
    const booleanFilterActiveList = this.getBooleanFilterActiveList();
    const booleanValueList = this.getBooleanValueList();
    const booleanFilterActiveDictList = this.getBooleanFilterActiveDictList();

    return (
      <div className={classes.wrapper}>
        <div className={classnames(classes.inlineContainer, classes.marginTop)}>
          <div className={classes.rowContainer}>
            {t(`filters.${filter_data?.filter_identifier}.first`)}
            <Select
              required
              className={classes.textInput}
              defaultValue={GTE_COMPARATOR}
              onChange={(ev) =>
                onChange({ comparator_number_relations: ev.target.value })
              }
              value={filter_data.comparator_number_relations}
            >
              {COMPARATORS_DICT_BETWEEN.map((item) => (
                <MenuItem key={item.key} value={item.value}>
                  {t(`filters.comparators.${item.value}`)}
                </MenuItem>
              ))}
            </Select>
            {filter_data?.comparator_number_relations !== BETWEEN_COMPARATOR
              ? t(`filters.${filter_data?.filter_identifier}.to`)
              : null}
            <DelayedNumericInput
              classes={classes}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(ev) =>
                onChange({ value_number_relations: ev.target.value })
              }
              value={filter_data.value_number_relations}
            />
            {filter_data?.comparator_number_relations === BETWEEN_COMPARATOR
              ? t(`filters.${filter_data?.filter_identifier}.between`)
              : null}
            {filter_data?.comparator_number_relations === BETWEEN_COMPARATOR ? (
              <DelayedNumericInput
                classes={classes}
                InputProps={{ inputProps: { min: 0 } }}
                onChange={(ev) =>
                  onChange({ value_number_relations_second: ev.target.value })
                }
                value={filter_data.value_number_relations_second}
              />
            ) : null}
            {t(`filters.${filter_data?.filter_identifier}.second`)}
          </div>
        </div>
        <div className={classnames(classes.marginLeft, classes.rowContainer)}>
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
                  ? classes.rowContainer
                  : classes.disabled
              }
            >
              {t(`filters.${filter_data?.filter_identifier}.date.first`)}

              <CalendarPicker
                // @ts-expect-error
                blockValidateOnClickAway
                filter_data={filter_data}
                onChange={onChange}
              />
            </div>
          </div>
          {this.getFilterActiveList().map((_, index) => {
            return (
              <div key={`filter_${index}`} className={classes.inlineContainer}>
                <Switch
                  checked={filterActiveList[index]}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  onChange={() => onChange(filterActiveDictList[index])}
                  value="checkedA"
                />
                <div
                  className={
                    filterActiveList[index]
                      ? classes.rowContainer
                      : classes.disabled
                  }
                >
                  {index === 2
                    ? t(`filters.${filter_data?.filter_identifier}.fourth`)
                    : t(`filters.${filter_data?.filter_identifier}.third`)}

                  <Select
                    required
                    className={classes.textInput}
                    defaultValue={GTE_COMPARATOR}
                    onChange={(ev: React.ChangeEvent<{ value: number }>) =>
                      onChange(
                        this.getComparatorRelationDictList(ev.target.value)[
                          index
                        ],
                      )
                    }
                    value={comparatorList[index]}
                  >
                    {COMPARATORS_DICT_BETWEEN.map((item) => (
                      <MenuItem key={item.key} value={item.value}>
                        {t(`filters.comparators.${item.value}`)}
                      </MenuItem>
                    ))}
                  </Select>
                  {comparatorList[index] !== BETWEEN_COMPARATOR
                    ? t(`filters.${filter_data?.filter_identifier}.to`)
                    : null}
                  <DelayedNumericInput
                    classes={classes}
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={(ev: React.ChangeEvent<{ value: number }>) =>
                      onChange(
                        this.getValueRelationDictList(ev.target.value)[index],
                      )
                    }
                    value={valueList[index]}
                  />
                  {comparatorList[index] === BETWEEN_COMPARATOR
                    ? t(`filters.${filter_data?.filter_identifier}.between`)
                    : null}
                  {comparatorList[index] === BETWEEN_COMPARATOR ? (
                    <DelayedNumericInput
                      classes={classes}
                      InputProps={{ inputProps: { min: 0 } }}
                      onChange={(ev: React.ChangeEvent<{ value: number }>) =>
                        onChange(
                          this.getValueSecondRelationDictList(ev.target.value)[
                            index
                          ],
                        )
                      }
                      value={valueSecondList[index]}
                    />
                  ) : null}
                  {t(
                    `filters.${filter_data?.filter_identifier}.${nameList[index]}`,
                  )}
                  {index !== 2 && (
                    <>
                      <Select
                        required
                        className={classes.textInput}
                        defaultValue={false}
                        onChange={(ev: React.ChangeEvent<{ value: number }>) =>
                          onChange(
                            this.getMustBeValidRelationDictList(
                              ev.target.value,
                            )[index],
                          )
                        }
                        value={filterMustBeValidList[index]}
                      >
                        {/* @ts-expect-error eslint-disable-next-line */}
                        <MenuItem key={`valid_${index}`} value>
                          {t(`filters.${filter_data?.filter_identifier}.valid`)}
                        </MenuItem>
                        <MenuItem
                          key={`valid_or_not_${index}`}
                          // @ts-expect-error
                          value={false}
                        >
                          {t(
                            `filters.${filter_data?.filter_identifier}.validOrNot`,
                          )}
                        </MenuItem>
                      </Select>
                      <ToolTip
                        aria-label="info"
                        title={
                          <Typography variant="subtitle2">
                            {t(
                              `filters.${filter_data?.filter_identifier}.info.${nameList[index]}`,
                            )}
                          </Typography>
                        }
                      >
                        <IconButton>
                          <InfoIcon />
                        </IconButton>
                      </ToolTip>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {booleanFilterActiveList.map((_, index) => {
            return (
              <div key={`boolean_${index}`} className={classes.inlineContainer}>
                <Switch
                  checked={booleanFilterActiveList[index]}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  onChange={() => onChange(booleanFilterActiveDictList[index])}
                  value="checkedA"
                />
                <div
                  className={
                    booleanFilterActiveList[index]
                      ? classes.rowContainer
                      : classes.disabled
                  }
                >
                  {t(
                    `filters.${filter_data?.filter_identifier}.${booleanNameList[index]}.first`,
                  )}

                  <Select
                    defaultValue
                    required
                    className={classes.input}
                    // eslint-disable-next-line
                    onChange={(ev: React.ChangeEvent<{ value: number }>) =>
                      onChange(
                        this.getBooleanValueRelationDictList(ev.target.value)[
                          index
                        ],
                      )
                    }
                    value={booleanValueList[index]}
                  >
                    {/* @ts-expect-error eslint-disable */}
                    <MenuItem key={`${booleanNameList[index]}_true`} value>
                      {t(
                        `filters.${filter_data?.filter_identifier}.${booleanNameList[index]}.true`,
                      )}
                    </MenuItem>
                    {/* eslint-enable */}
                    <MenuItem
                      key={`${booleanNameList[index]}_false`}
                      // @ts-expect-error
                      value={false}
                    >
                      {t(
                        `filters.${filter_data?.filter_identifier}.${booleanNameList[index]}.false`,
                      )}
                    </MenuItem>
                  </Select>
                  {t(
                    `filters.${filter_data?.filter_identifier}.${booleanNameList[index]}.second`,
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    marginTop: { marginTop: theme.spacing(2) },
    marginLeft: { marginLeft: theme.spacing(2) },

    input: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    textInput: {
      width: '80px',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    inlineContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    rowContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    datePicker: {
      width: '160px',
    },
    disabled: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      pointerEvents: 'none',
      background: '#f1f1f1',
      borderRadius: '7px',
      paddingLeft: theme.spacing(1),
    },
  });

export default compose(
  withTranslation(['smartList']),
  withStyles(styles),
)(RelationsFilter);
