import React from 'react';

import { useTranslation } from 'react-i18next';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Collapse from '@material-ui/core/Collapse';
import PartnershipConfigurationMultipleEstablishmentForm from './PartnershipConfigurationMultipleEstablishmentForm.component';
import PartnershipConfigurationOverrideForm from './PartnershipConfigurationOverrideForm.component';
import PartnershipConfigurationAdvancedForm from './PartnershipConfigurationAdvancedForm.component';

import {
  SIMPLE_MULTIPLE_MODE,
  OVERRIDE_MODE,
  MULTIPLE_MERGE_MODE,
  // @ts-expect-error
} from '../utils';
import {
  Establishment,
  AssociatedEstablishment,
} from '../../establishment/types';
import { PartnershipEstablishmentMerge, PartnershipCompany } from '../types';

type Props = {
  establishmentList: Array<Establishment>;
  associatedEstablishmentList: Array<AssociatedEstablishment>;
  partnershipEstablishmentMergeList: Array<PartnershipEstablishmentMerge>;
  initial: PartnershipCompany;
  isSubmitting: boolean;
  onSubmit: (data: any) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  helper: {
    marginBottom: theme.spacing(1),
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  description: {
    marginBottom: theme.spacing(2),
  },
  radioGroup: {
    marginBottom: theme.spacing(2),
  },
  form: {
    marginBottom: theme.spacing(5),
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(4),
  },
}));

export const PartnershipConfigurationForm = (props: Props) => {
  const [configurationType, setConfigurationType] = React.useState<number>(
    (props.initial?.override_establishment_pk && OVERRIDE_MODE) ||
      (props.partnershipEstablishmentMergeList?.length &&
        MULTIPLE_MERGE_MODE) ||
      SIMPLE_MULTIPLE_MODE,
  );

  const { t } = useTranslation(['partnership']);
  const classes = useStyles();

  return (
    <div>
      <Typography className={classes.description} variant="body1">
        {t('parameters.configurationDescription')}
      </Typography>
      <RadioGroup
        className={classes.radioGroup}
        onChange={(ev) => setConfigurationType(parseInt(ev.target.value, 10))}
        value={configurationType}
      >
        <FormControlLabel
          control={
            <Radio checked={SIMPLE_MULTIPLE_MODE === configurationType} />
          }
          label={t(`configurationType.${SIMPLE_MULTIPLE_MODE}.label`)}
          value={SIMPLE_MULTIPLE_MODE}
        />
        <Typography
          className={classes.helper}
          color="textSecondary"
          variant="caption"
        >
          {t(`configurationType.${SIMPLE_MULTIPLE_MODE}.helperText`)}
        </Typography>
        <Collapse in={configurationType === SIMPLE_MULTIPLE_MODE}>
          <div className={classes.form}>
            <PartnershipConfigurationMultipleEstablishmentForm
              // @ts-expect-error
              associatedEstablishmentList={props.associatedEstablishmentList}
              establishmentList={props.establishmentList}
              initial={props.initial}
              iSubmitting={props.isSubmitting}
              onSubmit={props.onSubmit}
              partnershipEstablishmentMergeList={
                props.partnershipEstablishmentMergeList
              }
            />
          </div>
        </Collapse>
        <FormControlLabel
          control={<Radio checked={OVERRIDE_MODE === configurationType} />}
          label={t(`configurationType.${OVERRIDE_MODE}.label`)}
          value={OVERRIDE_MODE}
        />
        <Typography
          className={classes.helper}
          color="textSecondary"
          variant="caption"
        >
          {t(`configurationType.${OVERRIDE_MODE}.helperText`)}
        </Typography>
        <Collapse in={configurationType === OVERRIDE_MODE}>
          <div className={classes.form}>
            <PartnershipConfigurationOverrideForm
              // @ts-expect-error
              associatedEstablishmentList={props.associatedEstablishmentList}
              establishmentList={props.establishmentList}
              initial={props.initial}
              iSubmitting={props.isSubmitting}
              onSubmit={props.onSubmit}
            />
          </div>
        </Collapse>
        <FormControlLabel
          control={
            <Radio checked={MULTIPLE_MERGE_MODE === configurationType} />
          }
          label={t(`configurationType.${MULTIPLE_MERGE_MODE}.label`)}
          value={MULTIPLE_MERGE_MODE}
        />
        <Typography
          className={classes.helper}
          color="textSecondary"
          variant="caption"
        >
          {t(`configurationType.${MULTIPLE_MERGE_MODE}.helperText`)}
        </Typography>
      </RadioGroup>
      <Collapse in={configurationType === MULTIPLE_MERGE_MODE}>
        <div className={classes.form}>
          <PartnershipConfigurationAdvancedForm
            // @ts-expect-error
            associatedEstablishmentList={props.associatedEstablishmentList}
            establishmentList={props.establishmentList}
            initial={props.initial}
            iSubmitting={props.isSubmitting}
            onSubmit={props.onSubmit}
            partnershipEstablishmentMergeList={
              props.partnershipEstablishmentMergeList
            }
          />
        </div>
      </Collapse>
    </div>
  );
};

export default PartnershipConfigurationForm;
