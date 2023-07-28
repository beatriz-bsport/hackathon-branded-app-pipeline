// @ts-nocheck
import React from 'react';

import chroma from 'chroma-js';
import classNames from 'classnames';

import { useTranslation } from 'react-i18next';

import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Chip from '@material-ui/core/Chip';

import ToolTip from '#components/Tooltip.component';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import { TriggerIcon, TriggerText } from '../icons/utils';

import { TriggerEnum, CadenceDestinationEnum } from '../constants';

import type { SmartList } from '#libs/smart-list/types';
import type { Cadence, CadenceConnectedTriggerConfig } from '../types';

type TriggerChipProps = {
  connected_trigger_config: CadenceConnectedTriggerConfig<SmartList>;
};

export const TriggerChip: React.FC<TriggerChipProps> = ({
  connected_trigger_config,
}) => {
  const classes = useChipStyles({
    identifier: connected_trigger_config?.trigger_config?.identifier,
  });

  return (
    <ToolTip title={TriggerText({ connected_trigger_config })}>
      <Chip
        classes={{
          root: classes.rootChip,
          icon: classes.rootChipIcon,
          iconColorPrimary: classes.rootIconColorPrimary,
          iconColorSecondary: classes.rootIconColorSecondary,
          label: classes.rootChipLabel,
        }}
        icon={
          <CustomMuiIcon
            MuiIcon={TriggerIcon({ connected_trigger_config })}
            defaultBackGround
            MuiIconProps={{ color: 'primary', fontSize: 'small' }}
          />
        }
        label={TriggerText({ connected_trigger_config })}
        variant="default"
        color="primary"
        size="small"
      />
    </ToolTip>
  );
};

export type Props = {
  cadence: Cadence<
    number,
    CadenceConnectedTriggerConfig<SmartList>,
    CadenceConnectedTriggerConfig<SmartList>,
    number
  >;
  kind: 'win' | 'lost';
  onClick: () => void;
  disabled: boolean;
};

export const CadenceConnectedTriggersCard: React.FC<Props> = ({
  cadence,
  kind,
  onClick,
  disabled,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const [triggers, setConnectedTriggers] = React.useState<
    CadenceConnectedTriggerConfig<SmartList>[]
  >([]);

  React.useEffect(() => {
    // This component is used for two cases : Display the exits linked to success & display the exits linked to failure.
    // Therefore, based on the kind we must extract the connected triggers representing exits standinf ro a success or a failure.
    if (cadence && !disabled) {
      if (kind === 'win') {
        const exitForSuccess = cadence.exits?.filter(
          (_exit) =>
            _exit?.destination_config?.status ===
            CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_SUCCESS_STATUS,
        );
        setConnectedTriggers(exitForSuccess);
      } else {
        const exitForFail = cadence.exits?.filter(
          (_exit) =>
            _exit?.destination_config?.status ===
            CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_FAIL_STATUS,
        );

        setConnectedTriggers(exitForFail);
      }
    }
  }, [cadence, setConnectedTriggers, kind, disabled]);

  return (
    <ButtonBase onClick={onClick} disabled={disabled}>
      <div className={classes.card}>
        <div className={classNames({ [classes.disabledOverLay]: disabled })} />
        <div className={classes.cardHeader}>
          {kind === 'win' ? (
            <CheckCircleIcon className={classes.greenICon} />
          ) : (
            <CancelIcon className={classes.redIcon} />
          )}

          {kind === 'win' ? (
            <Typography variant="subtitle2">
              {t('cadence.cadenceCard.win')}
            </Typography>
          ) : (
            <Typography variant="subtitle2">
              {t('cadence.cadenceCard.lost')}
            </Typography>
          )}
        </div>
        <div>
          {triggers && triggers.length !== 0 && (
            <div className={classNames(classes.flexAndWrap, 'shiftable')}>
              {triggers.map((trigger) => (
                <TriggerChip
                  key={`trigger_chip${trigger?.uuid}`}
                  connected_trigger_config={trigger}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ButtonBase>
  );
};

export default CadenceConnectedTriggersCard;

const useStyles = makeStyles((theme: Theme) => ({
  paddingRight1: {
    paddingRight: theme.spacing(1),
  },
  paddingLeft1: {
    paddingLeft: theme.spacing(1),
  },
  card: {
    position: 'relative',
    width: '250px',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    backgroundColor: 'white',
    borderColor: '#E0E0E0',
    border: '1px solid',
    borderRadius: theme.spacing(1),
    maxHeight: `${110 - theme.spacing(4)}px`,
    overflow: 'hidden',
    '&:hover': {
      overflow: 'visible',
    },
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
  },
  flexAndWrap: {
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
  redIcon: {
    color: red[500],
  },
  disabledOverLay: {
    backgroundColor: 'rgba(255, 255, 255, .5)',
    backdropFilter: 'blur(0.5px)',
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    '-ms-transform': 'translate(-50%,-50%)',
  },
}));

const useChipStyles = makeStyles<Theme, { identifier: TriggerEnum }>(
  (theme: Theme) => ({
    rootChip: {
      borderRadius: theme.spacing(1),
      backgroundColor: ({ identifier }) =>
        identifier === TriggerEnum.TIMEOUT_TRIGGER_IDENTIFIER
          ? chroma(theme.palette.text.secondary).alpha(0.09).hex()
          : chroma(theme.palette.primary.main).alpha(0.09).hex(),
      maxWidth: '160px',
      paddingLeft: theme.spacing(0.5),
    },
    rootIconColorPrimary: {
      color: ({ identifier }) =>
        identifier === TriggerEnum.TIMEOUT_TRIGGER_IDENTIFIER
          ? theme.palette.text.secondary
          : theme.palette.primary.main,
    },
    rootIconColorSecondary: {
      color: theme.palette.secondary.main,
    },
    rootChipLabel: {
      color: ({ identifier }) =>
        identifier === TriggerEnum.TIMEOUT_TRIGGER_IDENTIFIER
          ? theme.palette.text.secondary
          : theme.palette.text.primary,
    },
  }),
);
