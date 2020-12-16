// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as pushRouter } from 'connected-react-router';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import themeSelectors from '../../libs/theme/selectors.ts';
import { snackbarSuccess } from '../../actions/snackbar.actions';

import withTitle from '../../hocs/with-title.hoc';
import {
  getPrivatePassAvailableListWithPrivateService,
  getDisabledPrivatePassAvailableListWithPrivateService,
} from '../../libs/private-service/selectors/private-pass';
import { getPrivateServices } from '../../libs/private-service/selectors/private-service.ts';
import {
  fetchPrivatePassList,
  fetchAllPrivateServices,
  createOrUpdatePrivatePass,
  deleteCompatibleServicePass,
  createCompatibleServicePass,
  deletePrivatePass,
  restorePrivatePass,
} from '../../libs/private-service/actions.ts';
import PrivatePassListItem from '../../libs/private-service/components/pass/PrivatePassListItem.component';
import PrivatePassDetail from '../../libs/private-service/components/pass/PrivatePassDetail.component';
import PrivatePassForm from '../../libs/private-service/components/pass/PrivatePassForm.component';
import type {
  PrivatePass,
  PrivateService,
} from '../../libs/private-service/types.ts';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type Props = {
  loading: boolean,
  fetchPrivatePassList: () => void,
  fetchAllPrivateServices: () => void,
  privatePassList: Array<PrivatePass>,
  disabledPrivatePassList: Array<PrivatePass>,
  private_services: Array<PrivateService>,
  theme: Theme,
  selectedPassId: number,
  deleteCompatibleServicePass: (id: number) => void,
  createCompatibleServicePass: (any) => void,
  openCreateForm: boolean,
  setOpenCreateForm: (boolean) => void,
  createOrUpdatePrivatePass: (
    data: any,
    id: ?number,
    options: ?{ onSuccess?: () => void, onError?: () => void },
  ) => void,
  classes: Object,
  t: TFunction,

  setOpenDeletePassDialog: (id: number) => void,
  openDeletePassDialog: number,
  showDisabled: boolean,
  setShowDisabled: (show: boolean) => void,
  deletePrivatePass: (id: number) => void,
  restorePrivatePass: (id: number) => void,
  snackbarSuccess: (string) => void,
  goToPass: (id: number) => void,
};

export class PrivatePassList extends React.Component<Props> {
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

  render() {
    if (
      (this.props.privatePassList || []).length +
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
      <Grid container>
        <Grid item xs={12} md={6}>
          <div className={this.props.classes.leftPanel}>
            <Paper>
              <List disablePadding>
                {this.props.privatePassList.map((pass) => (
                  <PrivatePassListItem
                    pass={pass}
                    key={pass.id}
                    divider
                    onClick={() => {
                      this.props.goToPass(pass.id);
                    }}
                    onDelete={() => this.props.setOpenDeletePassDialog(pass.id)}
                    updatePrivatePass={this.props.createOrUpdatePrivatePass}
                  />
                ))}
              </List>
            </Paper>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          {this.props.selectedPassId ? (
            <PrivatePassDetail
              private_services={this.props.private_services}
              theme={this.props.theme}
              snackbarSuccess={this.props.snackbarSuccess}
              updatePrivatePass={this.props.createOrUpdatePrivatePass}
              onDelete={() =>
                this.props.setOpenDeletePassDialog(this.props.selectedPassId)
              }
              deleteCompatibleServicePass={
                this.props.deleteCompatibleServicePass
              }
              createCompatibleServicePass={
                this.props.createCompatibleServicePass
              }
              pass={this.props.privatePassList.find(
                (p) => p.id === this.props.selectedPassId,
              )}
            />
          ) : null}
        </Grid>
        {(this.props.disabledPrivatePassList || []).length ? (
          <Grid item xs={12} md={6}>
            <div className={this.props.classes.leftPanel}>
              <ButtonBase
                className={this.props.classes.buttonTitle}
                onClick={this.onShowDisabled}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  className={this.props.classes.titleContainer}
                >
                  {`${this.props.t('privatePass.disabledTitle')} (${
                    (this.props.disabledPrivatePassList || []).length
                  })`}
                </Typography>

                {this.props.showDisabled ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ButtonBase>
              <Divider />
              <Collapse in={this.props.showDisabled}>
                <List disablePadding>
                  {this.props.disabledPrivatePassList.map((pass) => (
                    <PrivatePassListItem
                      pass={pass}
                      key={pass.id}
                      onRestore={() => this.restorePrivatePass(pass.id)}
                      divider
                    />
                  ))}
                </List>
              </Collapse>
            </div>
          </Grid>
        ) : null}
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
          <DialogTitle>{this.props.t('privatePass.delete.title')}</DialogTitle>
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
      </Grid>
    );
  }
}

const styles = (theme) => ({
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
});

export default compose(
  routerParamsToProps({
    id: 'id:number',
  }),
  withTranslation(['privateService']),
  withTitle(({ t }) => t('pageTitles.passList')),
  withStyles(styles),
  connect(
    (state) => ({
      privatePassList: getPrivatePassAvailableListWithPrivateService(state),
      disabledPrivatePassList: getDisabledPrivatePassAvailableListWithPrivateService(
        state,
      ),
      private_services: getPrivateServices(state),
      loading: state.privateService.privatePass.loading,
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchPrivatePassList,
      fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
      goToPass: (id: number) => pushRouter(`/private-service/pass/${id}`),
      createOrUpdatePrivatePass,
      createCompatibleServicePass,
      deleteCompatibleServicePass,
      deletePrivatePass,
      restorePrivatePass,
      snackbarSuccess,
    },
  ),
  withState('openCreateForm', 'setOpenCreateForm', false),
  withState('selectedPassId', 'setSelectedPass', null),
  withState('openDeletePassDialog', 'setOpenDeletePassDialog', null),
  withState('showDisabled', 'setShowDisabled', false),
)(PrivatePassList);
