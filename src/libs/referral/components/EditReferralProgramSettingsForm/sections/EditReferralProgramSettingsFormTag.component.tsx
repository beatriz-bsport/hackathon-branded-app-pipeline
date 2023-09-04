import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Typography } from '@material-ui/core';
import { useFormikContext } from 'formik';
// @ts-expect-error
import { TagSelectorFieldNoMulti } from '#components/forms';
import type { Tag } from '#libs/tag/types';
import FormSection from '#components/forms/FormSection';
import { FormikValues as EditReferralProgramFormikValues } from '../EditReferralProgramSettingsForm.component';

type Props = {
  tagList: Tag[];
};

const EditReferralProgramSettingsFormTag: React.FC<Props> = ({ tagList }) => {
  const { t } = useTranslation('referral');
  const classes = useStyles();
  const { values } = useFormikContext<EditReferralProgramFormikValues>();
  return (
    <FormSection noDivider noPadding sectionTitle={t('form.tag.title')}>
      <Typography color="textSecondary" variant="caption">
        {t('form.tag.description')}
      </Typography>
      <div className={classes.tagSelector}>
        <TagSelectorFieldNoMulti
          inScrollBar
          allTagsWithTagGroup={tagList}
          id="tag-referred-member"
          name="tag_referred_member"
          selectedTags={values?.tag_referred_member}
        />
      </div>
    </FormSection>
  );
};

const useStyles = makeStyles((theme) => ({
  tagSelector: {
    marginTop: theme.spacing(1),
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}));

export default React.memo(EditReferralProgramSettingsFormTag);
