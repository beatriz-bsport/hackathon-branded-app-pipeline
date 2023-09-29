import React, { ChangeEvent } from 'react';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import classNames from 'classnames';

import './styles.css';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

export type Props = {
  name: string;
  label: React.ReactElement;
  isChecked: boolean;
  classes?: {
    label?: string;
    text?: string;
  };
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox: React.FC<Props> = React.memo(
  ({ isChecked, label, name, classes, onChange }) => (
    <div className="bs-checkbox__container">
      <label
        className={classNames(classes.label, 'bs-checkbox__label')}
        htmlFor={name}
      >
        <input
          checked={isChecked}
          className="bs-checkbox__input"
          id={name}
          onChange={onChange}
          type="checkbox"
        />

        {isChecked ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
        <span className={classNames('bs-checkbox__text', classes.text)}>
          {label}
        </span>
      </label>
    </div>
  ),
);

export const CheckboxForStorybook = marketplaceCssHoc()(Checkbox);

export default Checkbox;
