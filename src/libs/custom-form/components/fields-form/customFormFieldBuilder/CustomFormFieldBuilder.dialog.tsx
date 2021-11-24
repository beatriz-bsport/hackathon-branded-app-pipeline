import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FieldArray, Formik } from 'formik';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import WarningIcon from '@material-ui/icons/Warning';
import * as Yup from 'yup';
import amber from '@material-ui/core/colors/amber';
import ClearIcon from '@material-ui/icons/Clear';

import {
  CUSTOM_FORM_FIELD_FILE_OPTION,
  CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION,
  CUSTOM_FORM_FIELD_SIGNUP_QUESTION_OPTION,
} from '@bsport/common/lib/master-data/custom-form';
import {
  TextField,
  AlertError,
  CheckboxField,
} from '../../../../../components/forms';
import CustomFormFieldSelector from '../CustomFormBuilderField.selector';
import {
  CUSTOM_FORM_FIELDS_OPTIONS,
  CUSTOM_FORM_FIELDS_WITH_CHOICES,
  CUSTOM_FORM_FIELD_LINKABLE_TO_NOTE,
  MAX_LENGTH_FOR_SHORT_ANSWER,
  MAX_LENGTH_FOR_LONG_ANSWER,
  CUSTOM_FORM_FIELD_SIGNUP_QUESTIONS_CHOICES,
  CUSTOM_FORM_FIELD_LOCATION_OPTION,
  CUSTOM_FORM_DATATYPE_ESTABLISHMENT_GROUP,
  MODEL_BASED_QUESTION_FAVORITE,
} from '../../../utils';

import type { CustomFormField } from '../../../types';
import { MaterialStyleType } from '../../../../../utils/types';
import CustomFormFieldTagRuleSelector from '../CustomFormBuilderTagRule.selector';
import { TagGroup, Tag } from '../../../../tag/types';
import { Theme as CompanyTheme } from '../../../../theme/types';

type OwnProps = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  initial?: CustomFormField;
  registeredSignUpQuestions: Array<number>;
  tag_groups: Array<TagGroup>;
  tags: Array<Tag>;
  companyTheme: CompanyTheme;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
const CustomFormFieldFormSchema = Yup.object().shape({
  id: Yup.number().nullable(true),
  kind: Yup.number().nullable(false),
  label: Yup.string(),
  choices: Yup.array()
    .of(
      Yup.string()
        .nullable(false)
        .test(
          'empty_choice',
          'marketing:customForm.customFormField.modal.error.emptyChoice',
          function checkEmpty(item) {
            return !!item;
          },
        ),
    )
    .test(
      'test_choices_length',
      'marketing:customForm.customFormField.modal.error.choicesLength',
      function checkChoiceLength(item) {
        return (
          !CUSTOM_FORM_FIELDS_WITH_CHOICES.includes(this.parent.kind) ||
          (CUSTOM_FORM_FIELDS_WITH_CHOICES.includes(this.parent.kind) &&
            item.length > 1)
        );
      },
    ),
  disabled: Yup.boolean().nullable(true),
  mandatory: Yup.boolean().nullable(true),
  action: Yup.number().nullable(true),
  datatype: Yup.number().nullable(true),
  model_based_question_kind: Yup.number().nullable(true),
  editable: Yup.boolean().nullable(true),
  link_to_note: Yup.boolean().nullable(true),
  signup_question_kind: Yup.number()
    .nullable(true)
    .test(
      'test_signup_question_choice',
      'marketing:customForm.customFormField.modal.error.signupQuestionShouldBeSelected',
      function checkSignupQuestion(item) {
        if (this.parent.kind !== CUSTOM_FORM_FIELD_SIGNUP_QUESTION_OPTION) {
          return true;
        }
        return !!item;
      },
    ),
});

export function CustomFormFieldBuilderDialog(props: Props) {
  const { t, open, handleClose, isSubmitting, classes } = props;
  const signupQuestionsChoices =
    CUSTOM_FORM_FIELD_SIGNUP_QUESTIONS_CHOICES.filter(
      (choice: { value: number; label: string }) =>
        !props?.registeredSignUpQuestions?.includes(choice.value),
    );
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="form-dialog-title">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {t('customForm.customFormField.modal.add.title')}
        </div>
      </DialogTitle>

      <Formik
        initialValues={
          props.initial
            ? {
                ...props.initial,
                choices: [...props.initial.choices],
                custom_form_field_tag_rule: [
                  ...props.initial.custom_form_field_tag_rule,
                ],
              }
            : {
                id: null,
                kind: null,
                label: '',
                choices: [],
                disabled: false,
                mandatory: false,
                link_to_note: false,
                custom_form_field_tag_rule: [],
                signup_question_kind: null,
                editable: true,
                datatype: null,
                model_based_question_kind: null,
              }
        }
        enableReinitialize
        onSubmit={(values) => {
          return props.onSubmit({
            ...values,
            ...(CUSTOM_FORM_FIELDS_WITH_CHOICES.includes(values.kind)
              ? {
                  choices: [...values.choices],
                  custom_form_field_tag_rule: [
                    ...values.custom_form_field_tag_rule,
                  ],
                }
              : {
                  choices: [],
                  custom_form_field_tag_rule: [],
                }),
          });
        }}
        validationSchema={CustomFormFieldFormSchema}
      >
        {(formik) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              formik.handleSubmit(e);
            }}
          >
            <DialogContent>
              <div className={classes.paddingBottom}>
                <Typography variant="caption">
                  {t('customForm.customFormField.modal.add.addField')}
                </Typography>
              </div>

              <CustomFormFieldSelector
                formFieldOptionList={CUSTOM_FORM_FIELDS_OPTIONS.filter(
                  (option) =>
                    !(
                      option.value === CUSTOM_FORM_FIELD_LOCATION_OPTION &&
                      !props.companyTheme?.enable_multi_localization
                    ),
                )}
                selectedOptions={[formik.values.kind]}
                placeholder={t('customForm.customFormField.modal.add.select')}
                onChange={(option: { value: number; label: string }) => {
                  formik.setFieldValue('kind', option ? option.value : null);
                  formik.setFieldValue(
                    'model_based_question_kind',
                    option.value === CUSTOM_FORM_FIELD_LOCATION_OPTION
                      ? MODEL_BASED_QUESTION_FAVORITE
                      : null,
                  );
                  formik.setFieldValue(
                    'datatype',
                    option.value === CUSTOM_FORM_FIELD_LOCATION_OPTION
                      ? CUSTOM_FORM_DATATYPE_ESTABLISHMENT_GROUP
                      : null,
                  );
                }}
                noMulti
                isClearable
                closeMenuOnSelect
                disabled={!!formik.values.id}
              />
              <AlertError name="choices" />
              <div className={classes.signupQuestionSelector}>
                {formik.values.kind ===
                  CUSTOM_FORM_FIELD_SIGNUP_QUESTION_OPTION && (
                  <CustomFormFieldSelector
                    formFieldOptionList={signupQuestionsChoices}
                    selectedOptions={[formik.values.signup_question_kind]}
                    placeholder={t(
                      'customForm.customFormField.modal.add.select',
                    )}
                    onChange={(option: { value: number; label: string }) => {
                      formik.setFieldValue(
                        'signup_question_kind',
                        option ? option.value : null,
                      );
                    }}
                    noMulti
                    isClearable
                    closeMenuOnSelect
                    disabled={!!formik.values.id}
                  />
                )}
              </div>
              <AlertError name="signup_question_kind" />
              {CUSTOM_FORM_FIELDS_WITH_CHOICES.includes(formik.values.kind) && (
                <div className={classes.paddingTop}>
                  <FieldArray name="choices">
                    {({
                      push,
                      replace,
                      form: {
                        values: { choices },
                      },
                    }) => (
                      <>
                        {choices.map((choice: string, i: number) => (
                          <div className={classes.choicesWithTag}>
                            <TextField
                              name={`choices.${i}`}
                              onBlur={() => replace(i, choices[i])}
                              disabled={
                                formik.values.id &&
                                formik.initialValues.choices.includes(choice)
                              }
                            />
                            <IconButton
                              onClick={() => {
                                formik.setFieldValue('choices', [
                                  ...choices.slice(0, i),
                                  ...choices.slice(i + 1),
                                ]);
                              }}
                            >
                              <ClearIcon />
                            </IconButton>
                            <CustomFormFieldTagRuleSelector
                              tag_groups={props.tag_groups}
                              tags={props.tags}
                              setTag={(tag_id: string) =>
                                formik.setFieldValue(
                                  'custom_form_field_tag_rule',
                                  [
                                    ...formik.values.custom_form_field_tag_rule,
                                    {
                                      tag_id: parseInt(tag_id),
                                      answer_for_tag: choices[i],
                                    },
                                  ],
                                )
                              }
                              deleteTagRule={() => {
                                formik.setFieldValue(
                                  'custom_form_field_tag_rule',
                                  [
                                    ...formik.values.custom_form_field_tag_rule.filter(
                                      (rule) =>
                                        rule.answer_for_tag !== choices[i],
                                    ),
                                  ],
                                );
                              }}
                              choice_tag_rule={formik.values.custom_form_field_tag_rule.find(
                                (rule) => rule.answer_for_tag === choices[i],
                              )}
                            />
                          </div>
                        ))}
                        <div className={classes.optionButton}>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => push('')}
                          >
                            <AddIcon color="primary" />
                            {t('customForm.customFormField.modal.add.option')}
                          </Button>
                          <div className={classes.textAndIcon}>
                            <WarningIcon
                              className={classes.warningIcon}
                              fontSize="small"
                            />
                            <div className={classes.helperTextContainer}>
                              <Typography variant="caption">
                                {t('customForm.field.choice_warning')}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </FieldArray>
                </div>
              )}
              {CUSTOM_FORM_FIELD_LINKABLE_TO_NOTE.includes(
                formik.values.kind,
              ) && (
                <FormGroup>
                  <FormHelperText>
                    {t('customForm.field.text_size_limit', {
                      count:
                        formik.values.kind ===
                        CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION
                          ? MAX_LENGTH_FOR_SHORT_ANSWER
                          : MAX_LENGTH_FOR_LONG_ANSWER,
                    })}
                  </FormHelperText>
                  <CheckboxField
                    id="checkbox_taxe_rate"
                    name="link_to_note"
                    label={t('customForm.field.link_to_note')}
                    checked={formik.values.link_to_note}
                    onClick={() =>
                      formik.setFieldValue(
                        'link_to_note',
                        !formik.values.link_to_note,
                      )
                    }
                  />

                  <div className={classes.textAndIcon}>
                    <InfoIcon className={classes.leftIcon} fontSize="small" />
                    <div className={classes.helperTextContainer}>
                      <Typography variant="caption">
                        {t('customForm.field.link_to_note_helper')}
                      </Typography>
                    </div>
                  </div>
                </FormGroup>
              )}
              {formik.values.kind === CUSTOM_FORM_FIELD_FILE_OPTION && (
                <div className={classes.textAndIcon}>
                  <InfoIcon className={classes.leftIcon} fontSize="small" />
                  <div className={classes.helperTextContainer}>
                    <Typography variant="caption">
                      {t('customForm.field.fileHelper')}
                    </Typography>
                  </div>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                color="secondary"
                disabled={isSubmitting}
              >
                {t('customForm.customFormField.modal.add.cancel')}
              </Button>
              <Button
                type="submit"
                id="button_submit_custom_form_field"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
              >
                {t('customForm.customFormField.modal.add.confirm')}
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
}
const styles = (theme: Theme) => ({
  paddingBottom: {
    paddingBottom: theme.spacing(1),
  },
  textAndIcon: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  helperTextContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  optionButton: {
    paddingTop: theme.spacing(2),
  },
  choicesWithTag: {
    display: 'flex',
    flexDirection: 'row',
  },
  paddingTop: {
    paddingTop: theme.spacing(2),
  },
  warningIcon: {
    color: amber[900],
    marginRight: theme.spacing(1),
  },
  signupQuestionSelector: {
    paddingTop: theme.spacing(2),
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormFieldBuilderDialog);
