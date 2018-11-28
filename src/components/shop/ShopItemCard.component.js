// @flow
import React, { PureComponent } from 'react';

import {
  Typography,
  Card,
  Collapse,
  Divider,
  CardContent,
  Grid,
  IconButton,
  Avatar,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  withStyles,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { ShopItem } from '../../api/types';
import NumericInput from '../input/NumericInput.component';
import RedButton from '../button/RedButton.component';
import { formatAsDate } from '../../datetime';

type Props = {
  item: ShopItem,
  onEdit: () => void,
  onDelete: () => void,
  onEdit: () => void,
  onUpdateProvisions: (qty: number) => void,
  deleteProvisionUpdate: (id: number) => void,
  t: TFunction,
  classes: Object,
};

type State = {
  showHistory: boolean,
};

const ACTION_MODIFY_PROVISION = 1;
const ACTION_DELETE_SHOP_ITEM = 2;

const options = [
  { text: 'form.shop.item.modifyProvisions', action: ACTION_MODIFY_PROVISION },
];

export class ShopItemCard extends PureComponent<Props, State> {
  state = {
    anchorMenu: null,
    openAction: null,
    provisionUpdate: 0,
    showHistory: false,
  };

  handleOpenMenu = (event) => {
    this.setState({ anchorMenu: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ anchorMenu: null, openAction: null });
  };

  handleAction = (action) => {
    this.setState({ openAction: action });
  };

  updateProvision = (event) => {
    this.setState({ provisionUpdate: parseInt(event.target.value, 10) });
  };

  onDelete = () => {
    this.handleCloseMenu();
    this.props.onDelete();
  };

  handleUpdateProvision = () => {
    this.props.onUpdateProvisions(this.state.provisionUpdate);
    this.handleCloseMenu();
  };

  toogleShowProvisionUpdates = () => {
    this.setState((prevState) => ({ showHistory: !prevState.showHistory }));
  };

  renderDialogAction = () => {
    const { openAction, provisionUpdate } = this.state;
    const { t, classes } = this.props;
    switch (openAction) {
      case ACTION_MODIFY_PROVISION: {
        return (
          <Dialog
            open={Boolean(openAction)}
            onClose={this.handleCloseMenu}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t('form.shop.item.updateProvisionTitle')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText className={classes.dialogContentText}>
                {t('form.shop.item.updateProvisionExplain')}
              </DialogContentText>
              <AddIcon className={classes.leftButton} />
              <NumericInput
                value={provisionUpdate}
                type="numeric"
                onChange={this.updateProvision}
                InputProps={{ className: classes.input }}
                disableUnderline
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseMenu} color="secondary">
                {t('common.cancel')}
              </Button>
              <Button
                disabled={!provisionUpdate}
                onClick={this.handleUpdateProvision}
                color="primary"
                autoFocus
              >
                {t('common.confirm')}
              </Button>
            </DialogActions>
          </Dialog>
        );
      }
      default:
      case ACTION_DELETE_SHOP_ITEM: {
        return (
          <Dialog
            open={Boolean(openAction)}
            onClose={this.handleCloseMenu}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t('form.shop.item.deleteTitle')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText className={classes.dialogContentText}>
                {t('form.shop.item.deleteExplain')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseMenu} color="secondary">
                {t('common.cancel')}
              </Button>
              <RedButton onClick={this.onDelete}>
                {t('common.delete')}
              </RedButton>
            </DialogActions>
          </Dialog>
        );
      }
    }
  };

  renderActions = () => {
    const { anchorMenu } = this.state;

    const { t } = this.props;
    const openMenu = Boolean(anchorMenu);
    return (
      <div>
        <Menu
          id="long-menu"
          anchorEl={anchorMenu}
          open={openMenu}
          onClose={this.handleCloseMenu}
          PaperProps={{
            style: {
              maxHeight: 50 * 4.5,
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.action}
              onClick={() => this.handleAction(option.action)}
            >
              {t(option.text)}
            </MenuItem>
          ))}
        </Menu>
        {this.renderDialogAction()}
      </div>
    );
  };

  renderProvisionHistory = () => {
    const { t, classes, item, deleteProvisionUpdate } = this.props;
    const { provision_updates } = item;
    return (
      <Collapse in={this.state.showHistory}>
        <List dense>
          <Divider />
          {provision_updates.length === 0 ? (
            <Typography
              variant="caption"
              className={classes.noProvisionContainer}
            >
              {t('shop.noProvisionUpdates')}
            </Typography>
          ) : null}
          {provision_updates.map((pu) => (
            <ListItem
              divider={Boolean(provision_updates.length)}
              key={pu.id}
              hover
            >
              <ListItemText primary={formatAsDate(pu.date)} />
              <ListItemText primary={`+ ${pu.qty}`} />
              <ListItemSecondaryAction>
                <IconButton onClick={() => deleteProvisionUpdate(pu.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Collapse>
    );
  };

  render() {
    const { t, item, classes } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              item.cover ? (
                <Avatar
                  aria-label="Recipe"
                  src={item.cover}
                  className={classes.cover}
                />
              ) : (
                <LocalDrinkIcon className={classes.cover} />
              )
            }
            title={item.name}
            subheader={item.subtitle}
            action={
              <Grid
                container
                justify="flex-end"
                alignItems="flex-end"
                direction="column"
                className={classes.price}
              >
                <Grid item>
                  <Typography variant="h4">{item.price}€</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="caption">
                    {item.price * ((100 - item.tva) / 100)}€ {t('shop.ht')}
                  </Typography>
                </Grid>
              </Grid>
            }
          />
          <CardContent className={classes.content}>
            <div className={classes.description}>
              <Typography variant="body" color="textSecondary">
                {item.description}
              </Typography>
            </div>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Grid container direction="row" alignItems="center">
                  <Grid item>
                    <Typography
                      variant="subheading"
                      alignItems="center"
                      className={classes.provisions}
                      color={item.current_stock ? 'inherits' : 'error'}
                    >
                      {t('form.shop.item.provisions')}: {item.current_stock}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={this.toogleShowProvisionUpdates}>
                      <ExpandMoreIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.buttons}>
                <IconButton onClick={this.props.onEdit} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => this.handleAction(ACTION_DELETE_SHOP_ITEM)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={this.handleOpenMenu}>
                  <MoreVertIcon />
                </IconButton>
              </Grid>
            </Grid>
          </CardActions>
          <Grid item>{this.renderProvisionHistory()}</Grid>
        </Card>
        {this.renderActions()}
      </div>
    );
  }
}

const styles = (theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  provisions: {
    marginLeft: theme.spacing.unit * 2,
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    height: 70,
    width: 70,
  },
  description: {
    display: 'flex',
    alignItems: 'center',
  },
  price: {
    paddingRight: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dialogContentText: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  leftButton: {
    marginRight: theme.spacing.unit,
  },
  input: {
    size: 40,
  },
  noProvisionContainer: {
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default withStyles(styles)(translate()(ShopItemCard));
