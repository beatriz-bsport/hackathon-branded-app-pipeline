// @flow
import React, { Component } from 'react';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation, TFunction } from 'react-i18next';
import { CB } from '@bsport/common/lib/master-data/payment-methods';
import { Typography, ButtonBase } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { Tag, TagGroup } from '#src/libs/tag/types';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';
import TagGroupDuplicatedAlert from '#src/libs/tag/components/TagGroupDuplicatedAlert.component';
import { provincialTaxHelperText } from '../../theme/utils';
import type { ShopItem } from '../types';
import NumericInput from '../../../components/input/NumericInput.component';
import PriceInput from '../../../components/input/PriceInput.component';
import ImageUploader from '../../../components/input/ImageUploader.component';

import PaymentMethodSelectorInput from '../../payment/components/PaymentMethodSelectorInput.component';
import type { OptionCallback } from '../../../state/types';
import { ALMOST_100 } from '../../../constants';
import BookkeepingAccountSelector from '../../payment/components/BookkeepingAccountSelector';
import type { BookkeepingAccount } from '../../payment/types';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.ShopItem,
);
type Props = {
  initial: ?ShopItem,
  t: TFunction,
  classes: Object,
  createOrUpdate: (data: [*], id: number, options: OptionCallback) => void,
  onCancel: () => void,
  loading: boolean,
  provincialTax: number,
  tagList: Array<Tag<TagGroup>>,
  bookkeepingAccounts: BookkeepingAccount[],
  bookkeepingAccountById: Record<number, BookkeepingAccount>,
};
type State = {
  name: ?string,
  subtitle: ?string,
  price: ?number,
  supplier_price: ?number,
  cover: ?string,
  tva: ?number,
  description: ?string,
  barcode: string,
  marketplace_enabled: boolean,
  available_payment_method_identifiers: Array<number>,
  featured: boolean,
  sell_only_on_provision: boolean,
  is_deliverable: boolean,
  provincialTax: string,
  tags_on_purchase?: Array<number>,
  bookkeeping_account?: number,
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
          alignItems="center"
          justify="center"
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
      image={
        // prettier-ignore
        props.previewURL
      }
      style={{ height: 70, width: 70, borderRadius: 35 }}
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
        available_payment_method_identifiers:
          initial.available_payment_method_identifiers,
        featured: initial.featured,
        sell_only_on_provision: initial.sell_only_on_provision,
        is_deliverable: initial.is_deliverable,
        provincialTaxText: provincialTaxHelperText(
          initial.tva,
          props.provincialTax,
          props.t,
        ),
        tags_on_purchase: initial.tags_on_purchase,
        hasTagsSameGroup: initial.hasTagsSameGroup,
        bookkeeping_account: initial?.bookkeeping_account || null,
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
        available_payment_method_identifiers: [CB.id, 9],
        featured: false,
        sell_only_on_provision: false,
        is_deliverable: true,
        provincialTaxText: '',
        tags_on_purchase: [],
        hasTagsSameGroup: false,
        bookkeeping_account: null,
      };
    }
  }

  componentDidMount() {
    trackFormAdd(this.props.initial?.id);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.provincialTax !== this.props.provincialTax ||
      prevState.tva !== this.state.tva
    )
      this.setState((currentState: State) => ({
        ...currentState,
        provincialTaxText: provincialTaxHelperText(
          currentState.tva,
          this.props.provincialTax,
          this.props.t,
        ),
      }));
    if (
      prevState.tags_on_purchase !== this.state.tags_on_purchase ||
      prevProps.tagList !== this.props.tagList
    ) {
      this.setState((currentState: State) => ({
        ...currentState,
        hasTagsSameGroup: this.getHasTagsSameGroup(),
      }));
    }
  }

  getHasTagsSameGroup = (): boolean => {
    const tagsGroup: Array<TagGroup> = [];

    const allTags = this.state.tags_on_purchase || [];

    for (let i = 0; i < allTags.length; i += 1) {
      const tagGroup = this.props.tagList.find(
        (tag) => tag.id === allTags[i],
      )?.group;
      if (tagGroup) {
        if (tagsGroup.includes(tagGroup)) {
          return true;
        }
        tagsGroup.push(tagGroup);
      }
    }
    return false;
  };

  setBookkeepingAccount = (bookkeepingAccountId: number) => {
    this.setState({ bookkeeping_account: bookkeepingAccountId });
    if (bookkeepingAccountId) {
      const { vat_rate } =
        this.props.bookkeepingAccountById[bookkeepingAccountId];
      this.setState({ tva: vat_rate });
    } else {
      this.setState({ tva: this.props.initial?.tax || 0 });
    }
  };

  onChangeTagsOnAcquisition = (
    items: Array<{
      item: Array<{ label: string, value: number, tag: Tag<TagGroup> }>,
    }>,
  ) => {
    this.setState({
      tags_on_purchase: items.map((item) => item.value),
    });
  };

  onDeleteTagsOnAcquisition = (itemId: number) => {
    this.setState((currentState: State) => ({
      tags_on_purchase: currentState.tags_on_purchase.filter(
        (tagId) => tagId !== itemId,
      ),
    }));
  };

  handleField = (fieldName: string) => (event) => {
    this.setState({ [fieldName]: event.target.value });
  };

  handleCoverChange = (cover) => {
    if (cover && typeof cover !== 'string') {
      this.setState({ cover });
    }
  };

  handleClickOnAdvancedSection = () => {
    this.setState((currentState: State) => ({
      openAdvancedOptions: !currentState.openAdvancedOptions,
    }));
  };

  onSubmit = (ev) => {
    ev.preventDefault();
    const { initial } = this.props;
    const id = initial ? initial.id : null;
    const data = new FormData();
    data.append('bookkeeping_account', this.state.bookkeeping_account || '');
    data.append('name', this.state.name);
    data.append('description', this.state.description || '');
    data.append('subtitle', this.state.subtitle || '');
    data.append('tva', this.state.tva);
    data.append('price', this.state.price);
    data.append('barcode', this.state.barcode);
    data.append('supplier_price', this.state.supplier_price);
    if (this.state.cover && typeof this.state.cover !== 'string') {
      data.append('cover', this.state.cover);
    }
    data.append('marketplace_enabled', this.state.marketplace_enabled);
    data.append(
      'available_payment_method_identifiers[]',
      JSON.stringify(this.state.available_payment_method_identifiers),
    );
    data.append('featured', this.state.featured);
    data.append('sell_only_on_provision', this.state.sell_only_on_provision);
    data.append('is_deliverable', this.state.is_deliverable);
    data.append(
      'tags_on_purchase[]',
      JSON.stringify(this.state.tags_on_purchase),
    );
    this.props.createOrUpdate(data, id, {
      onSuccess: () => {
        trackFormSuccess(this.props.initial?.id);
      },
    });
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
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <div className={classes.paddingTop}>
                <ImageUploader
                  initial={cover}
                  onChange={this.handleCoverChange}
                >
                  <ShopItemPreview />
                </ImageUploader>
              </div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                inputProps={{ maxLength: 200 }}
                label={t('form.shop.item.name')}
                onChange={this.handleField('name')}
                value={name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('form.shop.item.subtitle')}
                onChange={this.handleField('subtitle')}
                value={subtitle}
              />
            </Grid>
            <Grid item xs={12}>
              <div className={classes.description}>
                <TextField
                  fullWidth
                  multiline
                  color="textSecondary"
                  label={t('form.shop.item.description')}
                  onChange={this.handleField('description')}
                  rows={5}
                  value={description}
                  variant="outlined"
                />
              </div>
            </Grid>
            <Grid item className={classes.leftItem} xs={6}>
              <PriceInput
                fullWidth
                required
                label={t('common.price')}
                onChange={this.handleField('price')}
                value={price}
                variant="outlined"
              />
            </Grid>
            <Grid item className={classes.rightItem} xs={6}>
              <PriceInput
                fullWidth
                required
                label={t('shop.supplier_price')}
                onChange={this.handleField('supplier_price')}
                value={supplier_price}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <BookkeepingAccountSelector
              bookkeepingAccountById={this.props.bookkeepingAccountById}
              bookkeepingAccounts={this.props.bookkeepingAccounts}
              selectedBookkeepingAccountId={this.state.bookkeeping_account}
              setFieldValue={this.setBookkeepingAccount}
            />
          </Grid>
          <Grid item className={classes.paddingTop} xs={12}>
            <NumericInput
              fullWidth
              required
              disabled={!!this.state.bookkeeping_account}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: { min: 0, max: ALMOST_100, step: 0.005 },
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              label={t('form.shop.item.tva')}
              max={ALMOST_100}
              onChange={this.handleField('tva')}
              value={tva}
              variant="outlined"
            />
            <Typography color="error" variant="body2">
              {this.state.provincialTaxText}
            </Typography>
          </Grid>
          <Grid item xs={12}>
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
          <div className={classes.marketplaceSettings}>
            <Grid item xs={12}>
              <PaymentMethodSelectorInput
                disabled={!this.state.marketplace_enabled}
                helperText={t(
                  'form.shop.item.available_payment_method_identifiers.helperText',
                )}
                label={t(
                  'form.shop.item.available_payment_method_identifiers.label',
                )}
                onChange={(available_payment_method_identifiers) =>
                  this.setState({ available_payment_method_identifiers })
                }
                paymentMethodIds={
                  this.state.available_payment_method_identifiers
                }
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
          </div>
          <div className={classes.barcode}>
            <TextField
              fullWidth
              color="textSecondary"
              label={t('form.shop.item.barcode')}
              onChange={this.handleField('barcode')}
              value={barcode}
              variant="outlined"
            />
          </div>

          <div className={classes.section} id="shop-item-form-advanced-section">
            <ButtonBase
              className={classes.advancedOptionsHeader}
              onClick={this.handleClickOnAdvancedSection}
            >
              <SettingsIcon className={classes.settings} />
              <Typography variant="h6">
                {t('form.shop.item.advancedOptions.header')}
              </Typography>
              {this.state.openAdvancedOptions ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </ButtonBase>

            <Collapse in={this.state.openAdvancedOptions}>
              <div className={classes.section}>
                <Typography className={classes.title}>
                  {t('form.shop.item.advancedOptions.tag.tagsOnAcquisition')}
                </Typography>
                <Typography className={classes.helperText} variant="caption">
                  {t(
                    'form.shop.item.advancedOptions.tag.tagsOnAcquisitionHelper',
                  )}
                </Typography>
                <TagSelector
                  closeMenuOnSelect
                  inScrollBar
                  isClearable
                  allTagsWithTagGroup={this.props.tagList || []}
                  onChange={this.onChangeTagsOnAcquisition}
                  onDeleteTag={this.onDeleteTagsOnAcquisition}
                  placeholder={t(
                    'form.shop.item.advancedOptions.tag.selectTags',
                  )}
                  selectedTags={this.state.tags_on_purchase}
                  variant={'exclusive'}
                />
                {this.state.hasTagsSameGroup && <TagGroupDuplicatedAlert />}
              </div>
            </Collapse>
          </div>

          <div className={classes.buttons}>
            {this.props.loading ? (
              <CircularProgress />
            ) : (
              <React.Fragment>
                <Button
                  className={classes.button}
                  onClick={() => {
                    this.props.onCancel();
                    trackFormCancel(this.props.initial?.id);
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  className={classes.button}
                  color="primary"
                  onClick={(ev) => {
                    ev.preventDefault();
                    trackFormSubmitIntent(this.props.initial?.id);
                    // to improve
                    this.onSubmit(ev);
                  }}
                  variant="contained"
                >
                  {t('common.save')}
                </Button>
              </React.Fragment>
            )}
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
    marginTop: theme.spacing(2),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingBottom: theme.spacing(2),
  },
  provisions: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  cover: {
    height: 70,
    width: 70,
  },
  description: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  barcode: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  header: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  price: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(-2),
  },
  leftItem: {
    paddingLeft: `${theme.spacing(5)}px !important`,
  },
  rightItem: {
    paddingRight: `${theme.spacing(5)}px !important`,
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  marketplaceSettings: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    paddingBottom: 0,
    marginBottom: theme.spacing(1),
    border: '1px solid #E2E2E2',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  button: {
    margin: theme.spacing(1),
  },
  paddingTop: {
    paddingTop: theme.spacing(2),
  },
  advancedOptionsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  title: {
    fontWeight: 500,
    color: '#000',
  },
});

export default compose(withStyles(styles), withTranslation())(ShopItemForm);
