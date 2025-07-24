import React from 'react';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';

import { generateUniqueCustomFormFieldIdentifier } from '#src/libs/custom-form/utils';
import FabriqueSelectfield from '#src/components/css-only/Fabrique/Temporary/Selectfield';

import { CustomFormField, FormikCustomFormFilled } from '../../types';
import { getAssociatedEstablishmentGroup } from '../../../establishment/selectors';

import { fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction } from '../../../establishment/actions';
import { RootState } from '../../../../reducers';

import themeSelectors from '../../../theme/selectors';
import { WithTranslation } from 'react-i18next';

type OwnProps = {
  field: CustomFormField & { answer: string | number | boolean };
  index: number;
  asManager?: boolean;
  setFieldValue: (field_name: string, value: any) => void;
  values: FormikCustomFormFilled;
};

type Props = OwnProps & ConnectedProps<typeof connector> & WithTranslation;

export const CustomFormFieldLocationInput: React.FC<Props> = ({
  field,
  index,
  establishmentGroupList,
  asManager,
  theme,
  fetchAllEstablishmentGroup,
}) => {
  // CDM
  React.useEffect(() => {
    fetchAllEstablishmentGroup(theme.company);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uniqueCustomFormFieldIdentifier = React.useMemo(
    () => generateUniqueCustomFormFieldIdentifier(field, field.label),
    [field],
  );

  const suggestions = React.useMemo(
    () =>
      establishmentGroupList
        ? establishmentGroupList.map((establishmentGroup) => ({
            label: establishmentGroup.name,
            value: establishmentGroup.id,
          }))
        : [],
    [establishmentGroupList],
  );

  return (
    <FabriqueSelectfield
      id={uniqueCustomFormFieldIdentifier}
      isDisabled={asManager}
      isRequired={field.mandatory}
      label={field.label}
      name={`custom_form_field.${index}.answer`}
      suggestions={suggestions}
    />
  );
};

const connector = connect(
  (state: RootState) => ({
    establishmentGroupList: getAssociatedEstablishmentGroup(state),
    theme: themeSelectors.getTheme(state),
  }),
  {
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
  },
);

export default React.memo(connector(CustomFormFieldLocationInput));
