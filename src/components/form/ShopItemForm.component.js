// @flow
import React, { Component } from 'react';

import {
  Card,
  CardContent,
  Grid,
  IconButton,
  CardMedia,
  CardActions,
  TextField,
  withStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import CheckIcon from '@material-ui/icons/Check';
import InputAdornment from '@material-ui/core/InputAdornment';

import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { ShopItem } from '../../api/types';
import NumericInput from '../input/NumericInput.component';
import PriceInput from '../input/PriceInput.component';
import ImageUploader from '../input/ImageUploader.component';

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
  cover: ?string,
  tva: ?number,
  description: ?string,
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
        tva: initial.tva,
        description: initial.description,
      };
    } else {
      this.state = {
        name: null,
        subtitle: null,
        cover: null,
        price: null,
        tva: null,
        description: null,
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
    data.append('description', this.state.description);
    data.append('subtitle', this.state.subtitle);
    data.append('tva', this.state.tva);
    data.append('price', this.state.price);
    if (this.state.cover && typeof this.state.cover !== 'string') {
      data.append('cover', this.state.cover);
    }
    this.props.createOrUpdate(data, id);
  };

  render() {
    const { t, classes } = this.props;
    const { name, subtitle, description, price, tva, cover } = this.state;
    return (
      <form className={classes.card} onSubmit={this.onSubmit}>
        <Card style={{ width: '100%' }}>
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
                fullWidth
              />
            </Grid>
            <Grid item xs={12} className={classes.itemRow}>
              <TextField
                label={t('form.shop.item.subtitle')}
                value={subtitle}
                required
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
                  inputProps: { min: 0, max: 100 },
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                onChange={this.handleField('tva')}
              />
            </Grid>
          </Grid>
          <CardContent className={classes.content}>
            <div className={classes.description}>
              <TextField
                multiline
                fullWidth
                variant="outlined"
                color="textSecondary"
                value={description}
                label={t('form.shop.item.description')}
                required
                onChange={this.handleField('description')}
              />
            </div>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Grid container justify="flex-end" alignItems="center">
              <Grid item className={classes.buttons}>
                {this.props.initial ? (
                  <IconButton color="primary" type="submit">
                    <CheckIcon />
                  </IconButton>
                ) : (
                  <IconButton color="primary" type="submit">
                    <AddIcon />
                  </IconButton>
                )}
                <IconButton onClick={this.props.onCancel}>
                  <CancelIcon />
                </IconButton>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </form>
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
    marginBottom: theme.spacing.unit * 2,
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
    marginTop: theme.spacing.unit,
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
});

export default withStyles(styles)(translate()(ShopItemForm));
