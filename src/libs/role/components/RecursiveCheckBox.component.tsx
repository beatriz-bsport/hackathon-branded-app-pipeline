import React, { useState } from 'react';
import set from 'lodash/set';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import cloneDeep from 'lodash/cloneDeep';

import FormHelperText from '@material-ui/core/FormHelperText';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { Theme } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';

import { useTranslation } from 'react-i18next';

import { RolePermission, ObjectLevelPermissions } from '../types';

type DeepKeyBoolean = { [key: string]: boolean | DeepKeyBoolean };

const RecursiveDeepCheckBox: React.FC<{
  translationKeyPrefix?: string;
  checkBoxData: DeepKeyBoolean;
  rightKey: string;
  keysAccumulator: string[];
  disabled: boolean;
  permissions: RolePermission | ObjectLevelPermissions;
  updatePermission: (
    permission: RolePermission | ObjectLevelPermissions,
  ) => void;
  keysToHide?: string[];
}> = ({
  translationKeyPrefix,
  checkBoxData,
  rightKey,
  keysAccumulator,
  disabled,
  permissions,
  updatePermission,
  keysToHide = [],
}) => {
  const { t } = useTranslation(['role']);
  const classes = useStyles();

  const [isFolded, setIsFolded] = useState(true);

  if ([...keysAccumulator].join('.') === 'navigationMenu.search') {
    return null;
  }

  const prefix = translationKeyPrefix
    ? `role:${translationKeyPrefix}`
    : 'role:rolePermissions';
  const label = t(`${prefix}.${[...keysAccumulator].join('.')}._label`);
  const helpertext = t(`${prefix}.${[...keysAccumulator].join('.')}._helper`);

  const value = checkBoxData[rightKey];

  /**
   * Return true if all keys = true deeply
   * Return false if all keys = false deeply
   * Return undefined if keys are either false | true
   * If keys have different values return undefined
   * @param obj
   */
  const getBooleanOrUndefinedForObject = (obj: DeepKeyBoolean) => {
    let x: boolean | null | undefined = null;

    obj &&
      Object.keys(obj).forEach((_key) => {
        let _value = obj[_key];

        if (typeof _value === 'object') {
          _value = getBooleanOrUndefinedForObject(_value);
        }

        if (x === null) {
          x = _value;
        }

        if (x !== _value) {
          x = undefined;
        }
      });

    return x;
  };

  const displayCheckbox = !keysToHide.includes(rightKey);

  const getValueForKey = (_key: string, _keysAccumulator: string[]) => {
    let obj: any = permissions;

    for (let i = 0; i < _keysAccumulator.length - 1; i += 1) {
      obj = obj?.[_keysAccumulator?.[i]];
    }

    if (typeof obj?.[_key] === 'boolean') {
      return obj[_key];
    }

    return getBooleanOrUndefinedForObject(obj?.[_key]);
  };

  const checked = getValueForKey(rightKey, keysAccumulator);

  const setValuesDeep = (obj: any, _value: boolean) => {
    obj &&
      Object.keys(obj).forEach((_key) => {
        if (typeof obj[_key] === 'boolean') {
          /* eslint-disable-next-line */
          obj[_key] = _value;
        } else if (typeof obj[_key] === 'object') {
          setValuesDeep(obj[_key], _value);
        }
      });
  };

  const changeValueForKey = (_key: string, _keysAccumulator: string[]) => {
    let obj: any = cloneDeep(permissions);

    for (let i = 0; i < _keysAccumulator.length - 1; i += 1) {
      obj = obj?.[_keysAccumulator?.[i]];
    }

    let toChange = obj?.[_key];

    if (typeof toChange === 'object') {
      const _value = getBooleanOrUndefinedForObject(toChange);
      setValuesDeep(toChange, !_value);
    }

    if (typeof toChange === 'boolean') {
      toChange = !toChange;
    }

    const _permissions = set(
      cloneDeep(permissions),
      _keysAccumulator.join('.'),
      toChange,
    );

    updatePermission(cloneDeep(_permissions));
  };

  return (
    <>
      {displayCheckbox && (
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!checked}
                color="primary"
                disabled={disabled}
                indeterminate={checked === undefined}
                name="checkedB"
                onChange={() => changeValueForKey(rightKey, keysAccumulator)}
              />
            }
            label={
              <div className={classes.label}>
                <div>{label}</div>
                {typeof value === 'object' && (
                  <IconButton
                    aria-label="expand row"
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      setIsFolded(!isFolded);
                    }}
                    size="small"
                  >
                    {isFolded ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                )}
              </div>
            }
          />
          {!!helpertext && !helpertext.includes('_help') && (
            <div style={{ marginTop: -12, marginLeft: 32 }}>
              <FormHelperText margin="dense">{helpertext}</FormHelperText>
            </div>
          )}
        </>
      )}

      <Collapse unmountOnExit in={!isFolded || !displayCheckbox} timeout="auto">
        {typeof value === 'object' && (
          <div
            className={classNames({
              [classes.innerCheckBoxContainer]: displayCheckbox,
            })}
          >
            {value &&
              Object.keys(value).map((innerKey) => (
                <RecursiveDeepCheckBox
                  key={innerKey}
                  checkBoxData={value}
                  disabled={disabled}
                  keysAccumulator={[...keysAccumulator, innerKey]}
                  keysToHide={keysToHide}
                  permissions={permissions}
                  rightKey={innerKey}
                  translationKeyPrefix={translationKeyPrefix}
                  updatePermission={updatePermission}
                />
              ))}
          </div>
        )}
      </Collapse>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxesContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  innerCheckBoxContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    paddingLeft: theme.spacing(4),
    borderStyle: 'solid',
    borderWidth: 0,
    borderLeftWidth: 1,
    borderColor: theme.palette.primary.main,
  },
}));

export default RecursiveDeepCheckBox;
