// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import OfferForm from './OfferForm.component';
import MetaActivitySelector from '../meta-activity/components/MetaActivitySelectorWithCard.component';
import { RoomBlueprint } from '../spot-scheduling/types';
import type { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { Coach } from '#libs/associated-coach/types';
import { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import type { Tag, TagGroup } from '#libs/tag/types';

const STEP_META_ACTIVITY_CHOSER = 0;
const STEP_OFFER_FORM = 1;

type Props = {
  metaActivities: Array<MetaActivity>;
  establishments: Array<Establishment>;
  roomBlueprints: Array<RoomBlueprint>;
  coaches: Array<Coach>;
  onCancel: () => void;
  processing: boolean;
  activitiesLoading: boolean;
  onSubmit: (data: any) => void;
  selectedDate: Object;
  is_whereby_integration_enabled: boolean;
  timezone: string;
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  showPartnership: boolean;
  tagList: Array<Tag<TagGroup>>;
};

export const OfferFormWithActivity: React.FC<Props> = ({
  metaActivities,
  establishments,
  roomBlueprints,
  coaches,
  onCancel,
  processing,
  activitiesLoading,
  onSubmit,
  selectedDate,
  is_whereby_integration_enabled,
  timezone,
  coachPaymentRulesByKind,
  showPartnership,
  tagList,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['metaActivity', 'translation']);
  const [step, setStep] = React.useState<0 | 1>(STEP_META_ACTIVITY_CHOSER);
  const [selectedMetaActivity, setSelectedMetaActivty] = React.useState(null);
  const handleSelectActivity = (activity: MetaActivity) =>
    setSelectedMetaActivty(activity);

  React.useEffect(() => {
    if (selectedMetaActivity) {
      setStep(STEP_OFFER_FORM);
    }
    setStep(STEP_META_ACTIVITY_CHOSER);
  }, [setStep, selectedMetaActivity]);

  const handleSubmit = (data) => onSubmit(selectedMetaActivity.id, data);
  if (step === STEP_META_ACTIVITY_CHOSER || selectedMetaActivity === null) {
    return (
      <div>
        {activitiesLoading ? (
          <LinearProgress />
        ) : (
          <MetaActivitySelector
            metaActivities={metaActivities}
            placeholder={t('metaActivity:search')}
            value={selectedMetaActivity}
            onChange={handleSelectActivity}
          />
        )}
        <div className={classes.buttonContainer}>
          <Button onClick={onCancel} className={classes.button}>
            {t('translation:common.cancel')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setStep(STEP_OFFER_FORM)}
            className={classes.button}
          >
            {t('translation:common.confirm')}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <OfferForm
      selectedDate={selectedDate}
      coaches={coaches}
      timezone={timezone}
      establishments={establishments}
      roomBlueprints={roomBlueprints}
      metaActivity={selectedMetaActivity}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      processing={processing}
      is_whereby_integration_enabled={is_whereby_integration_enabled}
      coachPaymentRulesByKind={coachPaymentRulesByKind}
      editableCoachPaymentRule
      showPartnership={showPartnership}
      tagList={tagList}
    />
  );
};
const useStyles = makeStyles((theme: Theme) => ({
  title: {
    paddingBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default OfferFormWithActivity;
