import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import FormLabel from '@material-ui/core/FormLabel';
import { ErrorMessage } from 'formik';
import { MaterialStyleType } from '../../../../utils/types';
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
  MAX_LENGTH_FOR_SHORT_ANSWER,
  MAX_LENGTH_FOR_LONG_ANSWER,
} from '../../utils';
import {
  TextField,
  MultipleCheckboxField,
  RadioGroupField,
} from '../../../../components/forms';
import Selector from '../../../../components/Selector.component';
import FileUploaderCustomized from '../../../../components/FileUploaderCustomized';
import type { CustomFormField } from '../../types';
import SignatureCanvas from './SignatureCanvas.component';

interface CustomFormFilledTagule {
  answer_for_tag: string;
  custom_form_field_id: number;
  id: number;
  tag_id: number;
}
interface CustomFormFieldAnswer {
  id: number;
  kind: number;
  label: string;
  mandatory: boolean;
  custom_form_id: number;
  choices: Array<string>;
  answer: string | Array<string> | File;
  custom_form_field_tag_rule: Array<CustomFormFilledTagule>;
}
interface FormikCustomFormFilled {
  id: number;
  name: string;
  disabled: boolean;
  date_created: string;
  custom_form_field: Array<CustomFormFieldAnswer>;
}

type OwnProps = {
  field: CustomFormField;
  index: number;
  asManager?: boolean;
  setFieldValue: (field_name: string, value: any) => void;
  handleBlur: (str: string) => void;
  values: FormikCustomFormFilled;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const CustomFormConsumerInput = (props: Props) => {
  const { t, classes } = props;
  const [openSignatureCanvas, setOpenSignatureCanvas] = React.useState(false);
  const setImageAnswer = (ImageDataUrl: string) => {
    props.setFieldValue(
      `custom_form_field.${props.index}.answer`,
      ImageDataUrl || null,
    );
  };
  switch (props.field.kind) {
    case CUSTOM_FORM_FIELD_TITLE_OPTION:
      return (
        <div className={classes.title}>
          <Typography variant="h4"> {props.field.label}</Typography>
        </div>
      );
    case CUSTOM_FORM_FIELD_PARAGRAPH_OPTION:
      return (
        <Typography variant="legend" component="div">
          {props.field.label}
        </Typography>
      );
    case CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION:
      return (
        <div className={classes.spacedField}>
          <TextField
            name={`custom_form_field.${props.index}.answer`}
            required={props.field.mandatory}
            onBlur={props.handleBlur}
            label={props.field.label}
            fullWidth
            InputLabelProps={{ color: 'red' }}
            disabled={props.asManager}
            inputProps={{ maxlength: MAX_LENGTH_FOR_SHORT_ANSWER }}
          />
        </div>
      );
    case CUSTOM_FORM_FIELD_LONG_ANSWER_OPTION:
      return (
        <div className={classes.spacedField}>
          <TextField
            name={`custom_form_field.${props.index}.answer`}
            variant="outlined"
            required={props.field.mandatory}
            onBlur={props.handleBlur}
            label={props.field.label}
            fullWidth
            multiline
            disabled={props.asManager}
            inputProps={{ maxlength: MAX_LENGTH_FOR_LONG_ANSWER }}
          />
        </div>
      );

    case CUSTOM_FORM_FIELD_RADIO_OPTION:
      return (
        <div className={classes.spacedField}>
          <RadioGroupField
            name={`custom_form_field.${props.index}.answer`}
            label={`${props.field.label}${props.field.mandatory ? ' *' : ''}`}
            required={props.field.mandatory}
            choices={props.field.choices.map((choice: string) => ({
              label: choice,
              value: choice,
            }))}
            labelClass={classes.labelClass}
            disabled={props.asManager}
          />
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography variant="caption" color="error">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      );
    case CUSTOM_FORM_FIELD_CHECHBOX_OPTION:
      return (
        <div className={classes.spacedField}>
          <MultipleCheckboxField
            name={`custom_form_field.${props.index}.answer`}
            label={`${props.field.label}${props.field.mandatory ? ' *' : ''}`}
            required={props.field.mandatory}
            choices={props.field.choices.map((choice: string) => ({
              optionLabel: choice,
              id: choice,
            }))}
            labelClass={classes.labelClass}
            disabled={props.asManager}
          />
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography variant="caption" color="error">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      );
    case CUSTOM_FORM_FIELD_SELECT_OPTION:
      return (
        <div className={classes.spacedField}>
          <FormLabel className={classes.labelClass}>
            {props.field.label}
            {props.field.mandatory && ' *'}
          </FormLabel>
          <div style={{ maxWidth: '400px' }}>
            <Selector
              suggestions={[...props.field.choices.slice()].map(
                (choice: string) => ({
                  label: choice,
                  value: choice,
                }),
              )}
              isClearable
              onChange={(item: { label: string; value: string }) =>
                props.setFieldValue(
                  `custom_form_field.${props.index}.answer`,
                  item ? item.value : null,
                )
              }
              isDisabled={props.asManager}
              selected={props.values.custom_form_field[props.index].answer}
              placeholder={t('customForm.field.select_placeholder')}
            />
          </div>
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {(error_msg) => (
              <Typography variant="caption" color="error">
                {t(`${error_msg}`)}
              </Typography>
            )}
          </ErrorMessage>
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
                <Typography variant="caption" color="error">
                  {t(`marketing:customForm.submit.errors.requiredSignature`)}
                </Typography>
              )}
            </ErrorMessage>
          </div>

          {!props.values.custom_form_field[props.index].answer ? (
            <Button
              color="primary"
              variant="outlined"
              onClick={() => setOpenSignatureCanvas(true)}
              disabled={props.asManager}
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
                    onClick={() => setOpenSignatureCanvas(true)}
                    disabled={props.asManager}
                    style={{ padding: 0, paddingRight: 10 }}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              </div>

              <img
                className={classes.signature}
                alt="signature"
                src={props.values.custom_form_field[props.index].answer}
              />
            </div>
          ) : null}
          <SignatureCanvas
            open={openSignatureCanvas}
            closeCanvas={() => setOpenSignatureCanvas(false)}
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
            file={props.values.custom_form_field[props.index].answer}
            disabled={props.asManager}
            allowPreview={props.asManager}
          />
          <ErrorMessage name={`custom_form_field.${props.index}.answer`}>
            {() => (
              <Typography variant="caption" color="error">
                {t(`marketing:customForm.submit.errors.requiredFile`)}
              </Typography>
            )}
          </ErrorMessage>
        </div>
      );
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
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormConsumerInput);
