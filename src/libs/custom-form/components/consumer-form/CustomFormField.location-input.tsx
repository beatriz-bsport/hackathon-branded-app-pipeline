import React, { Component } from 'react';

// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import {
  WithStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FormLabel } from '@material-ui/core';
import { SelectFieldWithEnhancedLabeLError } from '../../../../components/forms';

import { CustomFormField, FormikCustomFormFilled } from '../../types';
import { getAssociatedEstablishmentGroup } from '../../../establishment/selectors';

import { fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction } from '../../../establishment/actions';
import { RootState } from '../../../../reducers';

import themeSelectors from '../../../theme/selectors';

const styles = (theme: Theme) =>
  createStyles({
    spacedField: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    labelClass: {
      color: 'black',
      paddingBottom: theme.spacing(1),
    },
  });

type OwnProps = {
  field: CustomFormField & { answer: string | number | boolean };
  index: number;
  asManager?: boolean;
  setFieldValue: (field_name: string, value: any) => void;
  handleBlur: (str: string) => void;

  waiver?: string;
  general_terms_and_conditions: string;
  values: FormikCustomFormFilled;
};
type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class CustomFormFieldLocationInput extends Component<Props> {
  componentDidMount() {
    this.props.fetchAllEstablishmentGroup(this.props.theme.company);
  }

  render() {
    const {
      classes,
      t,
      field,
      index,
      establishmentGroupList,
      asManager,
      setFieldValue,
      values,
    } = this.props;
    return (
      <div className={classes.spacedField}>
        <FormLabel className={classes.labelClass}>
          {field.label}
          {field.mandatory && ' *'}
        </FormLabel>
        <div style={{ maxWidth: '400px' }}>
          <SelectFieldWithEnhancedLabeLError
            name={`custom_form_field.${index}.answer`}
            label={field.label}
            placeholder={t('customForm.field.select_placeholder')}
            suggestions={
              establishmentGroupList
                ? [...establishmentGroupList].map((establishmentGroup) => ({
                    label: establishmentGroup.name,
                    value: establishmentGroup.id,
                  }))
                : []
            }
            isClearable
            onChange={(item: { label: string; value: string }) =>
              setFieldValue(
                `custom_form_field.${index}.answer`,
                item ? [item.value] : [],
              )
            }
            isDisabled={asManager}
            selected={values.custom_form_field[index].answer}
          />
        </div>
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    establishmentGroupList: getAssociatedEstablishmentGroup(state),
    theme: themeSelectors.getTheme(state),
  }),
  {
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
  },
);

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation('marketing'),
  connector,
)(CustomFormFieldLocationInput);
