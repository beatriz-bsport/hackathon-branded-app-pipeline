// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CancelIcon from '@material-ui/icons/Cancel';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { ShopItem } from '../types';
import NumericInput from '../../../components/input/NumericInput.component';
import PriceInput from '../../../components/input/PriceInput.component';
import ImageUploader from '../../../components/input/ImageUploader.component';

type Props = {
  initial: ?ShopItem,
  t: TFunction,
  classes: Object,
  createOrUpdate: (data: [*], id: number) => void,
  onCancel: () => void,
};
type State = {
  name: ?string,
  subtitle: ?string,
  provisions: number,
  price: ?number,
  supplier_price: ?number,
  cover: ?string,
  tva: ?number,
  description: ?string,
  barcode: string,
  marketplace_enabled: boolean,
  onsite_payment_available: boolean,
  featured: boolean,
  sell_only_on_provision: boolean,
  is_deliverable: boolean,
};

function ShopItemPreview(props: { previewURL: string }) {
  if (!props.previewURL) {
    return (
      <div
        style={{
          backgroundColor: '#F2F2F2',
          borderRadius: 35,
          height: 70,
          width: 70,
        }}
      >
        <Grid
          container
          item
          justify="center"
          alignItems="center"
          style={{ height: '100%', width: '100%' }}
        >
          <LocalDrinkIcon
            style={{
              height: 40,
              width: 40,
            }}
          />
        </Grid>
      </div>
    );
  }
  return (
    <CardMedia
      style={{ height: 70, width: 70, borderRadius: 35 }}
      image={
        // prettier-ignore
        props.previewURL
      }
    />
  );
}

export class ShopItemForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.initial) {
      const { initial } = props;
      this.state = {
        name: initial.name,
        subtitle: initial.subtitle,
        cover: initial.cover,
        price: initial.price,
        supplier_price: initial.supplier_price,
        tva: initial.tva,
        description: initial.description,
        barcode: initial.barcode,
        marketplace_enabled: initial.marketplace_enabled,
        onsite_payment_available: initial.onsite_payment_available,
        featured: initial.featured,
        sell_only_on_provision: initial.sell_only_on_provision,
        is_deliverable: initial.is_deliverable,
      };
    } else {
      this.state = {
        name: null,
        subtitle: null,
        cover: null,
        price: null,
        supplier_price: 0,
        tva: null,
        description: null,
        barcode: '',
        marketplace_enabled: false,
        onsite_payment_available: false,
        featured: false,
        sell_only_on_provision: false,
        is_deliverable: true,
      };
    }
  }

  handleField = (fieldName: string) => (event) => {
    this.setState({ [fieldName]: event.target.value });
  };

  handleCoverChange = (cover) => {
    if (cover && typeof cover !== 'string') {
      this.setState({ cover });
    }
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { initial } = this.props;
    const id = initial ? initial.id : null;
    const data = new FormData();
    data.append('name', this.state.name);
    if (this.state.description) {
      data.append('description', this.state.description);
    }
    if (this.state.subtitle) {
      data.append('subtitle', this.state.subtitle);
    }
    data.append('tva', this.state.tva);
    data.append('price', this.state.price);
    data.append('barcode', this.state.barcode);
    data.append('supplier_price', this.state.supplier_price);
    if (this.state.cover && typeof this.state.cover !== 'string') {
      data.append('cover', this.state.cover);
    }
    data.append('marketplace_enabled', this.state.marketplace_enabled);
    data.append(
      'onsite_payment_available',
      this.state.onsite_payment_available,
    );
    data.append('featured', this.state.featured);
    data.append('sell_only_on_provision', this.state.sell_only_on_provision);
    data.append('is_deliverable', this.state.is_deliverable);
    this.props.createOrUpdate(data, id);
  };

  render() {
    const { t, classes } = this.props;
    const {
      name,
      subtitle,
      description,
      barcode,
      price,
      supplier_price,
      tva,
      cover,
    } = this.state;
    return (
      <form className={classes.card} onSubmit={this.onSubmit}>
        <div style={{ width: '100%' }}>
          <Grid container spacing={32}>
            <Grid item xs={12}>
              <ImageUploader initial={cover} onChange={this.handleCoverChange}>
                <ShopItemPreview />
              </ImageUploader>
            </Grid>
            <Grid item xs={12} className={classes.itemRow}>
              <TextField
                label={t('form.shop.item.name')}
                value={name}
                required
                onChange={this.handleField('name')}
                inputProps={{ maxLength: 200 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} className={classes.itemRow}>
              <TextField
                label={t('form.shop.item.subtitle')}
                value={subtitle}
                onChange={this.handleField('subtitle')}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} className={classes.leftItem}>
              <PriceInput
                variant="outlined"
                label={t('common.price')}
                value={price}
                required
                fullWidth
                onChange={this.handleField('price')}
              />
            </Grid>
            <Grid item xs={6} className={classes.rightItem}>
              <NumericInput
                variant="outlined"
                value={tva}
                label={t('form.shop.item.tva')}
                required
                fullWidth
                max={100}
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.01 },
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                onChange={this.handleField('tva')}
              />
            </Grid>
            <Grid item xs={6} className={classes.itemRow}>
              <PriceInput
                variant="outlined"
                label={t('shop.supplier_price')}
                value={supplier_price}
                required
                fullWidth
                onChange={this.handleField('supplier_price')}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.itemRow}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.marketplace_enabled}
                  onChange={(event) => {
                    this.setState({
                      marketplace_enabled: event.target.checked,
                    });
                  }}
                />
              }
              label={t('form.shop.item.marketplace_enabled')}
            />
          </Grid>
          <Grid item xs={12} className={classes.itemRow}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.featured}
                  disabled={!this.state.marketplace_enabled}
                  onChange={(event) => {
                    this.setState({
                      featured: event.target.checked,
                    });
                  }}
                />
              }
              label={t('form.shop.item.featured')}
            />
          </Grid>
          <Grid item xs={12} className={classes.itemRow}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.sell_only_on_provision}
                  disabled={!this.state.marketplace_enabled}
                  onChange={(event) => {
                    this.setState({
                      sell_only_on_provision: event.target.checked,
                    });
                  }}
                />
              }
              label={t('form.shop.item.sell_only_on_provision')}
            />
          </Grid>
          <Grid item xs={12} className={classes.itemRow}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.onsite_payment_available}
                  disabled={!this.state.marketplace_enabled}
                  onChange={(event) => {
                    this.setState({
                      onsite_payment_available: event.target.checked,
                    });
                  }}
                />
              }
              label={t('form.shop.item.onsite_payment_available')}
            />
          </Grid>
          <Grid item xs={12} className={classes.itemRow}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.is_deliverable}
                  disabled={!this.state.marketplace_enabled}
                  onChange={(event) => {
                    this.setState({
                      is_deliverable: event.target.checked,
                    });
                  }}
                />
              }
              label={t('form.shop.item.is_deliverable')}
            />
          </Grid>
          <div className={classes.description}>
            <TextField
              multiline
              fullWidth
              variant="outlined"
              rows={3}
              color="textSecondary"
              value={description}
              label={t('form.shop.item.description')}
              onChange={this.handleField('description')}
            />
          </div>
          <div className={classes.description}>
            <TextField
              fullWidth
              variant="outlined"
              color="textSecondary"
              value={barcode}
              label={t('form.shop.item.barcode')}
              onChange={this.handleField('barcode')}
            />
          </div>
          <div className={classes.buttons}>
            <Button onClick={this.props.onCancel}>
              <CancelIcon className={classes.leftIcon} />
              {t('common.cancel')}
            </Button>
            <Button color="primary" type="submit">
              <SaveIcon className={classes.leftIcon} /> {t('common.save')}
            </Button>
          </div>
        </div>
      </form>
    );
  }
}

const styles = (theme) => ({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.unit * 2,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  provisions: {
    marginLeft: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
  cover: {
    height: 70,
    width: 70,
  },
  description: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2,
  },
  header: {
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
  },
  price: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: -theme.spacing.unit * 2,
  },
  itemRow: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
  },
  leftItem: {
    paddingLeft: `${theme.spacing.unit * 5}px !important`,
  },
  rightItem: {
    paddingRight: `${theme.spacing.unit * 5}px !important`,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(withNamespaces()(ShopItemForm));
