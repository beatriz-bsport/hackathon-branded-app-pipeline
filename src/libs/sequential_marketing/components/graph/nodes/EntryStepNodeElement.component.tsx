import React from 'react';

import classNames from 'classnames';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import green from '@material-ui/core/colors/green';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';

import ToolTip from '#components/Tooltip.component';
import { TriggerChip } from '../../CadenceConnectedTriggersCard.component';

import { TriggerEnum } from '#libs/sequential_marketing/constants';
import { ELEMENT_WIDTH } from '../hooks/utils';

import type {
  CadenceStep,
  StepConnectedTriggerConfig,
  Cadence,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';

export type EntryStepNodeElementProps = {
  step: CadenceStep<number, number, StepConnectedTriggerConfig<SmartList>>;
  onCardClick?: (step: CadenceStep) => void;
  cadence: Cadence<
    number,
    StepConnectedTriggerConfig<SmartList>,
    StepConnectedTriggerConfig<SmartList>,
    number
  >;
  handleSelectStepForSubscription: () => void;
};

export const EntryStepNodeElement: React.FC<EntryStepNodeElementProps> = ({
  step,
  onCardClick,
  cadence,
  handleSelectStepForSubscription,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const [triggers, setConnectedTriggers] = React.useState<
    StepConnectedTriggerConfig<SmartList>[]
  >([]);

  React.useEffect(() => {
    if (step?.is_entry_step) {
      setConnectedTriggers(cadence.entries);
    } else {
      setConnectedTriggers(
        step?.exits?.filter(
          (ct) =>
            ![TriggerEnum.TIMEOUT_TRIGGER_IDENTIFIER].includes(
              ct.trigger_config.identifier,
            ),
        ),
      );
    }
  }, [step, cadence]);

  return (
    <>
      <ButtonBase onClick={() => onCardClick && onCardClick(step)}>
        <div className={classes.card} id={`card_element${step?.id}`}>
          <div className={classes.cardHeader}>
            <div className={classes.flexIconAndText}>
              <div className={classes.losange}>
                <PlayArrowIcon
                  className={classNames(
                    classes.greenICon,
                    classes.centerAbsolute,
                  )}
                />
              </div>
              <div>
                <Typography variant="subtitle2">
                  {t('cadence.triggers.start')}
                </Typography>
              </div>
            </div>
          </div>

          {step?.is_entry_step ? (
            <div className={classes.chipsContainer}>
              {triggers && triggers.length !== 0 && (
                <div className={classNames(classes.flewAndWrap, 'shiftable')}>
                  {triggers.map((trigger) => (
                    <TriggerChip
                      key={`trigger_chip${trigger?.uuid}`}
                      connected_trigger_config={trigger}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </ButtonBase>

      <ToolTip title={t('cadence.graph.nodeElement.addElement')}>
        <div className={classes.bottomActions}>
          <IconButton onClick={handleSelectStepForSubscription} size="small">
            <AddCircleIcon fontSize="small" />
          </IconButton>
        </div>
      </ToolTip>
    </>
  );
};

export default EntryStepNodeElement;

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    position: 'relative',
    width: `${ELEMENT_WIDTH}px`,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
    border: '1px solid',
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
    boxShadow: '0px 4px 8px 0px #00000014',
    '&:hover': {
      overflow: 'visible',
      boxShadow: '4px 16px 32px 4px #00000014',
    },
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  flewAndWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  greenICon: {
    color: green[500],
  },
  losange: {
    backgroundColor: '#F1F9F1',
    transform: 'rotate(45deg)',
    height: '40px',
    width: '40px',
    position: 'relative',
    borderRadius: theme.spacing(0.5),
  },
  flexIconAndText: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  centerAbsolute: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%) rotate(-45deg)',
  },
  chipsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bottomActions: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
