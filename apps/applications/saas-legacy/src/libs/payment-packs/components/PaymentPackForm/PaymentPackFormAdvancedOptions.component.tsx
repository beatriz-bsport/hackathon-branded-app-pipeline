import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ButtonBase, Typography, Collapse } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FormikProps, useFormikContext } from 'formik';
import SettingsIcon from '@material-ui/icons/Settings';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';
import { Tag, TagGroup } from '#src/libs/tag/types';
import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
import { useHasTagsSameGroup } from '#src/libs/tag/components/hooks';
import TagGroupDuplicatedAlert from '#src/libs/tag/components/TagGroupDuplicatedAlert.component';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';
import { PaymentPackFormValues } from '../../types';

type Props = {
  tagList: Array<Tag<TagGroup>>;
  disabledUniversalPassFields: boolean;
};
export const PaymentPackFormAdvancedOptions = (props: Props) => {
  const privatePassTagsEligibilityFeature = useSafeFlag(
    FeatureFlags.APPOINTMENT_PASS_TAGS_ELIGIBILITY,
  );
  const { tagList } = props;
  const disabledUniversalPassFields =
    props.disabledUniversalPassFields && !privatePassTagsEligibilityFeature;
  const { t } = useTranslation('paymentPack');
  const [openAdvancedOptions, setOpenAdvancedOptions] =
    useState<boolean>(false);
  const classes = useStyles();

  const { values, setFieldValue }: FormikProps<PaymentPackFormValues> =
    useFormikContext();

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
        values?.tags_on_consumer_item_creation?.filter(
          (tagId) => tagId !== itemId,
        ),
      ),
    [setFieldValue, values?.tags_on_consumer_item_creation],
  );

  const hasTagsSameGroup = useHasTagsSameGroup({
    selectedTagsIds: values?.tags_on_consumer_item_creation,
    tagsWithGroup: props.tagList,
  });
  return (
    <>
      <div
        className={classes.advancedOptionsSection}
        id="paymentpack-form-advanced-options-section"
      >
        <ButtonBase
          className={classes.advancedOptionsHeader}
          onClick={() => setOpenAdvancedOptions(!openAdvancedOptions)}
        >
          <SettingsIcon className={classes.settings} />
          <Typography variant="h6">
            {t('form.paymentPack.advancedOptions.header')}
          </Typography>
          {openAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ButtonBase>
        <Collapse in={openAdvancedOptions}>
          <div className={classes.section}>
            <Typography className={classes.title}>
              {`${t('form.paymentPack.advancedOptions.tag.header')}\u00A0`}
              <Typography color="error" variant="caption">
                {disabledUniversalPassFields &&
                  `(${t('form.paymentPack.universalPass.deativatedTags')})`}
              </Typography>
            </Typography>
            <Typography className={classes.helperText} variant="caption">
              {t('form.paymentPack.advancedOptions.tag.helperText')}
            </Typography>
            <Collapse in={!disabledUniversalPassFields}>
              <div className={classes.tagSelector}>
                <div className={classes.tagSelectorLabel}>
                  <CheckIcon className={classes.tagSelectorLabelIcon} />
                  <Typography variant="subtitle1">
                    {t('form.paymentPack.advancedOptions.tag.allowed')}
                  </Typography>
                </div>
                <TagSelector
                  closeMenuOnSelect
                  inScrollBar
                  isClearable
                  allTagsWithTagGroup={
                    (!disabledUniversalPassFields && [
                      ...tagList?.filter(
                        (tag) => !values?.blacklist_tags?.includes(tag.id),
                      ),
                    ]) ||
                    []
                  }
                  isDisabled={disabledUniversalPassFields}
                  onChange={(
                    items: Array<{
                      label: string;
                      value: number;
                      tag: Tag<TagGroup>;
                    }>,
                  ) => {
                    return setFieldValue(
                      'whitelist_tags',
                      items.map((item) => item.value),
                    );
                  }}
                  onDeleteTag={(itemId: number) =>
                    setFieldValue(
                      'whitelist_tags',
                      values?.whitelist_tags?.filter(
                        (tagId) => tagId !== itemId,
                      ),
                    )
                  }
                  placeholder={t(
                    'form.paymentPack.advancedOptions.tag.doNotSelectToAllowAllMembers',
                  )}
                  selectedTags={values?.whitelist_tags}
                />
              </div>
              <div className={classes.tagSelector}>
                <div className={classes.tagSelectorLabel}>
                  <BlockIcon className={classes.tagSelectorLabelIcon} />
                  <Typography variant="subtitle1">
                    {t('form.paymentPack.advancedOptions.tag.notAllowed')}
                  </Typography>
                </div>
                <TagSelector
                  closeMenuOnSelect
                  inScrollBar
                  isClearable
                  allTagsWithTagGroup={
                    (!disabledUniversalPassFields && [
                      ...tagList?.filter(
                        (tag) => !values?.whitelist_tags?.includes(tag.id),
                      ),
                    ]) ||
                    []
                  }
                  isDisabled={disabledUniversalPassFields}
                  onChange={(
                    items: Array<{
                      label: string;
                      value: number;
                      tag: Tag<TagGroup>;
                    }>,
                  ) => {
                    return setFieldValue(
                      'blacklist_tags',
                      items.map((item) => item.value),
                    );
                  }}
                  onDeleteTag={(itemId: number) =>
                    setFieldValue(
                      'blacklist_tags',
                      values?.blacklist_tags?.filter(
                        (tagId) => tagId !== itemId,
                      ),
                    )
                  }
                  placeholder={t(
                    'form.paymentPack.advancedOptions.tag.doNotSelectToAllowAllMembers',
                  )}
                  selectedTags={values.blacklist_tags}
                />
              </div>
            </Collapse>
          </div>

          <div className={classes.section}>
            <Typography className={classes.title}>
              {t('form.paymentPack.advancedOptions.tag.tagsOnAcquisition')}
            </Typography>
            <Typography className={classes.helperText} variant="caption">
              {t(
                'form.paymentPack.advancedOptions.tag.tagsOnAcquisitionHelper',
              )}
            </Typography>
            <div className={classes.tagSelector}>
              <TagSelector
                closeMenuOnSelect
                inScrollBar
                isClearable
                allTagsWithTagGroup={tagList || []}
                onChange={onChangeTagsOnAcquisition}
                onDeleteTag={onDeleteTagsOnAcquisition}
                placeholder={t(
                  'form.paymentPack.advancedOptions.tag.selectTags',
                )}
                selectedTags={values.tags_on_consumer_item_creation}
                variant={'exclusive'}
              />
              {hasTagsSameGroup && <TagGroupDuplicatedAlert />}
            </div>
          </div>

          <div className={classes.section}>
            <Typography className={classes.title}>
              {t('form.paymentPack.advancedOptions.appliesForPayroll.header')}
            </Typography>
            <SwitchField
              label={t(
                'form.paymentPack.advancedOptions.appliesForPayroll.label',
              )}
              name="applies_for_payroll"
            />
            <Typography className={classes.helperText} variant="caption">
              {t(
                'form.paymentPack.advancedOptions.appliesForPayroll.helperText',
              )}
            </Typography>
          </div>
        </Collapse>
      </div>
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  title: {
    fontWeight: 500,
    color: '#000',
  },
  settings: {
    color: '#868686',
  },
  tagSelectorLabel: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
  },
  tagSelectorLabelIcon: {
    marginRight: theme.spacing(1),
  },
  tagSelector: {
    paddingBottom: theme.spacing(2),
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  advancedOptionsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
  },
  advancedOptionsSection: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
export default PaymentPackFormAdvancedOptions;
