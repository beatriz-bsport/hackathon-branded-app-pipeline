// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';

import { push as pushRouter } from 'connected-react-router';
import Collapse from '@material-ui/core/Collapse';
import Fuse, { FuseOptions } from 'fuse.js';
import { Theme } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import themeSelectors from '../../libs/theme/selectors';
import withTitle from '../../hocs/with-title.hoc';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  getPrivatePassCustomerEnabled,
  getAvailablePrivatePasses,
  getDisabledPrivatePassAvailableListWithPrivateService,
} from '../../libs/private-service/selectors/private-pass';
import {
  fetchPrivatePassList,
  fetchAllPrivateServices,
  createOrUpdatePrivatePass,
  deletePrivatePass,
  restorePrivatePass,
  editOrderPrivatePass,
} from '../../libs/private-service/actions';
import PrivatePassListItem from '../../libs/private-service/components/pass/PrivatePassListItem.component';
import PrivatePassForm from '../../libs/private-service/components/pass/PrivatePassForm.component';
import type { PrivatePass } from '../../libs/private-service/types';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import FuzeSearch from '../../components/FuzeSearch.component';
import { Coach as AssociatedCoach } from '../../libs/associated-coach/types';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import { PrivatePassCategory } from '../../libs/private-service/components/category/PrivatePassCategory.component';

type StateHandlerInit = {
  openCreateForm: boolean;
  openDeletePassDialog: null | number;
  showDisabled: boolean;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = ConnectedProps &
  StateHandlerType &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  searchText: string;
  searchResult: Array<AssociatedCoach>;
};

export class PrivatePassList extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
  };

  componentDidMount() {
    this.props.fetchPrivatePassList();
    this.props.fetchAllPrivateServices();
  }

  createOrUpdatePass = (data: any) => {
    this.props.createOrUpdatePrivatePass(data, data.id, {
      onSuccess: () => {
        this.props.setOpenCreateForm(false);
        this.props.fetchPrivatePassList();
      },
    });
  };

  onShowDisabled = () => {
    this.props.setShowDisabled(!this.props.showDisabled);
  };

  restorePrivatePass = async (id: number) => {
    if (this.props.disabledPrivatePassList.length === 1) {
      this.props.setShowDisabled(false);
    }
    this.props.restorePrivatePass(id);
  };

  changeSearch = (fuse: Fuse<PrivatePass, FuseOptions<PrivatePass>>) => (
    ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  render() {
    const { classes, t } = this.props;
    if (
      this.props.privatePassList +
        (this.props.disabledPrivatePassList || []).length ===
        0 &&
      !this.props.loading
    ) {
      return (
        <div>
          <IsEmptyList
            text={this.props.t('noPrivatePass')}
            button={this.props.t('privatePass.list.createButton')}
            onCreate={() => this.props.setOpenCreateForm(true)}
            onCreateLabel={this.props.t('privatePass.list.createButton')}
          />
          <Dialog open={this.props.openCreateForm}>
            <DialogTitle>{this.props.t('privatePass.form.title')}</DialogTitle>
            <DialogContent>
              <PrivatePassForm
                onSubmit={this.createOrUpdatePass}
                onCancel={() => this.props.setOpenCreateForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      );
    }
    return (
      <div>
        {!!this.props.loading && <BackofficeLinearProgress />}
        <div className={classes.search}>
          <FuzeSearch
            searchText={this.state.searchText}
            clearSearch={this.clearSearch}
            changeSearch={this.changeSearch}
            items={this.props.privatePassListCustomerEnabled}
            placeholder={t('searshAppointmentPass')}
            searchFields={['name']}
            searchResult={this.state.searchResult}
          />
          <Paper
            className={
              this.state.searchResult.length > 0 && this.state.searchText !== ''
                ? classes.searchPaperDisplayed
                : classes.searchPaperHidden
            }
          >
            <Collapse
              in={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
              }
            >
              <List disablePadding>
                {this.state.searchResult
                  .filter((pp) => !pp.manager_only)
                  .map((pass) => (
                    <PrivatePassListItem
                      pass={pass}
                      key={pass.id}
                      divider
                      onClick={() => {
                        this.props.goToPass(pass.id);
                      }}
                      onDelete={() =>
                        this.props.setOpenDeletePassDialog(pass.id)
                      }
                      updatePrivatePass={this.props.createOrUpdatePrivatePass}
                    />
                  ))}
              </List>
            </Collapse>
          </Paper>
        </div>
        <>
          <Typography variant="h5" className={this.props.classes.sectionTitle}>
            {t('privatePass.list.availableCustomer')}
          </Typography>
          <Divider className={this.props.classes.divider} />
          <div className={this.props.classes.leftPanel}>
            {!this.props.privatePassList.length && !this.props.loading && (
              <Typography variant="caption">
                {this.props.t('privatePass.list.isEmpty')}
              </Typography>
            )}
            <PrivatePassCategory
              privatePassList={this.props.privatePassList}
              goToPass={this.props.goToPass}
              setOpenDeletePassDialog={this.props.setOpenDeletePassDialog}
              updatePrivatePass={this.props.createOrUpdatePrivatePass}
              updatePassOrder={this.props.editOrderPrivatePass}
            />
          </div>
          <Dialog open={this.props.openCreateForm}>
            <DialogTitle>{this.props.t('privatePass.form.title')}</DialogTitle>
            <DialogContent>
              <PrivatePassForm
                onSubmit={this.createOrUpdatePass}
                onCancel={() => this.props.setOpenCreateForm(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={this.props.openDeletePassDialog}>
            <DialogTitle>
              {this.props.t('privatePass.delete.title')}
            </DialogTitle>
            <DialogContent>
              {this.props.t('privatePass.delete.explain')}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.props.setOpenDeletePassDialog(null)}>
                {this.props.t('privatePass.delete.cancel')}
              </Button>
              <Button
                onClick={() => {
                  this.props.deletePrivatePass(this.props.openDeletePassDialog);
                  this.props.setOpenDeletePassDialog(null);
                }}
              >
                {this.props.t('privatePass.delete.submit')}
              </Button>
            </DialogActions>
          </Dialog>
          <Fab
            className={this.props.classes.addButton}
            variant="extended"
            color="primary"
            onClick={() => this.props.setOpenCreateForm(true)}
          >
            <AddIcon className={this.props.classes.leftIcon} />
            {this.props.t('privatePass.list.createButton')}
          </Fab>
        </>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  addButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  leftPanel: {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(2),
    },
  },
  buttonTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
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
  divider: {
    marginBottom: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState) => ({
  privatePassListCustomerEnabled: getPrivatePassCustomerEnabled(state),
  privatePassList: getAvailablePrivatePasses(state),
  disabledPrivatePassList: getDisabledPrivatePassAvailableListWithPrivateService(
    state,
  ),
  loading: state.privateService.privatePass.loading,
  theme: themeSelectors.getTheme(state),
});

const mapDispatchToProps = {
  fetchPrivatePassList,
  fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
  goToPass: (id: number) => pushRouter(`/private-service/pass/${id}`),
  createOrUpdatePrivatePass,
  deletePrivatePass,
  restorePrivatePass,
  editOrderPrivatePass,
};

const withStateHandlersInit: StateHandlerInit = {
  openCreateForm: false,
  openDeletePassDialog: null,
  showDisabled: false,
};

const withStateHandlersSetter = {
  setOpenCreateForm: () => (openCreateForm: boolean) => {
    return { openCreateForm };
  },
  setOpenDeletePassDialog: () => (openDeletePassDialog: number | null) => {
    return { openDeletePassDialog };
  },
  setShowDisabled: () => (showDisabled: boolean) => {
    return { showDisabled };
  },
};

export default compose(
  routerParamsToProps({
    id: 'id:number',
  }),
  withTranslation(['privateService']),
  withTitle(({ t }) => t('pageTitles.passList')),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
)(PrivatePassList);
