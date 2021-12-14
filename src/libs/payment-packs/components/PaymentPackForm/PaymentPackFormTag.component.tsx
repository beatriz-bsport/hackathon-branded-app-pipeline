import React, { useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ButtonBase, Typography, Collapse } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FormikProps } from 'formik';
import SettingsIcon from '@material-ui/icons/Settings';
import TagSelector from '#libs/tag/components/TagSelector.selector';
import { PaymentPackFormValues } from '../../types';
import { Tag, TagGroup } from '#libs/tag/types';
import Config from '../../../../config';

type OwnProps = {
  formikProps: FormikProps<PaymentPackFormValues>;
  tagList: Array<Tag<TagGroup>>;
};
type Props = OwnProps & WithTranslation;
export const PaymentPackFormTag = (props: Props) => {
  const { t, formikProps, tagList } = props;
  const [openAdvancedOptions, setOpenAdvancedOptions] =
    useState<boolean>(false);
  const classes = useStyles();
  return (
    <>
      {Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' && (
        <div className={classes.advancedOptionsSection}>
          <ButtonBase
            onClick={() => setOpenAdvancedOptions(!openAdvancedOptions)}
            className={classes.advancedOptionsHeader}
          >
            <SettingsIcon className={classes.settings} />
            <Typography variant="h6">
              {t('form.paymentPack.advancedOptions.header')}
            </Typography>
            {openAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ButtonBase>
          <Collapse in={openAdvancedOptions}>
            <div className={classes.tagSection}>
              <Typography className={classes.title}>
                {t('form.paymentPack.advancedOptions.tag.header')}
              </Typography>
              <Typography variant="caption" className={classes.helperText}>
                {t('form.paymentPack.advancedOptions.tag.helperText')}
              </Typography>
              <div className={classes.tagSelector}>
                <div className={classes.tagSelectorLabel}>
                  <CheckIcon className={classes.tagSelectorLabelIcon} />
                  <Typography variant="subtitle1">
                    {t('form.paymentPack.advancedOptions.tag.allowed')}
                  </Typography>
                </div>
                <TagSelector
                  allTagsWithTagGroup={
                    [
                      ...tagList?.filter(
                        (tag) =>
                          !formikProps.values?.blacklist_tags?.includes(tag.id),
                      ),
                    ] || []
                  }
                  placeholder={t(
                    'form.paymentPack.advancedOptions.tag.doNotSelectToAllowAllMembers',
                  )}
                  onChange={(
                    items: Array<{
                      item: Tag & { label: string; value: number };
                    }>,
                  ) => {
                    return formikProps.setFieldValue(
                      'whitelist_tags',
                      items.map((item) => item.value),
                    );
                  }}
                  onDeleteTag={(itemId: number) =>
                    formikProps.setFieldValue(
                      'whitelist_tags',
                      formikProps?.values?.whitelist_tags?.filter(
                        (tagId) => tagId !== itemId,
                      ),
                    )
                  }
                  selectedTags={formikProps.values?.whitelist_tags}
                  isClearable
                  closeMenuOnSelect
                  inScrollBar
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
                  allTagsWithTagGroup={
                    [
                      ...tagList?.filter(
                        (tag) =>
                          !formikProps.values?.whitelist_tags?.includes(tag.id),
                      ),
                    ] || []
                  }
                  placeholder={t(
                    'form.paymentPack.advancedOptions.tag.doNotSelectToAllowAllMembers',
                  )}
                  onChange={(
                    items: Array<{
                      item: Tag & { label: string; value: number };
                    }>,
                  ) => {
                    return formikProps.setFieldValue(
                      'blacklist_tags',
                      items.map((item) => item.value),
                    );
                  }}
                  onDeleteTag={(itemId: number) =>
                    formikProps.setFieldValue(
                      'blacklist_tags',
                      formikProps?.values?.blacklist_tags?.filter(
                        (tagId) => tagId !== itemId,
                      ),
                    )
                  }
                  selectedTags={formikProps.values.blacklist_tags}
                  isClearable
                  closeMenuOnSelect
                  inScrollBar
                />
              </div>
            </div>
          </Collapse>
        </div>
      )}
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
  tagSectionHeader: {
    paddingBottom: theme.spacing(1),
  },
  tagSection: {
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
export default compose<any, OwnProps>(withTranslation('paymentPack'))(
  PaymentPackFormTag,
);
