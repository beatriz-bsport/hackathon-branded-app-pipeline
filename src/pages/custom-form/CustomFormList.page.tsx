import React, { SyntheticEvent } from 'react';

import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
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
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import FuzeSearch from '../../components/FuzeSearch.component';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import CustomFormListItem from '../../libs/custom-form/components/CustomFormListItem.component';
import withTitle from '../../hocs/with-title.hoc';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import {
  fetchAllCustomForm as fetchAllCustomFormAction,
  upsertCustomForm,
  disableCustomForm as disableCustomFormAction,
  restoreCustomForm as restoreCustomFormAction,
  duplicateCustomForm as duplicateCustomFormAction,
} from '../../libs/custom-form/actions';
import { getAllCustomForm } from '../../libs/custom-form/selectors';
import CustomFormConsumerView from '../../libs/custom-form/components/consumer-form/CustomForm.form';
import CustomFormCreateDialog from '../../libs/custom-form/components/CustomFormCreateDialog.component';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';
import type { CustomForm } from '../../libs/custom-form/types';
import CustomFormList from '../../libs/custom-form/components/CustomFormList.component.tsx';

type State = {
  openCreateDialog: boolean;
  openEditDialog: boolean;
  showDisabledForms: boolean;
  searchText: string;
  searchResult: Array<CustomForm>;
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
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export class CustomFormListPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchText: '',
      searchResult: [],
      openCreateDialog: false,
      openEditDialog: false,
      showDisabledForms: true,
    };
  }

  componentDidMount() {
    this.props.fetchAllCustomForm();
  }

  selected = (id: number) => {
    if (id === this.props.customFormSelected) {
      this.props.goToEdit(id);
    } else {
      this.props.setCustomFormSelected(id);
    }
  };

  changeSearch = (fuse) => (ev: SyntheticEvent<HTMLElement>) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

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
            text={t('customForm.noCustomForm')}
            button={t('customForm.addCustomFrom')}
            onCreate={() => this.props.setOpenCreateDialog(true)}
          />
        )}

        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} md={6}>
            {customFormList && customFormList.length > 0 ? (
              <>
                <div className={classes.search}>
                  <FuzeSearch
                    searchText={this.state.searchText}
                    clearSearch={this.clearSearch}
                    changeSearch={this.changeSearch}
                    items={customFormList.filter(
                      (customform) => !customform.disabled,
                    )}
                    placeholder={this.props.t('customForm.search')}
                    searchFields={['name', 'description']}
                    searchResult={this.state.searchResult}
                  />
                  <Paper
                    className={
                      this.state.searchResult.length > 0 &&
                      this.state.searchText !== ''
                        ? classes.searchPaperDisplayed
                        : null
                    }
                  >
                    <Collapse
                      in={
                        this.state.searchResult.length > 0 &&
                        this.state.searchText !== ''
                      }
                    >
                      <List
                        component="nav"
                        disablePadding
                        className={classes.list}
                      >
                        {this.state.searchResult
                          .filter((form) => !form.disabled)
                          .map((customform) => (
                            <CustomFormListItem
                              key={customform.id}
                              onClick={(id) => {
                                this.selected(id);
                              }}
                              onClickEdit={this.props.goToEdit}
                              onClickDelete={(id) =>
                                this.props.disableCustomForm(id)
                              }
                              selected={
                                this.props.customFormSelected &&
                                customform.id === this.props.customFormSelected
                              }
                              customform={customform}
                              onClickDuplicate={(id) =>
                                this.props.duplicateCustomForm(id, {
                                  onSuccess: (newId) =>
                                    this.props.goToSelected(newId),
                                })
                              }
                            />
                          ))}
                      </List>
                    </Collapse>
                  </Paper>
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
                      onClick={(id: number) => {
                        this.selected(id);
                      }}
                      onClickEdit={this.props.goToEdit}
                      onClickDelete={(id: number) =>
                        this.props.disableCustomForm(id)
                      }
                      onClickDuplicate={(id: number) =>
                        this.props.duplicateCustomForm(id)
                      }
                      customFormSelected={this.props.customFormSelected}
                    />
                  )}
                </Paper>
                {!!customFormList.filter((form: CustomForm) => form.disabled)
                  .length && (
                  <div>
                    <ButtonBase
                      className={classes.buttonTitle}
                      onClick={this.onShowDisabled}
                      disabled={
                        customFormList &&
                        customFormList.filter((form) => form.disabled)
                          .length === 0
                      }
                    >
                      <Typography variant="h5" component="h2">
                        {`${t('customForm.disabledCustomForm')} (${
                          (customFormList &&
                            customFormList.filter((form) => form.disabled)
                              .length) ||
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
                            onClick={(id: number) => {
                              this.selected(id);
                            }}
                            onClickEdit={this.props.goToEdit}
                            onRestore={(id: number) =>
                              this.props.restoreCustomForm(id)
                            }
                            customFormSelected={this.props.customFormSelected}
                          />
                        )}
                      </Paper>
                    </Collapse>
                  </div>
                )}
              </>
            ) : null}
          </Grid>
          <Grid item xs={12} md={6}>
            {this.props.customFormSelected ? (
              <>
                <div className={classes.row}>
                  <Typography variant="h5">
                    {
                      this.props.customFormDict[this.props.customFormSelected]
                        .name
                    }
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => this.props.setOpenCreateDialog(true)}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
                <Divider className={classes.divider} />
                <Typography variant="h6" className={classes.divider}>
                  {t('customForm.content')}
                </Typography>
                <div className={classes.topButton}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      this.props.goToEdit(this.props.customFormSelected)
                    }
                  >
                    <ArrowForwardIcon className={classes.leftIcon} />
                    {t('customForm.actions.configure')}
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      this.props.goToStatistics(this.props.customFormSelected)
                    }
                    className={classes.button}
                  >
                    <EqualizerIcon className={classes.leftIcon} />
                    {t('customForm.actions.statistics')}
                  </Button>
                </div>
                <Typography variant="h6"> {t('customForm.preview')}</Typography>
                <CustomFormConsumerView
                  key={this.props.customFormSelected}
                  initial={
                    this.props.customFormDict[this.props.customFormSelected]
                  }
                  asManager
                />
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
            customFormSelected={
              this.props.customFormDict[this.props.customFormSelected]
            }
            open={this.props.openCreateDialog}
            onSubmit={this.props.upsertCustomForm}
            handleClose={() => {
              this.props.setOpenCreateDialog(false);
              this.props.setCustomFormSelected(null);
            }}
          />
        )}

        <BottomActionButtons
          onCreateLabel={t('customForm.addCustomFrom')}
          onCreate={async () => {
            this.props.setCustomFormSelected(null);
            this.props.setOpenCreateDialog(true);
          }}
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
});

const mapStateToProps = (state: RootState) => ({
  theme: state.theme.theme,
  customFormDict: state.customForm.byId,
  customFormList: getAllCustomForm(state),
  customFormLoading: state.customForm.loading,
  customFormEdtionLoading: state.customForm.upsert.loading,
});
const mapDispatchToProps = {
  fetchAllCustomForm: fetchAllCustomFormAction,
  upsertCustomFromAction: upsertCustomForm,
  disableCustomForm: disableCustomFormAction,
  restoreCustomForm: restoreCustomFormAction,
  duplicateCustomForm: duplicateCustomFormAction,
  push: pushRouter,
};
const mapWithHandlers = {
  upsertCustomForm: (props: OwnAndConnectedProps) => (form: CustomForm) => {
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
          onSuccess: () => {
            props.setOpenCreateDialog(false);
            props.setLoading(false);
          },
          onError: () => {
            props.setOpenCreateDialog(false);
            props.setLoading(false);
          },
        },
      );
    }
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
  withStyles(styles),
  withTitle(({ t }: { t: TFunction }) => t('customForm.title')),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(CustomFormListPage);
