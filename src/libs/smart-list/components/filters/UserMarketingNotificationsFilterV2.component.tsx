import React, { ChangeEvent, DetailedHTMLProps, HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

type FilterData = {
  filter_identifier: number;
  email_filter_active: boolean;
  sms_filter_active: boolean;
  email_value: boolean;
  is_condition_and: boolean;
  is_v2: boolean;
  sms_value: boolean;
};

type OwnProps = {
  filter_data: FilterData;
  onChange: (dict: Partial<FilterData>) => void;
  isNew: boolean;
  setNotNullableData: (data: string[]) => void;
  setNotAllFalsyData: (data: string[][]) => void;
  renderSelectorWarning: (
    text: string,
    active: boolean,
  ) => DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
};

const UserMarketingNotificationsFilterV2: React.FC<OwnProps> = ({
  filter_data,
  onChange,
  isNew,
  setNotNullableData,
  setNotAllFalsyData,
  renderSelectorWarning,
}) => {
  const { t } = useTranslation('smartList');
  const classes = useStyles();

  React.useEffect(() => {
    setNotNullableData(['is_condition_and']);
    setNotAllFalsyData([['email_filter_active', 'sms_filter_active']]);
  }, [setNotAllFalsyData, setNotNullableData]);

  React.useEffect(() => {
    if (isNew) {
      onChange({
        email_filter_active: false,
        sms_filter_active: false,
        email_value: true,
        is_condition_and: true,
        sms_value: true,
      });
    }
  }, [isNew, onChange]);

  const handleEmailFilterChange = React.useCallback(
    () =>
      onChange({
        email_filter_active: !filter_data.email_filter_active,
      }),
    [filter_data.email_filter_active, onChange],
  );

  const handleEmailValueChange = React.useCallback(
    (event: ChangeEvent<{ value: boolean }>) =>
      onChange({ email_value: event.target.value }),
    [onChange],
  );

  const handleConditionAndChange = React.useCallback(
    (event: ChangeEvent<{ value: boolean }>) =>
      onChange({ is_condition_and: event.target.value }),
    [onChange],
  );

  const handleSmsFilterChange = React.useCallback(
    () =>
      onChange({
        sms_filter_active: !filter_data.sms_filter_active,
      }),
    [filter_data.sms_filter_active, onChange],
  );

  const handleSmsValueChange = React.useCallback(
    (event: ChangeEvent<{ value: boolean }>) =>
      onChange({ sms_value: event.target.value }),
    [onChange],
  );

  return (
    <div>
      <div className={classes.inlineContainer}>
        {renderSelectorWarning(
          t('multiSelector.userMarketingNotifications.warning'),
          !filter_data.email_filter_active && !filter_data.sms_filter_active,
        )}
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          checked={filter_data.email_filter_active}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleEmailFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.email_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          <Select
            defaultValue
            className={classes.input}
            onChange={handleEmailValueChange}
            value={filter_data.email_value ? 'true' : 'false'}
          >
            <MenuItem key="true" value="true">
              {t(`filters.${filter_data.filter_identifier}.true`)}
            </MenuItem>
            <MenuItem key="false" value="false">
              {t(`filters.${filter_data.filter_identifier}.false`)}
            </MenuItem>
          </Select>
          {t(`filters.${filter_data.filter_identifier}.email`)}
        </div>
      </div>
      <div
        className={
          !(filter_data.email_filter_active && filter_data.sms_filter_active) &&
          classes.inputContainerDisabled
        }
      >
        <Select
          defaultValue
          className={classes.input}
          onChange={handleConditionAndChange}
          value={filter_data.is_condition_and ? 'true' : 'false'}
        >
          <MenuItem key="true" value="true">
            {t(`filters.${filter_data.filter_identifier}.and`)}
          </MenuItem>
          <MenuItem key="false" value="false">
            {t(`filters.${filter_data.filter_identifier}.or`)}
          </MenuItem>
        </Select>
      </div>
      <div className={classes.inlineContainer}>
        <Switch
          checked={filter_data.sms_filter_active}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleSmsFilterChange}
          value="checkedA"
        />
        <div
          className={
            filter_data.sms_filter_active
              ? classes.inlineContainer
              : classes.disabled
          }
        >
          <Select
            defaultValue
            className={classes.input}
            onChange={handleSmsValueChange}
            value={filter_data.sms_value ? 'true' : 'false'}
          >
            <MenuItem key="true" value="true">
              {t(`filters.${filter_data.filter_identifier}.true`)}
            </MenuItem>
            <MenuItem key="false" value="false">
              {t(`filters.${filter_data.filter_identifier}.false`)}
            </MenuItem>
          </Select>
          {t(`filters.${filter_data.filter_identifier}.sms`)}
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  inputContainerDisabled: {
    width: 'fit-content',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    pointerEvents: 'none',
    background: '#f1f1f1',
    borderRadius: '7px',
    paddingLeft: theme.spacing(1),
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
}));

export default React.memo(UserMarketingNotificationsFilterV2);
