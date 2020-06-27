// @flow
import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import withStyles from '@material-ui/core/styles/withStyles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import RedButton from '../../components/button/RedButton.component';

type Props = {
  t: TFunction,
  classes: Object,
  subShop: SubShop,
  createOrUpdateSubShop: (data: [*]) => void,
  onDelete: (id: number) => void,
  children: any,
};

type State = {
  editMode: boolean,
  newItemFormDisplayed: boolean,
  itemInEditMode: Array<number>,
  newName: ?string,
};

export class SubShopList extends Component<Props, State> {
  state = {
    editMode: false,
    newName: null,
  };

  handleChangeName = (event) => {
    this.setState({ newName: event.target.value });
  };

  toogleEditMode = () => {
    const { editMode } = this.state;
    const { subShop } = this.props;
    if (editMode) {
      this.setState({ editMode: false });
    } else {
      this.setState({ editMode: true, newName: subShop.name });
    }
  };

  showSubShopDeleteDialog = () => {
    this.setState({ showSubShopDeleteDialog: true });
  };

  updateSubShop = () => {
    this.props.createOrUpdateSubShop({
      name: this.state.newName,
      id: this.props.subShop.id,
    });
    this.setState({ editMode: false });
  };

  renderTitle = () => {
    const { classes, subShop } = this.props;
    const { editMode, newName } = this.state;
    if (editMode) {
      return (
        <Grid container direction="row" spacing={1} alignItems="center">
          <Grid item>
            <TextField
              autoFocus
              onChange={this.handleChangeName}
              value={newName}
            />
          </Grid>
          <Grid item>
            <IconButton onClick={this.updateSubShop}>
              <SaveIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={this.toogleEditMode}>
              <CancelIcon />
            </IconButton>
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.title} variant="h4">
            {subShop.name}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <IconButton onClick={this.toogleEditMode}>
                <EditIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={this.showSubShopDeleteDialog}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderSubShopDeleteDialog = () => {
    const { showSubShopDeleteDialog } = this.state;
    const { t } = this.props;
    if (showSubShopDeleteDialog) {
      return (
        <Dialog
          open={showSubShopDeleteDialog}
          onClose={() => this.setState({ showSubShopDeleteDialog: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {t('shop.subShop.delete.title')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t('shop.subShop.delete.explain')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ showSubShopDeleteDialog: false })}
              color="secondary"
            >
              {t('common.cancel')}
            </Button>
            <RedButton onClick={this.props.onDelete} color="primary" autoFocus>
              {t('common.confirm')}
            </RedButton>
          </DialogActions>
        </Dialog>
      );
    }
    return null;
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.renderTitle()}
        <Divider className={classes.divider} />
        {this.renderSubShopDeleteDialog()}
        {this.props.children}
      </div>
    );
  }
}

const styles = (theme) => ({
  addIcon: {
    margin: theme.spacing(2),
    height: 64,
    width: 64,
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(3),
  },
});

export default withStyles(styles)(withTranslation()(SubShopList));
