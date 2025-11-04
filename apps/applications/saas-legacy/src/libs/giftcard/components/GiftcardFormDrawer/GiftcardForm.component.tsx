import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import {
  ButtonBase,
  Collapse,
  Typography,
  Divider,
  makeStyles,
  Theme,
  Link,
} from '@material-ui/core';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';

import {
  TextField,
  IntegerField,
  CheckboxField,
  SwitchField,
  // @ts-expect-error
} from '#src/components/forms';
// @ts-expect-error
import ImageField from '#src/components/forms/ImageField.component';
import { PriceField } from '#src/components/form-fields/PriceField.component';

// @ts-expect-error
import PaymentMethodSelectorField from '#src/libs/payment/components/PaymentMethodSelectorField.component';
import { Tag, TagGroup } from '#src/libs/tag/types';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';
import { useHasTagsSameGroup } from '#src/libs/tag/components/hooks';
import TagGroupDuplicatedAlert from '#src/libs/tag/components/TagGroupDuplicatedAlert.component';
import BookkeepingAccountSelector from '#src/libs/payment/components/BookkeepingAccountSelector';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import { getIntercomLink } from '#src/intercom';

import {
  FIELD_PRICE_MAX,
  FIELD_PRICE_MIN,
  FIELD_ERROR_MAX_PRICE_LOWER_THAN_MIN_PRICE,
} from './schema';
import { trackFormAdd } from './trackers';
import type { GiftcardFormDrawerProps } from './types';

const PRICE_FIELD_INPUT = {
  min: FIELD_PRICE_MIN,
  max: FIELD_PRICE_MAX,
  step: 1,
};

const INTERCOM_ARTICLE_MAX_PRICE_LIMIT = `${getIntercomLink()}/articles/12730161-how-to-set-up-a-custom-amount-gift-card`;

type GiftcardFormProps = GiftcardFormDrawerProps & {
  disabledSharedGiftcardUpdate?: boolean;
};

export const GiftcardForm: React.FC<GiftcardFormProps> = (props) => {
  const { t } = useTranslation(['giftcard', 'b2b_giftcard']);

  const classes = useStyles();
  React.useEffect(() => {
    trackFormAdd(props.initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { setFieldValue } = useFormikContext();

  const [openAdvancedOptions, setOpenAdvancedOptions] = React.useState(false);

  const hasTagsSameGroup = useHasTagsSameGroup({
    selectedTagsIds: props.values?.tags_on_consumer_item_creation,
    tagsWithGroup: props.tagList ?? [],
  });

  const onChangeTagsOnAcquisition = React.useCallback(
    (items: Array<{ label: string; value: number; tag: Tag<TagGroup> }>) => {
      return setFieldValue(
        'tags_on_consumer_item_creation',
        items.map((item) => item.value),
      );
    },
    [setFieldValue],
  );

  const onDeleteTagsOnAcquisition = React.useCallback(
    (itemId: number) =>
      setFieldValue(
        'tags_on_consumer_item_creation',
        props.values?.tags_on_consumer_item_creation?.filter(
          (tagId: number) => tagId !== itemId,
        ),
      ),
    [props.values?.tags_on_consumer_item_creation, setFieldValue],
  );

  const setBookkeepingAccount = React.useCallback(
    (bookkeepingAccountId: number) => {
      setFieldValue('bookkeeping_account', bookkeepingAccountId);
    },
    [setFieldValue],
  );

  return (
    <div className={classes.container}>
      <ImageField disabled={props.disabledSharedGiftcardUpdate} name="cover" />

      <TextField
        required
        className={classes.fullwidth}
        disabled={props.disabledSharedGiftcardUpdate}
        label={t('form.giftcard.name.label', { ns: 'giftcard' })}
        name="name"
      />

      <TextField
        multiline
        required
        className={classes.fullwidth}
        disabled={props.disabledSharedGiftcardUpdate}
        label={t('form.giftcard.description.label', { ns: 'giftcard' })}
        name="description"
        variant="outlined"
      />

      <fieldset className={classes.parameterContainer}>
        <legend>
          {t('form.giftcard.section.parameters.title', { ns: 'giftcard' })}
        </legend>
        <PriceField
          disabled={
            props.disabledSharedGiftcardUpdate || props.values.hasCustomPrice
          }
          helperText={t('form.giftcard.price.helperText', { ns: 'giftcard' })}
          inputProps={PRICE_FIELD_INPUT}
          label={t('form.giftcard.price.label', { ns: 'giftcard' })}
          name="price"
        />

        <SwitchField
          disabled={props.disabledSharedGiftcardUpdate}
          label={t('customAmount.form.toggle', { ns: 'b2b_giftcard' })}
          name="hasCustomPrice"
        />
        <Collapse in={props.values.hasCustomPrice}>
          <div className={classes.customPriceContainer}>
            <PriceField
              disabled={
                props.disabledSharedGiftcardUpdate ||
                !props.values.hasCustomPrice
              }
              helperText={t('customAmount.form.minPrice.helperText', {
                ns: 'b2b_giftcard',
              })}
              inputProps={PRICE_FIELD_INPUT}
              label={t('customAmount.form.minPrice.label', {
                ns: 'b2b_giftcard',
              })}
              name="min_price"
            />

            <div className={classes.maxPrice}>
              <PriceField
                disabled={
                  props.disabledSharedGiftcardUpdate ||
                  !props.values.hasCustomPrice
                }
                helperText={
                  props.errors.max_price ===
                  FIELD_ERROR_MAX_PRICE_LOWER_THAN_MIN_PRICE
                    ? t('customAmount.form.errors.maxGreaterThanMin', {
                        ns: 'b2b_giftcard',
                      })
                    : t('customAmount.form.maxPrice.helperText', {
                        ns: 'b2b_giftcard',
                        maxPriceWithCurrency:
                          getCurrencyDisplayWithPrice(FIELD_PRICE_MAX),
                      })
                }
                inputProps={PRICE_FIELD_INPUT}
                label={t('customAmount.form.maxPrice.label', {
                  ns: 'b2b_giftcard',
                })}
                name="max_price"
              />
              <Link
                href={INTERCOM_ARTICLE_MAX_PRICE_LIMIT}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t('customAmount.form.maxPrice.limitExplanation', {
                  ns: 'b2b_giftcard',
                })}
              </Link>
            </div>
          </div>
        </Collapse>

        <Collapse in={!props.values.unlimited}>
          <IntegerField
            required
            disabled={props.disabledSharedGiftcardUpdate}
            helperText={t('form.giftcard.expiration_days.helperText', {
              ns: 'giftcard',
            })}
            label={t('form.giftcard.expiration_days.label', { ns: 'giftcard' })}
            name="expiration_days"
          />
        </Collapse>
        <CheckboxField
          disabled={props.disabledSharedGiftcardUpdate}
          label={t('form.giftcard.unlimited.label', { ns: 'giftcard' })}
          name="unlimited"
        />

        <BookkeepingAccountSelector
          bookkeepingAccountById={props.bookkeepingAccountById ?? {}}
          bookkeepingAccounts={props.bookkeepingAccounts ?? []}
          selectedBookkeepingAccountId={
            props.values.bookkeeping_account ?? undefined
          }
          setFieldValue={setBookkeepingAccount}
        />
      </fieldset>

      <SwitchField
        disabled={props.disabledSharedGiftcardUpdate}
        label={t('form.giftcard.manager_only.label', { ns: 'giftcard' })}
        name="manager_only"
      />

      <PaymentMethodSelectorField
        asFieldset
        disabled={
          props.values.manager_only || props.disabledSharedGiftcardUpdate
        }
        helperText={t(
          'form.giftcard.available_payment_method_identifiers.helperText',
          { ns: 'giftcard' },
        )}
        label={t('form.giftcard.available_payment_method_identifiers.label', {
          ns: 'giftcard',
        })}
        name="available_payment_method_identifiers"
      />

      {props.tagList && (
        <>
          <Divider className={classes.divider} />

          <div className={classes.section} id="giftcard-form-advanced-section">
            <ButtonBase
              className={classes.advancedOptionsHeader}
              onClick={() => setOpenAdvancedOptions(!openAdvancedOptions)}
            >
              <SettingsIcon />
              <Typography variant="h6">
                {t('form.giftcard.advancedOptions.header', { ns: 'giftcard' })}
              </Typography>
              {openAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ButtonBase>

            <Collapse in={openAdvancedOptions}>
              <div className={classes.section}>
                <Typography className={classes.title}>
                  {t('form.giftcard.advancedOptions.tag.tagsOnAcquisition', {
                    ns: 'giftcard',
                  })}
                </Typography>
                <Typography variant="caption">
                  {t(
                    'form.giftcard.advancedOptions.tag.tagsOnAcquisitionHelper',
                    { ns: 'giftcard' },
                  )}
                </Typography>
                <TagSelector
                  closeMenuOnSelect
                  inScrollBar
                  isClearable
                  allTagsWithTagGroup={props.tagList || []}
                  onChange={onChangeTagsOnAcquisition}
                  onDeleteTag={onDeleteTagsOnAcquisition}
                  placeholder={t(
                    'form.giftcard.advancedOptions.tag.selectTags',
                    { ns: 'giftcard' },
                  )}
                  selectedTags={props.values.tags_on_consumer_item_creation}
                  variant={'exclusive'}
                />
                {hasTagsSameGroup && <TagGroupDuplicatedAlert />}
              </div>
            </Collapse>
          </div>
        </>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '&>*': {
      marginBottom: theme.spacing(3),
    },
  },
  fullwidth: {
    width: '100%',
  },
  parameterContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(-4),
    marginRight: theme.spacing(-4),
    height: 2,
    color: '#C6C6C6',
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
    paddingTop: theme.spacing(4),
  },
  title: {
    fontWeight: 500,
    color: '#000',
  },
  customPriceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    paddingLeft: theme.spacing(6),
  },
  maxPrice: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
