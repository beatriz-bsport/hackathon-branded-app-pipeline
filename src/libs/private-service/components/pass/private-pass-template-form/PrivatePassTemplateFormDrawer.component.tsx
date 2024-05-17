import React from 'react';

import { useTranslation } from 'react-i18next';

import PrivatePassTemplateForm, {
  PrivatePassTemplateFormikHOC,
} from './PrivatePassTemplateForm.component';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

type Props = {
  open?: boolean;
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

const PrivatePassTemplateFormDrawer = (props: Props) => {
  const { t } = useTranslation(['privateService']);

  return (
    <GenericResponsiveDrawer
      withoutPadding
      onClose={props.onCancel}
      open={props.open}
      title={t('privatePassTemplate.form.title')}
    >
      {/* @ts-expect-error */}
      <PrivatePassTemplateForm {...props} />
    </GenericResponsiveDrawer>
  );
};

// @ts-expect-error
export default PrivatePassTemplateFormikHOC(PrivatePassTemplateFormDrawer);
