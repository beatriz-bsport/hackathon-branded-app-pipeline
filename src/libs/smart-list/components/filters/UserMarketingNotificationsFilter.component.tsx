// @ts-nocheck
import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { createStyles, Theme, withStyles, Switch } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { MaterialStyleType } from '../../../../utils/types';

type OwnProps = {
  filter_data: any;
  onChange: (dict: any) => void;
  isNew: boolean;
  setNotNullableData: (data: Array<string>) => void;
  setNotAllFalsyData: (data: Array<Array<string>>) => void;
  renderSelectorWarning: (text: string, active: boolean) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class UserMarketingNotificationsFilter extends Component<Props> {
  componentDidMount() {
    this.props.setNotNullableData(['all_filters_must_be_right']);
    this.props.setNotAllFalsyData([
      ['email_filter_active', 'sms_filter_active'],
    ]);
    if (this.props.isNew) {
      this.props.onChange({
        all_filters_must_be_right: true,
        email_filter_active: false,
        sms_filter_active: false,
        email_value: true,
        sms_value: true,
      });
    }
  }

  render() {
    const { filter_data, t, classes, onChange } = this.props;
    return (
      <div>
        <div className={classes.inlineContainer}>
          <Select
            className={classes.input}
            value={filter_data.all_filters_must_be_right}
            // eslint-disable-next-line
            defaultValue={true}
            onChange={(ev) =>
              onChange({ all_filters_must_be_right: ev.target.value })
            }
          >
            {/* eslint-disable-next-line */}
            <MenuItem key="true" value={true}>
              {t(`filters.${filter_data.filter_identifier}.allNeeded`)}
            </MenuItem>
            <MenuItem key="false" value={false}>
              {t(`filters.${filter_data.filter_identifier}.oneNeeded`)}
            </MenuItem>
          </Select>
        </div>
        <div className={classes.inlineContainer}>
          {this.props.renderSelectorWarning(
            t('multiSelector.userMarketingNotifications.warning'),
            !filter_data.email_filter_active && !filter_data.sms_filter_active,
          )}
        </div>
        <div className={classes.inlineContainer}>
          <Switch
            checked={filter_data.email_filter_active}
            onChange={() =>
              onChange({
                email_filter_active: !filter_data.email_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <div
            className={
              filter_data.email_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            <Select
              className={classes.input}
              value={filter_data.email_value}
              // eslint-disable-next-line
              defaultValue={true}
              onChange={(ev) => onChange({ email_value: ev.target.value })}
            >
              {/* eslint-disable-next-line */}
              <MenuItem key="true" value={true}>
                {t(`filters.${filter_data.filter_identifier}.true`)}
              </MenuItem>
              <MenuItem key="false" value={false}>
                {t(`filters.${filter_data.filter_identifier}.false`)}
              </MenuItem>
            </Select>
            {t(`filters.${filter_data.filter_identifier}.email`)}
          </div>
        </div>
        <div className={classes.inlineContainer}>
          <Switch
            checked={filter_data.sms_filter_active}
            onChange={() =>
              onChange({
                sms_filter_active: !filter_data.sms_filter_active,
              })
            }
            value="checkedA"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <div
            className={
              filter_data.sms_filter_active
                ? classes.inlineContainer
                : classes.disabled
            }
          >
            <Select
              className={classes.input}
              value={filter_data.sms_value}
              // eslint-disable-next-line
              defaultValue={true}
              onChange={(ev) => onChange({ sms_value: ev.target.value })}
            >
              {/* eslint-disable-next-line */}
              <MenuItem key="true" value={true}>
                {t(`filters.${filter_data.filter_identifier}.true`)}
              </MenuItem>
              <MenuItem key="false" value={false}>
                {t(`filters.${filter_data.filter_identifier}.false`)}
              </MenuItem>
            </Select>
            {t(`filters.${filter_data.filter_identifier}.sms`)}
          </div>
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    input: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    inlineContainer: { display: 'flex', alignItems: 'center' },
    disabled: {
      display: 'flex',
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
)(UserMarketingNotificationsFilter);
