import React from 'react';

import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/Info';
import { TFunction } from 'i18next';
import { Theme } from '@material-ui/core/styles';
import { push as pushRouter } from 'connected-react-router';
import Button from '@material-ui/core/Button';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { CUSTOM_FORM_CSS_VARIANT_ACTIVATED } from '#src/libs/custom-form/constants';
import { OptionCallback } from '../../state/types';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import CustomFormListItem from '../../libs/custom-form/components/CustomFormListItem.component';
import withTitle from '../../hocs/with-title.hoc';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import {
  fetchAllCustomForm as fetchAllCustomFormAction,
  upsertCustomForm,
  disableCustomForm,
  restoreCustomForm as restoreCustomFormAction,
  duplicateCustomForm as duplicateCustomFormAction,
  fetchAllCustomFormDisplayRule,
} from '../../libs/custom-form/actions';
import {
  getAllCustomForm,
  withDisplayRule,
  getCustomFormWithEnableField,
} from '../../libs/custom-form/selectors';
import CustomFormConsumerView from '../../libs/custom-form/components/consumer-form/CustomFormView.form';
import CustomFormCreateDialog from '../../libs/custom-form/components/CustomFormCreateDialog.component';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';
import type { CustomForm } from '../../libs/custom-form/types';
import CustomFormList from '../../libs/custom-form/components/CustomFormList.component';
import CustomFormDisplayRulePanel from '../../libs/custom-form/components/display-rule/CustomFormDisplayRulePanel.component';
import ModalConfirm from '#src/components/ModalConfirm.component';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

type CustomFormOption = {
  label: string;
  value: number;
  customform: CustomForm;
  onClick: (id: number) => void;
  onClickEdit: (id: number) => void;
  onClickDelete: (id: number) => void;
  selected: boolean;
  onClickDuplicate: (id: number) => void;
};

const searchBarAdditionalParams = {
  disabled: false,
  is_signup: false,
  is_member_form: false,
};

const Option: React.FC<OptionPropsWithData<CustomFormOption>> = (props) => (
  <CustomFormListItem divider showQuestionCount {...props.data} />
);

type State = {
  openCreateDialog: boolean;
  openEditDialog: boolean;
  showDisabledForms: boolean;
  customFormIdToDelete: number | null;
};

type OwnProps = {
  customFormList: Array<any>;
};

type StateHandlerInit = {
  openCreateDialog: boolean;
  customFormSelected?: number;
  loading: boolean;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps &
  ConnectedProps &
  StateHandlerType &
  WithObjectSearch;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export class CustomFormListPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openCreateDialog: false,
      openEditDialog: false,
      customFormIdToDelete: null,
      showDisabledForms: true,
    };
  }

  componentDidMount() {
    this.props.fetchAllCustomForm();
    this.props.fetchAllCustomFormDisplayRule();
  }

  selected = (id: number) => {
    if (id === this.props.customFormSelected) {
      this.props.goToEdit(id);
    } else {
      this.props.setCustomFormSelected(id);
    }
  };

  handleConfirmDeleteDialog = () => {
    this.props.disableCustomForm(this.state.customFormIdToDelete);
    this.setState({ customFormIdToDelete: null });
  };

  handleCancelDeleteDialog = () =>
    this.setState({ customFormIdToDelete: null });

  setCustomFormIdToDelete = (id: number) =>
    this.setState({ customFormIdToDelete: id });

  customFormOptionsFormatter = (
    customForms: CustomForm[],
  ): CustomFormOption[] =>
    customForms.map((customForm) => {
      return {
        key: customForm.id,
        label: customForm.name,
        customform: customForm,
        onClick: (id: number) => this.selected(id),
        onClickDelete: this.setCustomFormIdToDelete,
        onClickDuplicate: (id) => {
          this.props.duplicateCustomForm(id, {
            onSuccess: (payload) =>
              // @ts-expect-error
              this.props.goToEdit(payload.id),
          });
        },
        onClickEdit: this.props.goToEdit,
        selected:
          this.props.customFormSelected &&
          customForm.id === this.props.customFormSelected,
        value: customForm.id,
      };
    });

  onShowDisabled = () => {
    this.setState((prevState) => ({
      ...prevState,
      showDisabledForms: !prevState.showDisabledForms,
    }));
  };

  render() {
    const { customFormList, t, classes } = this.props;
    if (this.props.customFormLoading) {
      return <BackofficeLinearProgress />;
    }

    return (
      <div className={classes.container}>
        {(!customFormList ||
          (customFormList && customFormList.length === 0)) && (
          <IsEmptyList
            button={t('customForm.addCustomFrom')}
            onCreate={() => this.props.setOpenCreateDialog(true)}
            text={t('customForm.noCustomForm')}
          />
        )}

        <Grid container direction="row" spacing={3}>
          <Grid item md={6} xs={12}>
            {customFormList && customFormList.length > 0 ? (
              <>
                <div className={classes.search}>
                  <ObjectSearchComponent
                    additionalParams={searchBarAdditionalParams}
                    blurInputOnSelect={false}
                    components={{
                      Option,
                    }}
                    optionsFormatter={this.customFormOptionsFormatter}
                    placeholder={this.props.t('customForm.search')}
                    searchedObjectType="custom_form"
                    variant="underlined"
                  />
                </div>
                <Paper>
                  {this.props.customFormEdtionLoading && (
                    <LinearProgress color="primary" />
                  )}
                  {customFormList && (
                    <CustomFormList
                      customFormList={customFormList.filter(
                        (form: CustomForm) => !form.disabled,
                      )}
                      customFormSelected={this.props.customFormSelected}
                      onClick={(id: number) => this.selected(id)}
                      onClickDelete={this.setCustomFormIdToDelete}
                      onClickDuplicate={(id: number) =>
                        this.props.duplicateCustomForm(id, {
                          onSuccess: (payload) =>
                            // @ts-expect-error
                            this.props.goToEdit(payload.id),
                        })
                      }
                      onClickEdit={(id: number) => this.props.goToEdit(id)}
                    />
                  )}
                </Paper>
                {!!customFormList.filter((form: CustomForm) => form.disabled)
                  .length && (
                  <div>
                    <ButtonBase
                      className={classes.buttonTitle}
                      disabled={
                        customFormList &&
                        customFormList.filter(
                          (form: CustomForm) => form.disabled,
                        ).length === 0
                      }
                      onClick={this.onShowDisabled}
                    >
                      <Typography variant="h5">
                        {`${t('customForm.disabledCustomForm')} (${
                          (customFormList &&
                            customFormList.filter(
                              (form: CustomForm) => form.disabled,
                            ).length) ||
                          0
                        })`}
                      </Typography>

                      {this.state.showDisabledForms ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </ButtonBase>
                    <Divider />
                    <Collapse in={this.state.showDisabledForms}>
                      <Paper>
                        {customFormList && (
                          <CustomFormList
                            customFormList={customFormList.filter(
                              (form: CustomForm) => form.disabled,
                            )}
                            customFormSelected={this.props.customFormSelected}
                            onClick={(id: number) => {
                              this.selected(id);
                            }}
                            onClickEdit={(id: number) =>
                              this.props.goToEdit(id)
                            }
                            onRestore={(id: number) =>
                              this.props.restoreCustomForm(id)
                            }
                          />
                        )}
                      </Paper>
                    </Collapse>
                  </div>
                )}
              </>
            ) : null}
          </Grid>
          <Grid item md={6} xs={12}>
            {this.props.customFormSelected ? (
              <>
                <div className={classes.row}>
                  <Typography variant="h5">
                    {/* @ts-expect-error */}
                    {this.props.customForm.name}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => this.props.setOpenCreateDialog(true)}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
                <Divider className={classes.divider} />
                <Typography className={classes.divider} variant="h6">
                  {t('customForm.content')}
                </Typography>
                <div className={classes.topButton}>
                  <Button
                    color="primary"
                    onClick={() =>
                      this.props.goToEdit(this.props.customFormSelected)
                    }
                    variant="contained"
                  >
                    <ArrowForwardIcon className={classes.leftIcon} />
                    {t('customForm.actions.configure')}
                  </Button>

                  <Button
                    className={classes.button}
                    color="secondary"
                    onClick={() =>
                      this.props.goToStatistics(this.props.customFormSelected)
                    }
                    variant="contained"
                  >
                    <EqualizerIcon className={classes.leftIcon} />
                    {t('customForm.actions.statistics')}
                  </Button>
                </div>
                <div className={classes.displayRulePanel}>
                  <CustomFormDisplayRulePanel
                    withItemDivider
                    // @ts-expect-error
                    customForm={this.props.customForm}
                  />
                </div>
                <Typography variant="h6"> {t('customForm.preview')}</Typography>
                <Paper className={classes.paperContainer}>
                  <CustomFormConsumerView
                    key={this.props.customFormSelected}
                    asManager
                    shouldWrapLayerInCssHoc
                    // @ts-expect-error
                    initial={this.props.customForm}
                    isCssVariantActivated={CUSTOM_FORM_CSS_VARIANT_ACTIVATED}
                  />
                </Paper>
              </>
            ) : (
              <>
                {this.props.customFormList &&
                this.props.customFormList.length ? (
                  <div className={classes.emptyContainer}>
                    <div className={classes.column}>
                      <InfoIcon className={classes.leftIcon} />
                      <Typography variant="caption">
                        {t('customForm.selectCustomForm')}
                      </Typography>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </Grid>
        </Grid>
        {this.props.openCreateDialog && (
          <CustomFormCreateDialog
            // @ts-expect-error
            customFormSelected={this.props.customForm}
            handleClose={() => {
              this.props.setOpenCreateDialog(false);
              this.props.setCustomFormSelected(null);
            }}
            onSubmit={this.props.upsertCustomForm}
            open={this.props.openCreateDialog}
          />
        )}
        <ModalConfirm
          handleCancel={this.handleCancelDeleteDialog}
          handleConfirm={this.handleConfirmDeleteDialog}
          open={!!this.state.customFormIdToDelete}
          options={{
            title: 'marketing:customForm.modal.delete.title',
            cancel: 'marketing:customForm.modal.delete.cancel',
            confirm: 'marketing:customForm.modal.delete.confirm',
            Content: () => (
              <p>{t('marketing:customForm.modal.delete.content')}</p>
            ),
          }}
        />
        <BottomActionButtons
          onCreate={async () => {
            this.props.setCustomFormSelected(null);
            this.props.setOpenCreateDialog(true);
          }}
          onCreateLabel={t('customForm.addCustomFrom')}
        />
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  buttonTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  container: {
    padding: theme.spacing(2),
  },
  emptyContainer: {
    padding: theme.spacing(10),
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  search: { marginBottom: theme.spacing(2) },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
    borderTop: '0px',
    boderBottom: '0px',
  },
  listitem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topButton: {
    paddingBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  button: {
    marginLeft: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  paperContainer: {
    padding: theme.spacing(6),
  },
  displayRulePanel: {
    paddingBottom: theme.spacing(2),
  },
});

const mapStateToProps = (
  state: RootState,
  { customFormSelected }: { customFormSelected: number },
) => ({
  // eslint-disable-next-line
  theme: state.theme.theme,
  // @ts-expect-error
  customForm: withDisplayRule(getCustomFormWithEnableField)(
    state,
    // @ts-expect-error
    customFormSelected,
  ),
  customFormList: withDisplayRule(getAllCustomForm)(state),
  customFormLoading: state.customForm.loading,
  customFormEdtionLoading: state.customForm.upsert.loading,
});
const mapDispatchToProps = {
  fetchAllCustomForm: fetchAllCustomFormAction,
  upsertCustomFromAction: upsertCustomForm,
  disableCustomFormAction: disableCustomForm,
  restoreCustomForm: restoreCustomFormAction,
  duplicateCustomForm: duplicateCustomFormAction,
  push: pushRouter,
  fetchAllCustomFormDisplayRule,
};
const mapWithHandlers = {
  upsertCustomForm:
    (props: OwnAndConnectedProps) =>
    (form: CustomForm, options?: OptionCallback) => {
      props.setLoading(true);
      if (form.id) {
        props.upsertCustomFromAction(form, {
          onSuccess: () => {
            props.setOpenCreateDialog(false);
            props.setLoading(false);
          },
          onError: () => {
            props.setOpenCreateDialog(false);
            props.setLoading(false);
          },
        });
      } else {
        props.upsertCustomFromAction(
          {
            ...form,
            company: props.theme.company,
            custom_form_field: [],
          },
          {
            // @ts-expect-error
            onSuccess: (createdCustomForm: CustomForm) => {
              if (options && options.onSuccess) options.onSuccess();
              props.setOpenCreateDialog(false);
              props.setLoading(false);
              createdCustomForm?.id &&
                props.push(
                  `/custom-form/details/${createdCustomForm.id}/general`,
                );
            },
            onError: () => {
              if (options && options.onError) options.onError();
              props.setOpenCreateDialog(false);
              props.setLoading(false);
            },
          },
        );
      }
    },
  disableCustomForm: (props: OwnAndConnectedProps) => (formId: number) => {
    props.disableCustomFormAction(formId, {
      onSuccess: () => {
        props.fetchAllCustomFormDisplayRule();
        props.refreshOptions('custom_form', searchBarAdditionalParams);
      },
    });
  },
  goToEdit: (props: OwnAndConnectedProps) => (formId: number) => {
    props.push(`custom-form/details/${formId}/general`);
  },
  goToStatistics: (props: OwnAndConnectedProps) => (formId: number) => {
    props.push(`custom-form/details/${formId}/statistics`);
  },
};
const withStateHandlersInit: StateHandlerInit = {
  openCreateDialog: false,
  customFormSelected: null,
  loading: false,
};
const withStateHandlersSetter = {
  setOpenCreateDialog: () => (openCreateDialog: boolean) => {
    return { openCreateDialog };
  },
  setCustomFormSelected: () => (customFormId: number | null) => {
    return { customFormSelected: customFormId };
  },
  setLoading: () => (loading: boolean) => {
    return { loading };
  },
};
export default compose<any, OwnProps>(
  withTranslation(['marketing']),
  // @ts-expect-error
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) => t('customForm.title')),
  withObjectSearch,
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(CustomFormListPage);
