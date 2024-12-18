import React from 'react';
import { useTranslation } from 'react-i18next';

import InfoIcon from '@material-ui/icons/Info';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ToolTip from '#src/components/Tooltip.component';

type HideTranslation = {
  before?: boolean;
  after?: boolean;
};

export type BooleanChoiceInputProps = {
  filterData: any;
  fieldName: string;
  onChange: (dict: any) => void;
  additionalTranslationPrefix?: string;
  hideTranslation?: HideTranslation;
  showToolTip?: boolean;
};

/**
 * Component that builds an user interface to select a boolean value
 * @prop filterData - The data that will be used to control the switch state and the children input state
 * @prop fieldName - The name of the field that will be used to control the switch state
 * @prop onChange - The function used to update the filterData with the backend
 * @prop additionalTranslationPrefix [Optional] - Prefix used for translation keys
 * @prop hideTranslation [Optional] - Object that indicates if translations should be removed
 * @prop showToolTip [Optional] - Boolean that indicates if a tooltip should be shown
 * @example
 * <BooleanChoiceInput
 *  filterData={filterData}
 *  keys={{ booleanKey: 'is_referred' }}
 *  onChange={onChange}
 * />
 */
export default React.memo<BooleanChoiceInputProps>(
  ({
    filterData,
    fieldName,
    onChange,
    additionalTranslationPrefix,
    hideTranslation,
    showToolTip = false,
  }) => {
    const classes = useStyles();
    const { t } = useTranslation('smartList');

    const translationPrefix = `filters.${
      filterData.filter_identifier
    }.booleanChoice.${
      additionalTranslationPrefix ? `${additionalTranslationPrefix}.` : ''
    }`;

    const handleBooleanChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        onChange({ [fieldName]: value === 'true' });
      },
      [onChange, fieldName],
    );

    return (
      <div className={classes.wrapper}>
        {!hideTranslation?.before && (
          <div className={classes.textSpacer}>
            {t(`${translationPrefix}before`)}
          </div>
        )}
        <Select
          required
          onChange={handleBooleanChange}
          value={filterData[fieldName] ? 'true' : 'false'}
        >
          <MenuItem key="true" value="true">
            {t(`${translationPrefix}is`)}
          </MenuItem>
          <MenuItem key="false" value="false">
            {t(`${translationPrefix}is_not`)}
          </MenuItem>
        </Select>
        {!hideTranslation?.after && (
          <div className={classes.textSpacer}>
            {t(`${translationPrefix}after`)}
          </div>
        )}
        {showToolTip && (
          <>
            <ToolTip
              aria-label="info"
              title={
                <Typography variant="subtitle2">
                  {t(`${translationPrefix}tooltip`)}
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
    );
  },
);

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
  },
  textSpacer: {
    margin: theme.spacing(1),
  },
}));
