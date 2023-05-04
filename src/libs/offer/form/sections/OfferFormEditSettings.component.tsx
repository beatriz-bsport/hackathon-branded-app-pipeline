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
      sectionTitle={t('form.section.settings.title')}
      sectionIcon={Tune}
      sectionCustomIconStyle={classes.sectionIcon}
      sectionIconContainerStyle={classes.sectionIconContainer}
    >
      <div className={classes.settingsFields}>
        <SwitchField
          id="offer-form-edit-notification-on-edit"
          name="isNotifyConsumers"
          label={t('form.section.settings.field.isNotifyConsumers')}
          switchColor="secondary"
        />

        {similarOffersLength > 1 && (
          <SwitchField
            id="offer-form-edit-similar-offer-edit"
            name="isModifyRecursively"
            label={t('form.section.settings.field.isModifyRecursively')}
            switchColor="secondary"
          />
        )}
      </div>
    </FormSection>
  );
};

export default OfferFormEditSettings;
