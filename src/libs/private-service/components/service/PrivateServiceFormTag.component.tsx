import React from 'react';
import { compose } from 'recompose';
import { useTranslation, WithTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Typography, Collapse } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import TagSelector from '#libs/tag/components/TagSelector.selector';
import { Tag, TagGroup } from '#libs/tag/types';

type OwnProps = {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: any;
  tagList: Array<Tag<TagGroup>>;
  open: boolean;
};
type Props = OwnProps & WithTranslation;
export const PrivateServiceFormTag = (props: Props) => {
  const { values, setFieldValue, tagList } = props;
  const classes = useStyles();
  const { t } = useTranslation('privateService');
  return (
    <div className={classes.advancedOptionsSection}>
      <Typography variant="caption" className={classes.helperText}>
        {t('service.form.unpaidBooking.helperText')}
      </Typography>
      <Collapse in={props.open}>
        <div className={classes.tagSection}>
          <Typography className={classes.title}>
            {t('service.form.unpaidBooking.tag.header')}
          </Typography>
          <Typography>{t('service.form.unpaidBooking.tag.helper')}</Typography>
          <div className={classes.tagSelector}>
            <div className={classes.tagSelectorLabel}>
              <CheckIcon className={classes.tagSelectorLabelIcon} />
              <Typography variant="subtitle1">
                {t('service.form.unpaidBooking.tag.allowed')}
              </Typography>
            </div>
            <TagSelector
              allTagsWithTagGroup={
                [
                  ...tagList?.filter(
                    (tag) => !values?.unpaid_blacklist_tags?.includes(tag.id),
                  ),
                ] || []
              }
              placeholder={t(
                'service.form.unpaidBooking.tag.doNotSelectToAllowAllMembers',
              )}
              onChange={(
                items: Array<{
                  item: Tag & { label: string; value: number };
                }>,
              ) => {
                return setFieldValue(
                  'unpaid_whitelist_tags',
                  items.map((item) => item.value),
                );
              }}
              onDeleteTag={(itemId: number) =>
                setFieldValue(
                  'unpaid_whitelist_tags',
                  values?.unpaid_whitelist_tags?.filter(
                    (tagId: number) => tagId !== itemId,
                  ),
                )
              }
              selectedTags={values?.unpaid_whitelist_tags}
              isClearable
              closeMenuOnSelect
              inScrollBar
            />
          </div>
          <div className={classes.tagSelector}>
            <div className={classes.tagSelectorLabel}>
              <BlockIcon className={classes.tagSelectorLabelIcon} />
              <Typography variant="subtitle1">
                {t('service.form.unpaidBooking.tag.notAllowed')}
              </Typography>
            </div>
            <TagSelector
              allTagsWithTagGroup={
                [
                  ...tagList?.filter(
                    (tag) => !values?.unpaid_whitelist_tags?.includes(tag.id),
                  ),
                ] || []
              }
              placeholder={t(
                'service.form.unpaidBooking.tag.doNotSelectToAllowAllMembers',
              )}
              onChange={(
                items: Array<{
                  item: Tag & { label: string; value: number };
                }>,
              ) => {
                return setFieldValue(
                  'unpaid_blacklist_tags',
                  items.map((item) => item.value),
                );
              }}
              onDeleteTag={(itemId: number) =>
                setFieldValue(
                  'unpaid_blacklist_tags',
                  values?.unpaid_blacklist_tags?.filter(
                    (tagId: number) => tagId !== itemId,
                  ),
                )
              }
              selectedTags={values.unpaid_blacklist_tags}
              isClearable
              closeMenuOnSelect
              inScrollBar
            />
          </div>
        </div>
      </Collapse>
    </div>
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
  tagSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  advancedOptionsSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  helperText: {
    color: theme.palette.grey[500],
  },
}));
export default compose<any, OwnProps>()(PrivateServiceFormTag);
