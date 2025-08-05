import React from 'react';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';

import { Theme, makeStyles } from '@material-ui/core/styles';
import { useTranslation, WithTranslation } from 'react-i18next';
import { FormLabel } from '@material-ui/core';
import { generateUniqueCustomFormFieldIdentifier } from '#src/libs/custom-form/utils';
import FabriqueSelectfield from '#src/components/css-only/Fabrique/Temporary/Selectfield';
// @ts-expect-error
import { SelectFieldWithEnhancedLabeLError } from '../../../../components/forms';

import { CustomFormField, FormikCustomFormFilled } from '../../types';
import { getAssociatedEstablishmentGroup } from '../../../establishment/selectors';

import { fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction } from '../../../establishment/actions';
import { RootState } from '../../../../reducers';

import themeSelectors from '../../../theme/selectors';

const useStyles = makeStyles((theme: Theme) => ({
  spacedField: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  labelClass: {
    color: 'black',
    paddingBottom: theme.spacing(1),
  },
}));

type OwnProps = {
  field: CustomFormField & { answer: string | number | boolean };
  index: number;
  asManager?: boolean;
  setFieldValue: (field_name: string, value: any) => void;
  values: FormikCustomFormFilled;
  isCssVariantActivated?: boolean;
};

type Props = OwnProps & ConnectedProps<typeof connector> & WithTranslation;

export const CustomFormFieldLocationInput: React.FC<Props> = ({
  field,
  index,
  establishmentGroupList,
  asManager,
  setFieldValue,
  values,
  isCssVariantActivated,
  theme,
  fetchAllEstablishmentGroup,
}) => {
  // CDM
  React.useEffect(() => {
    fetchAllEstablishmentGroup(theme.company);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useTranslation('marketing');
  const classes = useStyles();
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

  if (isCssVariantActivated) {
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
  }
  return (
    <div className={classes.spacedField}>
      <FormLabel className={classes.labelClass}>
        {field.label}
        {field.mandatory && ' *'}
      </FormLabel>
      <div style={{ maxWidth: '400px' }}>
        <SelectFieldWithEnhancedLabeLError
          isClearable
          isDisabled={asManager}
          label={field.label}
          name={`custom_form_field.${index}.answer`}
          onChange={(item: { label: string; value: string }) =>
            setFieldValue(
              `custom_form_field.${index}.answer`,
              item ? [item.value] : [],
            )
          }
          placeholder={t('customForm.field.select_placeholder')}
          selected={values.custom_form_field[index].answer}
          suggestions={[...suggestions]}
        />
      </div>
    </div>
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
