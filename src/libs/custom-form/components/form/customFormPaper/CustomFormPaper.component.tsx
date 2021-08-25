import React from 'react';
import { compose } from 'recompose';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, FieldArray, Formik, FormikProps } from 'formik';
import Grow from '@material-ui/core/Grow';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
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

import CustomFormFieldListItem from '../../CustomFormFieldListItem.component';
import CustomFormFieldFormDialog from '../../fields-form/customFormFieldBuilder';
import type {
  CustomForm,
  CustomFormField,
  FormikCustomForm,
} from '../../../types';
import { MaterialStyleType } from '../../../../../utils/types';

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
type OwnProps = InitialValues & {
  onSubmit: (customForm: CustomForm) => void;
  setCustomFormView?: (values: CustomForm) => void;
  isSubmitting: boolean;
  handleUpdateView: (customform: CustomForm) => void;
};
type Props = OwnProps &
  WithTranslation &
  FormikProps<InitialValues> &
  OwnProps &
  MaterialStyleType<ReturnType<typeof styles>>;

type FormikChangesLookUpProps = FormikProps<InitialValues> &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
type FormikChangesLookUpState = {
  detectedChanges: boolean;
};

const FormikChangesLookUp = connect<FormikProps<InitialValues>>(
  class __ extends React.Component<
    FormikChangesLookUpProps,
    FormikChangesLookUpState
  > {
    constructor(props: FormikChangesLookUpProps) {
      super(props);
      this.state = {
        detectedChanges: false,
      };
    }

    componentDidUpdate() {
      if (
        !this.state.detectedChanges &&
        this.props.formik &&
        this.props.formik.initialValues &&
        this.props.formik.values &&
        this.props.formik.initialValues !== this.props.formik.values
      ) {
        this.setState({ detectedChanges: true });
      }
    }

    render() {
      const { detectedChanges } = this.state;
      const { t, classes } = this.props;
      return (
        <Grow in={detectedChanges} timeout={1000}>
          <div className={classes.formChangeContainer}>
            <InfoOutlinedIcon className={classes.changeWarning} />

            <Typography variant="caption" className={classes.changeWarning}>
              {t('customForm.changesDetected')}
            </Typography>
          </div>
        </Grow>
      );
    }
  },
);

export function CustomFormAnswer(props: Props) {
  const { t, isSubmitting, classes } = props;
  const [openFieldCreationDialog, setOpenCreationDialog] = React.useState(
    false,
  );
  const [initialFieldWithIndex, setInitialFieldWithIndex] = React.useState(
    null,
  );
  const [showDisabledField, setShowDisabledField] = React.useState(false);
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
  if (props.isSubmitting) {
    return <LinearProgress color="primary" />;
  }
  return (
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
      {(mainFormik) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            mainFormik.handleSubmit();
          }}
        >
          <>
            <FormikChangesLookUp t={t} classes={classes} />
            <List component="nav" disablePadding>
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

                <div className={classes.mandatory}>
                  <Typography variant="subtitle2" component="span">
                    {t('customForm.mandatory')}
                  </Typography>
                </div>

                <div className={classes.actions}>
                  <Typography variant="subtitle2" component="span">
                    {t('customForm.listActions')}
                  </Typography>
                </div>
              </ListItem>
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
                          <SortableItem index={i} key={i}>
                            <Paper className={classes.paperItem}>
                              <CustomFormFieldListItem
                                key={`enabled_field${i}`}
                                {...props}
                                customFormField={field}
                                onClickRequired={() =>
                                  mainFormik.setFieldValue(
                                    `custom_form_field_enabled.${i}.mandatory`,
                                    !mainFormik.values
                                      .custom_form_field_enabled[i].mandatory,
                                  )
                                }
                                onClickEdit={() => handleFieldUpdate(field, i)}
                                onClickDelete={() => {
                                  custom_form_field_disabled.push({
                                    ...mainFormik.values.custom_form_field[i],
                                    disabled: true,
                                  });
                                  remove(i);
                                }}
                                index={i}
                                customFormFieldType="custom_form_field_enabled"
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
                        >
                          <AddIcon className={classes.leftIcon} />
                          {t('customForm.addFieldLong')}
                        </Button>
                        <div className={classes.submit}>
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
                        </div>
                      </div>
                      {openFieldCreationDialog && (
                        <CustomFormFieldFormDialog
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
                          initial={
                            initialFieldWithIndex && initialFieldWithIndex.field
                          }
                          tag_groups={props.tag_groups}
                          tags={props.tags}
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
                        mainFormik.values.custom_form_field_disabled.length) ||
                      0
                    })`}
                  </Typography>

                  {showDisabledField ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
                            <CustomFormFieldListItem
                              key={`disabled_field${i}`}
                              {...props}
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
                            />
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
    justifyContent: 'center',
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
  },
  noChange: {
    color: green[600],
    marginRight: theme.spacing(1),
  },
  changeWarning: {
    color: amber[900],
    marginRight: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});
export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormAnswer);
