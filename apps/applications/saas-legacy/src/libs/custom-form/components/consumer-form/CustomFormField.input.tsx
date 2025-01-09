import React, { useMemo } from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import FormLabel from '@material-ui/core/FormLabel';
import { ErrorMessage } from 'formik';
import amber from '@material-ui/core/colors/amber';
import {
  CUSTOM_FORM_FIELD_TITLE_OPTION,
  CUSTOM_FORM_FIELD_PARAGRAPH_OPTION,
  CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION,
  CUSTOM_FORM_FIELD_LONG_ANSWER_OPTION,
  CUSTOM_FORM_FIELD_RADIO_OPTION,
  CUSTOM_FORM_FIELD_CHECHBOX_OPTION,
  CUSTOM_FORM_FIELD_SELECT_OPTION,
  CUSTOM_FORM_FIELD_FILE_OPTION,
  CUSTOM_FORM_FIELD_SIGNATURE_OPTION,
  CUSTOM_FORM_FIELD_SIGNUP_QUESTION_OPTION,
  CUSTOM_FORM_FIELD_LOCATION_OPTION,
} from '@bsport/common/lib/master-data/custom-form.js';
import FabriqueTitle from '#Fabrique/Temporary/Title';
import FabriqueParagraph from '#Fabrique/Temporary/Paragraph';
import FabriqueTextfield from '#Fabrique/Temporary/Textfield';
import FabriqueTextFormField from '#Fabrique/Temporary/TextFormField';
import FabriqueRadioGroupfield from '#Fabrique/Temporary/RadioGroupfield';
import FabriqueMultipleCheckboxfield from '#Fabrique/Temporary/MultipleCheckboxfield';
import FabriqueSelectfield from '#Fabrique/Temporary/Selectfield';
import {
  MAX_LENGTH_FOR_SHORT_ANSWER,
  MAX_LENGTH_FOR_LONG_ANSWER,
  generateUniqueCustomFormFieldIdentifier,
} from '../../utils';

import { MaterialStyleType } from '../../../../utils/types';
import FileUploaderCustomized from '../../../../components/FileUploaderCustomized';
import type {
  CustomFormField,
  FormikCustomFormFilled,
  ResponsiveLayouts,
} from '../../types';
import SignatureCanvas from './SignatureCanvas.component';

import {
  MultipleCheckboxField,
  RadioGroupField,
  TextFieldEnhancedLabelWithError,
  SelectFieldWithEnhancedLabeLError,
  // @ts-expect-error
} from '../../../../components/forms';

import CustomFormFieldSignUpInput from './CustomFormField.signup-input';
import CustomFormFieldLocationInput from './CustomFormField.location-input';

type OwnProps = {
  field: CustomFormField;
  index: number;
  asManager?: boolean;
  setFieldValue: (field_name: string, value: any) => void;
  handleBlur: (str: string) => void;
  values: FormikCustomFormFilled;
  layouts: ResponsiveLayouts;
  waiver?: string;
  isCssVariantActivated?: boolean;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const CustomFormConsumerInput = (props: Props) => {
  const { t, classes, isCssVariantActivated } = props;
  const [openSignatureCanvas, setOpenSignatureCanvas] = React.useState(false);
  const setImageAnswer = (ImageDataUrl: string) => {
    props.setFieldValue(
      `custom_form_field.${props.index}.answer`,
      ImageDataUrl || null,
    );
  };

  const memoizedChoices = useMemo(
    () => [
      ...(props.field?.choices?.map((choice: string) => ({
        optionLabel: choice,
        value: choice,
      })) ?? []),
    ],
    [props.field?.choices],
  );

  const memoizedSuggestions = useMemo(
    () => [
      ...(props.field?.choices?.map((choice: string) => ({
        label: choice,
        value: choice,
      })) ?? []),
    ],
    [props.field?.choices],
  );
  const uniqueCustomFormFieldIdentifier =
    generateUniqueCustomFormFieldIdentifier(props.field, props.field?.label);

  switch (props.field?.kind) {
    case CUSTOM_FORM_FIELD_TITLE_OPTION:
      if (isCssVariantActivated) {
        return <FabriqueTitle label={props.field.label} />;
      }
      return (
        <div className={classes.spacedField}>
          <div style={{ overflowWrap: 'break-word' }}>
            <Typography variant="h4">{props.field.label}</Typography>
          </div>
        </div>
      );
    case CUSTOM_FORM_FIELD_PARAGRAPH_OPTION:
      if (isCssVariantActivated) {
        return <FabriqueParagraph label={props.field.label} />;
      }
      return (
        <div className={classes.spacedField}>
          <div style={{ overflowWrap: 'break-word' }}>
            <Typography component="div" variant="caption">
              {props.field.label}
            </Typography>
          </div>
        </div>
      );
    case CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION:
      if (isCssVariantActivated) {
        return (
          <FabriqueTextfield
            inputId={uniqueCustomFormFieldIdentifier}
            isDisabled={props.asManager}
            isRequired={props.field.mandatory}
            label={props.field.label}
            name={`custom_form_field.${props.index}.answer`}
          />
        );
      }
      return (
        <div key={props.index}>
          <div className={classes.spacedField}>
            <TextFieldEnhancedLabelWithError
              fullWidth
              disabled={props.asManager}
              InputLabelProps={{ color: 'red' }}
              inputProps={{ maxlength: MAX_LENGTH_FOR_SHORT_ANSWER }}
              label={props.field.label}
              name={`custom_form_field.${props.index}.answer`}
              onBlur={props.handleBlur}
              required={props.field.mandatory}
            />
          </div>
        </div>
      );
    case CUSTOM_FORM_FIELD_LONG_ANSWER_OPTION:
      if (isCssVariantActivated) {
        return (
          <FabriqueTextFormField
            isDisabled={props.asManager}
            isRequired={props.field.mandatory}
            label={props.field.label}
            name={`custom_form_field.${props.index}.answer`}
            textFormId={uniqueCustomFormFieldIdentifier}
          />
        );
      }
      return (
        <div className={classes.spacedField}>
          <TextFieldEnhancedLabelWithError
            fullWidth
            multiline
            disabled={props.asManager}
            inputProps={{ maxlength: MAX_LENGTH_FOR_LONG_ANSWER }}
            label={props.field.label}
            name={`custom_form_field.${props.index}.answer`}
            onBlur={props.handleBlur}
            required={props.field.mandatory}
            variant="outlined"
          />
        </div>
      );

    case CUSTOM_FORM_FIELD_RADIO_OPTION:
      if (isCssVariantActivated) {
        return (
          <FabriqueRadioGroupfield
            choices={memoizedChoices}
            disabled={props.asManager}
            id={uniqueCustomFormFieldIdentifier}
            isRequired={props.field.mandatory}
            label={props.field.label}
            name={`custom_form_field.${props.index}.answer`}
          />
        );
      }
      return (
        <div className={classes.spacedField}>
          <RadioGroupField
            choices={(props.field.choices ?? []).map((choice: string) => ({
              label: choice,
              value: choice,
            }))}
            disabled={props.asManager}
            label={`${props.field.label}${props.field.mandatory ? ' *' : ''}`}
            labelClass={classes.labelClass}
            name={`custom_form_field.${props.index}.answer`}
            required={props.field.mandatory}
          />
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography color="error" variant="caption">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      );
    case CUSTOM_FORM_FIELD_CHECHBOX_OPTION:
      if (isCssVariantActivated) {
        return (
          <FabriqueMultipleCheckboxfield
            choices={memoizedChoices}
            disabled={props.asManager}
            id={uniqueCustomFormFieldIdentifier}
            isRequired={props.field.mandatory}
            label={props.field.label}
            name={`custom_form_field.${props.index}.answer`}
          />
        );
      }
      return (
        <div className={classes.spacedField}>
          <MultipleCheckboxField
            choices={(props.field.choices ?? []).map((choice: string) => ({
              optionLabel: choice,
              id: choice,
            }))}
            disabled={props.asManager}
            label={`${props.field.label}${props.field.mandatory ? ' *' : ''}`}
            labelClass={classes.labelClass}
            name={`custom_form_field.${props.index}.answer`}
            required={props.field.mandatory}
          />
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography color="error" variant="caption">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      );
    case CUSTOM_FORM_FIELD_SELECT_OPTION:
      if (isCssVariantActivated) {
        return (
          <FabriqueSelectfield
            id={uniqueCustomFormFieldIdentifier}
            isDisabled={props.asManager}
            isRequired={props.field.mandatory}
            label={props.field.label}
            name={`custom_form_field.${props.index}.answer`}
            suggestions={memoizedSuggestions}
          />
        );
      }
      return (
        <div className={classes.spacedField}>
          <FormLabel className={classes.labelClass}>
            {props.field.label}
            {props.field.mandatory && ' *'}
          </FormLabel>
          <div style={{ maxWidth: '400px' }}>
            <SelectFieldWithEnhancedLabeLError
              isClearable
              isDisabled={props.asManager}
              label={props.field.label}
              name={`custom_form_field.${props.index}.answer`}
              onChange={(item: { label: string; value: string }) =>
                props.setFieldValue(
                  `custom_form_field.${props.index}.answer`,
                  item ? item.value : null,
                )
              }
              placeholder={t('customForm.field.select_placeholder')}
              selected={props.values.custom_form_field[props.index].answer}
              suggestions={memoizedSuggestions}
            />
          </div>
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGNATURE_OPTION:
      return (
        <div className={classes.spacedField}>
          <div
            style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <FormLabel className={classes.labelClass}>
              {props.field.label}
              {props.field.mandatory && ' *'}
            </FormLabel>
            <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
              {() => (
                <Typography color="error" variant="caption">
                  {t(`marketing:customForm.submit.errors.requiredSignature`)}
                </Typography>
              )}
            </ErrorMessage>
          </div>

          {!props.values.custom_form_field[props.index].answer ? (
            <Button
              color="primary"
              disabled={props.asManager}
              onClick={() => setOpenSignatureCanvas(true)}
              variant="outlined"
            >
              <AddIcon />
              {t('customForm.customFormField.modal.signature.addSignature')}
            </Button>
          ) : null}
          {props.values.custom_form_field[props.index].answer ? (
            <div className={classes.signatureContainer}>
              <div className={classes.fixedIconContainer}>
                <div className={classes.fixedIcon}>
                  <IconButton
                    color="primary"
                    disabled={props.asManager}
                    onClick={() => setOpenSignatureCanvas(true)}
                    style={{ padding: 0, paddingRight: 10 }}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              </div>

              <img
                alt="signature"
                className={classes.signature}
                // @ts-expect-error
                src={props.values.custom_form_field[props.index].answer}
              />
            </div>
          ) : null}
          <SignatureCanvas
            closeCanvas={() => setOpenSignatureCanvas(false)}
            open={openSignatureCanvas}
            setTrimmedDataURL={setImageAnswer}
          />
        </div>
      );
    case CUSTOM_FORM_FIELD_FILE_OPTION:
      return (
        <div className={classes.spacedField}>
          <FormLabel className={classes.labelClass}>
            {props.field.label}
            {props.field.mandatory && ' *'}
          </FormLabel>
          <FileUploaderCustomized
            allowPreview={props.asManager}
            disabled={props.asManager}
            // @ts-expect-error
            file={props.values.custom_form_field[props.index].answer}
            label={t('member:file.drop_file')}
            onAddFile={(file: File) =>
              props.setFieldValue(
                `custom_form_field.${props.index}.answer`,
                file || null,
              )
            }
            onRemoveFile={() =>
              props.setFieldValue(
                `custom_form_field.${props.index}.answer`,
                null,
              )
            }
          />
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {() => (
              <Typography color="error" variant="caption">
                {t(`marketing:customForm.submit.errors.requiredFile`)}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      );
    case CUSTOM_FORM_FIELD_SIGNUP_QUESTION_OPTION:
      // @ts-expect-error
      return <CustomFormFieldSignUpInput {...props} />;
    case CUSTOM_FORM_FIELD_LOCATION_OPTION:
      // @ts-expect-error
      return <CustomFormFieldLocationInput {...props} />;
    default:
      return <div />;
  }
};
const styles = (theme: Theme) => ({
  spacedField: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  labelClass: {
    color: 'black',
    paddingBottom: theme.spacing(1),
  },
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  signature: {
    maxWidth: '100%',
    maxHeight: '100px',
  },
  signatureContainer: {
    border: `1px solid ${theme.palette.grey[600]}`,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(1),
    width: '80%',
    position: 'relative',
  },
  fixedIconContainer: {
    width: '100%',
    position: 'absolute',
    zIndex: 1000,
    margin: 0,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  fixedIcon: {
    marginLeft: 'auto',
  },
  fixedButton: {
    padding: '0 10 0 0',
  },
  formChangeContainer: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${amber[900]}`,
    borderRadius: theme.spacing(0.5),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  changeWarning: {
    color: amber[900],
    marginRight: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['marketing', 'member']),
  // @ts-expect-error
  withStyles(styles),
)(CustomFormConsumerInput);
