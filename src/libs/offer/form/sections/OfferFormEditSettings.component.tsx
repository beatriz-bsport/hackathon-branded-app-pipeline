import React from 'react';

import Tune from '@material-ui/icons/Tune';
import { useTranslation } from 'react-i18next';

import FormSection from '#components/forms/FormSection';
import { useOfferFormStyles } from '#libs/offer/hooks';
import { SwitchField } from '#libs/custom-form/components/GenericFormik.input';

type Props = {
  similarOffersLength: number;
};

const OfferFormEditSettings = (props: Props) => {
  const { similarOffersLength } = props;
  const classes = useOfferFormStyles();
  const { t } = useTranslation('offer');

  return (
    <FormSection
      id="offer-form-settings-section"
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIcon={Tune}
      sectionIconContainerStyle={classes.sectionIconContainer}
      sectionTitle={t('form.section.settings.title')}
    >
      <div className={classes.settingsFields}>
        <SwitchField
          id="offer-form-edit-notification-on-edit"
          label={t('form.section.settings.field.isNotifyConsumers')}
          name="isNotifyConsumers"
          switchColor="secondary"
        />

        {similarOffersLength > 1 && (
          <SwitchField
            id="offer-form-edit-similar-offer-edit"
            label={t('form.section.settings.field.isModifyRecursively')}
            name="isModifyRecursively"
            switchColor="secondary"
          />
        )}
      </div>
    </FormSection>
  );
};

export default OfferFormEditSettings;
