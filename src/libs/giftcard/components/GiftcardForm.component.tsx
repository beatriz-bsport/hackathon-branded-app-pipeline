import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { withFormik, useFormikContext } from 'formik';
import { ButtonBase } from '@material-ui/core';
import * as Yup from 'yup';
import { CB } from '@bsport/common/lib/master-data/payment-methods';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import {
  TextField,
  PriceField,
  IntegerField,
  CheckboxField,
  SwitchField,
  // @ts-expect-error
} from '#components/forms';
// @ts-expect-error
import PaymentMethodSelectorField from '#libs/payment/components/PaymentMethodSelectorField.component';
// @ts-expect-error
import ImageField from '#components/forms/ImageField.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { Giftcard, GiftcardTemplate } from '../types';
import { OptionCallback } from '../../../state/types';
import { Tag, TagGroup } from '#libs/tag/types';
import TagSelector from '#libs/tag/components/TagSelector.selector';
import { useHasTagsSameGroup } from '#libs/tag/components/hooks';
import TagGroupDuplicatedAlert from '#libs/tag/components/TagGroupDuplicatedAlert.component';
import BookkeepingAccountSelector from '#libs/payment/components/BookkeepingAccountSelector';
import type { BookkeepingAccount } from '#libs/payment/types';

type Props = {
  values: any;
  initial?: Giftcard | GiftcardTemplate;
  disabledSharedGiftcardUpdate?: boolean;
  tagList?: Array<Tag<TagGroup>>;
  bookkeepingAccounts?: BookkeepingAccount[];
  bookkeepingAccountById?: Record<number, BookkeepingAccount>;
};

const { trackFormAdd, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.Giftcard,
  );
const GiftcardForm = (props: Props) => {
  const { t } = useTranslation(['giftcard']);
  const classes = useStyles();
  React.useEffect(() => {
    trackFormAdd(props.initial?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { setFieldValue } = useFormikContext();

  const [openAdvancedOptions, setOpenAdvancedOptions] = React.useState(false);

  const hasTagsSameGroup = useHasTagsSameGroup({
    selectedTagsIds: props.values?.tags_on_consumer_item_creation,
    tagsWithGroup: props.tagList,
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
        label={t('form.giftcard.name.label')}
        name="name"
      />
      <TextField
        multiline
        required
        className={classes.fullwidth}
        disabled={props.disabledSharedGiftcardUpdate}
        label={t('form.giftcard.description.label')}
        name="description"
        variant="outlined"
      />
      <fieldset className={classes.parameterContainer}>
        <legend>{t('form.giftcard.section.parameters.title')}</legend>
        <PriceField
          disabled={props.disabledSharedGiftcardUpdate}
          helperText={t('form.giftcard.price.helperText')}
          label={t('form.giftcard.price.label')}
          name="price"
        />
        <Collapse in={!props.values.unlimited}>
          <IntegerField
            required
            disabled={props.disabledSharedGiftcardUpdate}
            helperText={t('form.giftcard.expiration_days.helperText')}
            label={t('form.giftcard.expiration_days.label')}
            name="expiration_days"
          />
        </Collapse>
        <CheckboxField
          disabled={props.disabledSharedGiftcardUpdate}
          label={t('form.giftcard.unlimited.label')}
          name="unlimited"
        />
        <BookkeepingAccountSelector
          bookkeepingAccountById={props.bookkeepingAccountById}
          bookkeepingAccounts={props.bookkeepingAccounts}
          selectedBookkeepingAccountId={props.values.bookkeeping_account}
          setFieldValue={setBookkeepingAccount}
        />
      </fieldset>
      <SwitchField
        disabled={props.disabledSharedGiftcardUpdate}
        label={t('form.giftcard.manager_only.label')}
        name="manager_only"
      />
      <PaymentMethodSelectorField
        asFieldset
        disabled={
          props.values.manager_only || props.disabledSharedGiftcardUpdate
        }
        helperText={t(
          'form.giftcard.available_payment_method_identifiers.helperText',
        )}
        label={t('form.giftcard.available_payment_method_identifiers.label')}
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
                {t('form.giftcard.advancedOptions.header')}
              </Typography>
              {openAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ButtonBase>

            <Collapse in={openAdvancedOptions}>
              <div className={classes.section}>
                <Typography className={classes.title}>
                  {t('form.giftcard.advancedOptions.tag.tagsOnAcquisition')}
                </Typography>
                <Typography variant="caption">
                  {t(
                    'form.giftcard.advancedOptions.tag.tagsOnAcquisitionHelper',
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
                  )}
                  selectedTags={props.values.tags_on_consumer_item_creation}
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
}));

export default GiftcardForm;

export const GiftcardSchema = Yup.object().shape({
  name: Yup.string().required(),
  cover: Yup.object().nullable(),
  description: Yup.string().required(),
  price: Yup.number().required().min(1),
  manager_only: Yup.boolean(),
  unlimited: Yup.boolean(),
  available_payment_method_identifiers: Yup.array().of(Yup.number()),
  expiration_days: Yup.number().nullable().min(1),
  tags_on_consumer_item_creation: Yup.array().of(Yup.number().integer()),
  bookkeeping_account: Yup.number().nullable(),
});

type WithFormikProps = {
  onError?: () => void;
  onSuccess?: () => void;
  onSubmit: (data: FormData, options: OptionCallback) => void;
};

type MergedProps = WithFormikProps & Props;

export const GiftcardFormFieldHOC = withFormik<MergedProps, any>({
  // eslint-disable-next-line
  mapPropsToValues: ({ initial }) => {
    if (!initial) {
      return {
        name: '',
        cover: '',
        description: '',
        price: 1,
        manager_only: false,
        unlimited: false,
        expiration_days: 30,
        available_payment_method_identifiers: [CB.id],
        tags_on_consumer_item_creation: [],
      };
    }
    return {
      ...initial,
      unlimited: !initial.expiration_days,
      expiration_days: initial.expiration_days || 30,
      tags_on_consumer_item_creation:
        initial.tags_on_consumer_item_creation || [],
    };
  },
  validationSchema: GiftcardSchema,
  enableReinitialize: true,
  handleSubmit: (
    values,
    {
      props,
      setSubmitting,
    }: {
      props: MergedProps;
      setSubmitting: (state: boolean) => void;
    },
  ) => {
    const keys = [
      'description',
      'name',
      'price',
      'manager_only',
      'expiration_days',
    ];
    const { cover } = values;
    const formData = new FormData();
    if (values.bookkeeping_account) {
      formData.append('bookkeeping_account', values.bookkeeping_account);
    }
    if (typeof cover !== 'string' && !!cover) {
      formData.append('cover', cover);
    }
    keys.forEach((key) => {
      if (key === 'expiration_days') {
        if (values.unlimited) {
          formData.append(key, '');
        } else {
          formData.append(key, values.expiration_days);
        }
      } else {
        formData.append(key, values[key]);
      }
    });
    formData.append(
      'available_payment_method_identifiers[]',
      JSON.stringify(values.available_payment_method_identifiers),
    );
    formData.append(
      'tags_on_consumer_item_creation[]',
      JSON.stringify(values.tags_on_consumer_item_creation),
    );
    props.onSubmit(formData, {
      onSuccess: () => {
        trackFormSuccess(props.initial?.id);
        if (props.onSuccess && typeof props.onSuccess === 'function')
          props.onSuccess();
        setSubmitting(false);
      },
      onError: () => {
        if (props.onError && typeof props.onError === 'function')
          props.onError();
        setSubmitting(false);
      },
    });
  },
});

export const GiftcardFormComposed = GiftcardFormFieldHOC(GiftcardForm);
