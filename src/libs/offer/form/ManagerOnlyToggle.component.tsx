// @ts-nocheck
// @flow

import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import FormToggle from '#components/forms/FormToggle.component';

type Props = {
  manager_only: boolean;
  disabled?: boolean;
  onChange: (manager_only: boolean) => void;
  t: TFunction;
};

export function ManagerOnlyToggle(props: Props) {
  return (
    <FormToggle
      value={!props.manager_only}
      disabled={props.disabled}
      onChange={props.onChange}
      title={props.t('form.offer.explainManagerOnly')}
    />
  );
}

export default compose<any, Omit<Props, 't'>>(withTranslation())(
  ManagerOnlyToggle,
);
