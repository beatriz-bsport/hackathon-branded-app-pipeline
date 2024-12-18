import React from 'react';
// @ts-expect-error
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';
import FormToggle from '#src/components/forms/FormToggle.component';

type Props = {
  manager_only: boolean;
  disabled?: boolean;
  onChange: (manager_only: boolean) => void;
  t: TFunction;
};

export function ManagerOnlyToggle(props: Props) {
  return (
    <FormToggle
      disabled={props.disabled}
      onChange={props.onChange}
      title={props.t('form.offer.explainManagerOnly')}
      value={!props.manager_only}
    />
  );
}

export default compose<any, Omit<Props, 't'>>(withTranslation())(
  ManagerOnlyToggle,
);
