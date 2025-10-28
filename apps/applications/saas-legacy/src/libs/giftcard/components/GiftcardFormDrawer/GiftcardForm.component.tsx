import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import { ButtonBase } from '@material-ui/core';
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
} from '#src/components/forms';
// @ts-expect-error
import PaymentMethodSelectorField from '#src/libs/payment/components/PaymentMethodSelectorField.component';
// @ts-expect-error
import ImageField from '#src/components/forms/ImageField.component';
import { Tag, TagGroup } from '#src/libs/tag/types';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';
import { useHasTagsSameGroup } from '#src/libs/tag/components/hooks';
import TagGroupDuplicatedAlert from '#src/libs/tag/components/TagGroupDuplicatedAlert.component';
import BookkeepingAccountSelector from '#src/libs/payment/components/BookkeepingAccountSelector';

import type { GiftcardFormDrawerProps } from './types';

type GiftcardFormProps = GiftcardFormDrawerProps & {
  disabledSharedGiftcardUpdate?: boolean;
};

import { trackFormAdd } from './trackers';

export const GiftcardForm: React.FC<GiftcardFormProps> = (props) => {
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
          bookkeepingAccountById={props.bookkeepingAccountById ?? {}}
          bookkeepingAccounts={props.bookkeepingAccounts ?? []}
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
}));
