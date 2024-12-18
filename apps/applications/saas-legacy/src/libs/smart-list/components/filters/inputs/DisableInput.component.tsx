import React from 'react';

import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';

type Keys = {
  activeKey: string;
};

export type DisableInputProps = {
  children: React.ReactNode;
  filterData: any;
  keys: Keys;
  onChange: (dict: any) => void;
  forceDisable?: boolean;
};

/**
 * Component that wraps the children with a switch that will enable or disable the children input based on the switch state
 * @prop filterData - The data that will be used to control the switch state and the children input state
 * @prop keys - Mapper between the filterData and the switch state
 * @prop children - The content that will be wrapped by the disable input
 * @prop onChange - The function used to update the filterData with the backend
 * @prop forceDisable [Optional] If true, the children will be disabled regardless of the switch state
 * @example
 * <DisableInput
 *   filterData={filterData}
 *   keys={{ activeKey: 'first_payment_is_done' }}
 *   onChange={onChange}
 * >
 *  <OtherInput />
 * </DisableInput>
 * ...
 */
export default React.memo<DisableInputProps>(
  ({ children, filterData, keys, onChange, forceDisable = false }) => {
    const classes = useStyles();

    const disableStateClassName =
      filterData[keys.activeKey] && !forceDisable ? '' : classes.disabled;

    const getHandleSwitchChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.checked;
        onChange({
          [keys.activeKey]: value,
        });
      },
      [onChange, keys.activeKey],
    );

    return (
      <>
        <Switch
          checked={filterData[keys.activeKey]}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={getHandleSwitchChange}
        />
        <div className={`${classes.container} ${disableStateClassName}`}>
          {children}
        </div>
      </>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  disabled: {
    pointerEvents: 'none',
    background: '#f1f1f1',
    borderRadius: '7px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
  },
}));
