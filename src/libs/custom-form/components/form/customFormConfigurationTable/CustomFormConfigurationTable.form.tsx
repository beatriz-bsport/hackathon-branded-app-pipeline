import React from 'react';
import { compose } from 'recompose';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FieldArray, Formik, FormikProps, Form } from 'formik';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Divider from '@material-ui/core/Divider';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { TFunction } from 'i18next';
import CustomFormFieldListItem from '../../CustomFormFieldListItem.component';
import CustomFormFieldBuilderDialog from '../../fields-form/customFormFieldBuilder';
import type {
  CustomForm,
  CustomFormField,
  FormikCustomForm,
} from '../../../types';
import { MaterialStyleType } from '../../../../../utils/types';
import { TagGroup, Tag } from '../../../../tag/types';
import withConfirm from '../../../../../hocs/with-confirm.hoc';
import CustomFormConfigurationBanner from '../../CustomFormConfigurationBanner.component';
import FormikChangesLookUp from './CustomFormConfigurationTableConnect.component';

const SortableItem = SortableElement((props: any) => (
  <div style={{ display: 'flex', opacity: '1', zIndex: 99999, width: '100%' }}>
    {props.children}
  </div>
));
const Container = SortableContainer((props: any) => {
  return <div>{props.children}</div>;
});
type InitialValues = {
  initial?: CustomForm;
};

type InitialFormikValues = {
  initial?: CustomForm;
  custom_form_field_enabled: Array<CustomFormField>;
  custom_form_field_disabled: Array<CustomFormField>;
  custom_form_field: Array<CustomFormField>;
};
type OwnProps = InitialValues & {
  onSubmit: (customForm: CustomForm) => void;
  isSubmitting: boolean;
  handleUpdateView?: (customform: CustomForm) => void;
  tag_groups: Array<TagGroup>;
  tags: Array<Tag>;
  navigateToSignup?: () => void;
  navigateToMemberForm?: () => void;
  setNumberOfQuestionsHasChanged: (open: boolean) => void;
};
type Props = OwnProps &
  WithTranslation &
  FormikProps<InitialValues> &
  OwnProps &
  MaterialStyleType<ReturnType<typeof styles>>;

const ButtonSaveWithInfo = withConfirm(Button, 'onClick', {
  title: 'marketing:customForm.signUpInfoModal.title',
  cancel: 'marketing:customForm.signUpInfoModal.cancel',
  confirm: 'marketing:customForm.signUpInfoModal.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('marketing:customForm.signUpInfoModal.content')}</p>
  ),
});
export function CustomFormConfigurationTable(props: Props) {
  const { t, isSubmitting, classes } = props;
  const [openFieldCreationDialog, setOpenCreationDialog] = React.useState(
    false,
  );
  const [initialFieldWithIndex, setInitialFieldWithIndex] = React.useState(
    null,
  );
  const [showDisabledField, setShowDisabledField] = React.useState(false);
  const [
    registeredSignUpQuestions,
    setregisteredSignUpQuestions,
  ] = React.useState([]);
  const [showInfoDialogOnsave, setShowInfoDialogOnSave] = React.useState(false);
  React.useEffect(() => {
    props.initial &&
      setregisteredSignUpQuestions(
        props.initial?.custom_form_field.map(
          (field: CustomFormField) => field.signup_question_kind,
        ),
      );
  }, [props.initial]);
  const handleFieldUpdate = (field: CustomFormField, index: number) => {
    setInitialFieldWithIndex({ field, index });
    setOpenCreationDialog(true);
  };
  const updateCustomFormView = (values: FormikCustomForm) => {
    const {
      custom_form_field_enabled,
      custom_form_field_disabled,
      ...otherValues
    } = values;
    props.handleUpdateView &&
      props.handleUpdateView({
        ...otherValues,
        custom_form_field: [
          ...custom_form_field_enabled,
          ...custom_form_field_disabled,
        ],
      });
  };
  const updateCustomFormField = async (
    field: CustomFormField,
    replace: (index: number, field: CustomFormField) => void,
    push: (field: CustomFormField) => void,
    formikValues: FormikCustomForm,
  ) => {
    if (initialFieldWithIndex) {
      replace(initialFieldWithIndex.index, field);
    } else {
      push(field);
    }
    setOpenCreationDialog(false);
    setInitialFieldWithIndex(null);
    updateCustomFormView(formikValues);
  };
  const onSortEnd = React.useCallback(
    (
      e: { oldIndex: number; newIndex: number },
      custom_form_field_enabled,
      setFielfOrdered,
    ) => {
      const fields = [...custom_form_field_enabled];
      if (e.oldIndex > e.newIndex) {
        setFielfOrdered('custom_form_field_enabled', [
          ...fields.slice(0, e.newIndex),
          fields[e.oldIndex],
          ...fields.slice(e.newIndex + 1, e.oldIndex),
          fields[e.newIndex],
          ...fields.slice(e.oldIndex + 1),
        ]);
      } else if (e.oldIndex < e.newIndex) {
        setFielfOrdered('custom_form_field_enabled', [
          ...fields.slice(0, e.oldIndex),
          fields[e.newIndex],
          ...fields.slice(e.oldIndex + 1, e.newIndex),
          fields[e.oldIndex],
          ...fields.slice(e.newIndex + 1),
        ]);
      } else
        setFielfOrdered('custom_form_field_enabled', custom_form_field_enabled);
    },
    [],
  );
  return (
    <>
      <CustomFormConfigurationBanner
        customForm={props.initial}
        navigateTo={
          props?.initial.is_signup
            ? props.navigateToMemberForm
            : props.navigateToSignup
        }
      />
      <Formik
        initialValues={
          props.initial
            ? {
                ...props.initial,
                custom_form_field_enabled: [
                  ...props.initial?.custom_form_field.filter(
                    (field) => !field.disabled,
                  ),
                ],
                custom_form_field_disabled: [
                  ...props.initial?.custom_form_field.filter(
                    (field) => field.disabled,
                  ),
                ],
              }
            : {
                name: '',
                date_created: '',
                disabled: false,
                custom_form_field: [],
                custom_form_field_enabled: [],
                custom_form_field_disabled: [],
              }
        }
        enableReinitialize={props.isSubmitting}
        onSubmit={(values) => {
          const {
            custom_form_field_enabled,
            custom_form_field_disabled,
            ...otherValues
          } = values;
          return props.onSubmit({
            ...otherValues,
            custom_form_field: [
              ...custom_form_field_enabled,
              ...custom_form_field_disabled,
            ],
          });
        }}
      >
        {(mainFormik: FormikProps<InitialFormikValues>) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              mainFormik.handleSubmit();
            }}
          >
            <>
              <FormikChangesLookUp
                isSubmitting={isSubmitting}
                setNumberOfQuestionsHasChanged={
                  props.setNumberOfQuestionsHasChanged
                }
                registeredSignUpQuestions={registeredSignUpQuestions}
                setregisteredSignUpQuestions={setregisteredSignUpQuestions}
              />
              {props.isSubmitting && <LinearProgress color="primary" />}

              <List component="nav" disablePadding>
                <Paper square>
                  <ListItem divider className={classes.listitem}>
                    <div className={classes.type}>
                      <Typography
                        variant="subtitle2"
                        component="span"
                        className={classes.marginRight}
                      />
                      <Typography variant="subtitle2" component="span">
                        {t('customForm.kind')}
                      </Typography>
                    </div>
                    <Typography variant="subtitle2" className={classes.label}>
                      {t('customForm.label')}
                    </Typography>
                    {!props?.initial?.is_member_form && (
                      <div className={classes.mandatory}>
                        <Typography variant="subtitle2" component="span">
                          {t('customForm.mandatory')}
                        </Typography>
                      </div>
                    )}
                    {props?.initial?.is_member_form && (
                      <div className={classes.mandatory}>
                        <Typography variant="subtitle2" component="span">
                          {t('customForm.editable')}
                        </Typography>
                      </div>
                    )}
                    <div className={classes.actions}>
                      <Typography variant="subtitle2" component="span">
                        {t('customForm.listActions')}
                      </Typography>
                    </div>
                  </ListItem>
                </Paper>
                <FieldArray name="custom_form_field_enabled">
                  {({
                    push,
                    remove,
                    replace,
                    form: {
                      values: {
                        custom_form_field_enabled,
                        custom_form_field_disabled,
                      },
                    },
                  }) => (
                    <>
                      <Container
                        useDragHandle
                        transitionDuration={500}
                        hideSortableGhost={false}
                        onSortEnd={(e) =>
                          onSortEnd(
                            e,
                            custom_form_field_enabled,
                            mainFormik.setFieldValue,
                          )
                        }
                      >
                        {custom_form_field_enabled.map(
                          (field: CustomFormField, i: number) => (
                            <SortableItem index={i} key={`${i}${field.id}`}>
                              <Paper square className={classes.paperItem}>
                                <CustomFormFieldListItem
                                  name={`custom_form_field_enabled.${i}`}
                                  key={`enabled_field${i}`}
                                  customFormField={field}
                                  onClickRequired={() => {
                                    mainFormik.setFieldValue(
                                      `custom_form_field_enabled.${i}.mandatory`,
                                      !mainFormik.values
                                        .custom_form_field_enabled[i].mandatory,
                                    );
                                    if (
                                      !mainFormik.values
                                        .custom_form_field_enabled[i].mandatory
                                    ) {
                                      mainFormik.setFieldValue(
                                        `custom_form_field_enabled.${i}.editable`,
                                        true,
                                      );
                                    }
                                    if (
                                      props.initial?.is_signup &&
                                      !mainFormik.values
                                        .custom_form_field_enabled[i]
                                        .mandatory &&
                                      field.signup_question_kind
                                    ) {
                                      const initialValue = mainFormik.initialValues?.custom_form_field.find(
                                        (f: CustomFormField) =>
                                          f.id === field.id,
                                      );
                                      initialValue &&
                                        !initialValue.mandatory &&
                                        setShowInfoDialogOnSave(true);
                                    }
                                  }}
                                  onClickEditable={() =>
                                    mainFormik.setFieldValue(
                                      `custom_form_field_enabled.${i}.editable`,
                                      !mainFormik.values
                                        .custom_form_field_enabled[i].editable,
                                    )
                                  }
                                  onClickEdit={() =>
                                    handleFieldUpdate(field, i)
                                  }
                                  onClickDelete={() => {
                                    custom_form_field_disabled.push({
                                      ...mainFormik.values
                                        .custom_form_field_enabled[i],
                                      disabled: true,
                                    });
                                    remove(i);
                                  }}
                                  index={i}
                                  customFormFieldType="custom_form_field_enabled"
                                  isSignUpForm={props.initial.is_signup}
                                  isMemberForm={props.initial.is_member_form}
                                />
                              </Paper>
                            </SortableItem>
                          ),
                        )}
                        <div className={classes.addField}>
                          <Button
                            color="primary"
                            variant="outlined"
                            onClick={() => setOpenCreationDialog(true)}
                            disabled={isSubmitting}
                          >
                            <AddIcon className={classes.leftIcon} />
                            {t('customForm.addFieldLong')}
                          </Button>
                          <div className={classes.submit}>
                            {!showInfoDialogOnsave ? (
                              <Button
                                type="submit"
                                id="button_submit_custom_form"
                                disabled={isSubmitting}
                                variant="contained"
                                color="primary"
                              >
                                <SaveIcon className={classes.leftIcon} />
                                {t('customForm.save')}
                              </Button>
                            ) : (
                              <ButtonSaveWithInfo
                                disabled={isSubmitting}
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                  mainFormik.handleSubmit();
                                  setShowInfoDialogOnSave(false);
                                }}
                              >
                                <SaveIcon className={classes.leftIcon} />
                                {t('customForm.save')}
                              </ButtonSaveWithInfo>
                            )}
                          </div>
                        </div>
                        {(openFieldCreationDialog || initialFieldWithIndex) && (
                          <CustomFormFieldBuilderDialog
                            open={openFieldCreationDialog}
                            handleClose={() => {
                              setOpenCreationDialog(false);
                              setInitialFieldWithIndex(null);
                            }}
                            onSubmit={(field) => {
                              updateCustomFormField(
                                field,
                                replace,
                                push,
                                mainFormik.values,
                              );
                            }}
                            initial={initialFieldWithIndex?.field}
                            tag_groups={props.tag_groups}
                            tags={props.tags}
                            registeredSignUpQuestions={
                              registeredSignUpQuestions
                            }
                          />
                        )}
                      </Container>
                    </>
                  )}
                </FieldArray>
              </List>
            </>
            {!!(
              mainFormik.values.custom_form_field_disabled &&
              mainFormik.values.custom_form_field_disabled.length
            ) && (
              <>
                <div>
                  <ButtonBase
                    className={classes.buttonTitle}
                    onClick={() => setShowDisabledField(!showDisabledField)}
                  >
                    <Typography variant="h5" component="h2">
                      {`${t('customForm.disabledCustomFormField')} (${
                        (mainFormik.values.custom_form_field_disabled &&
                          mainFormik.values.custom_form_field_disabled
                            .length) ||
                        0
                      })`}
                    </Typography>

                    {showDisabledField ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ButtonBase>
                  <Divider />
                </div>
                <Collapse in={showDisabledField}>
                  <Paper>
                    <FieldArray name="custom_form_field_disabled">
                      {({
                        remove,
                        form: {
                          values: {
                            custom_form_field_enabled,
                            custom_form_field_disabled,
                          },
                        },
                      }) => (
                        <>
                          {custom_form_field_disabled.map(
                            (field: CustomFormField, i: number) => (
                              <Form>
                                <CustomFormFieldListItem
                                  key={`disabled_field${i}`}
                                  customFormField={field}
                                  onClickRestore={() => {
                                    custom_form_field_enabled.push({
                                      ...mainFormik.values
                                        .custom_form_field_disabled[i],
                                      disabled: false,
                                    });
                                    remove(i);
                                  }}
                                  index={i}
                                  customFormFieldType="custom_form_field_disabled"
                                  isSignUpForm={props.initial.is_signup}
                                  isMemberForm={props.initial.is_member_form}
                                />
                              </Form>
                            ),
                          )}
                        </>
                      )}
                    </FieldArray>
                  </Paper>
                </Collapse>
              </>
            )}
          </form>
        )}
      </Formik>
    </>
  );
}
const styles = (theme: Theme) => ({
  listitem: {
    display: 'flex',
    flexDirection: 'row',
  },
  type: {
    marginRight: theme.spacing(6),
  },
  label: {
    width: '60%',
  },
  mandatory: {
    width: '10%',
  },
  actions: {
    width: '20%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
  alignRight: {
    marginRight: theme.spacing(6),
  },
  marginRight: {
    marginRight: theme.spacing(6),
  },
  alignLeft: {
    marginLeft: theme.spacing(0),
  },
  buttonTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  submit: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  addField: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paperItem: {
    width: '100%',
  },
  formChangeContainer: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${amber[900]}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  formNoChangeContainer: {
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${green[600]}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  noChange: {
    color: green[600],
    marginRight: theme.spacing(1),
  },
  changeWarning: {
    color: amber[900],
    marginRight: theme.spacing(1),
  },
  noChangeWarning: {
    color: green[600],
    marginRight: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormConfigurationTable);
