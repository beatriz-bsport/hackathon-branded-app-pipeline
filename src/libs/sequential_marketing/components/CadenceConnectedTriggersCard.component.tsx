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
import { getCadenceWinOrLoseConnectedTriggers } from '#libs/sequential_marketing/utils';
import {
  TriggerIcon,
  TriggerText,
} from '#libs/sequential_marketing/components/helpers/utils';
import {
  TriggerIdentifier,
  DestinationStatus,
} from '#libs/sequential_marketing/constants';

import type {
  Cadence,
  ConnectedTrigger,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';

type TriggerChipProps = {
  connected_trigger_config: ConnectedTrigger;
  smartlist: SmartList | undefined;
};

export const TriggerChip: React.FC<TriggerChipProps> = React.memo(
  ({ connected_trigger_config, smartlist }) => {
    const classes = useChipStyles({
      identifier: connected_trigger_config?.trigger_config?.identifier,
    });

    return (
      <ToolTip title={TriggerText({ connected_trigger_config, smartlist })}>
        <Chip
          classes={{
            root: classes.rootChip,
            icon: classes.rootChipIcon,
            iconColorPrimary: classes.rootIconColorPrimary,
            iconColorSecondary: classes.rootIconColorSecondary,
            label: classes.rootChipLabel,
          }}
          color="primary"
          icon={
            <CustomMuiIcon
              defaultBackGround
              MuiIcon={TriggerIcon({ connected_trigger_config })}
              MuiIconProps={{ color: 'primary', fontSize: 'small' }}
            />
          }
          label={TriggerText({ connected_trigger_config, smartlist })}
          size="small"
          variant="default"
        />
      </ToolTip>
    );
  },
);

export type Props = {
  cadence: Cadence;
  kind: DestinationStatus;
  onClick: () => void;
  disabled: boolean;
  smartlistById: { [id: number]: SmartList };
};

export const CadenceConnectedTriggersCard: React.FC<Props> = ({
  cadence,
  kind,
  onClick,
  disabled,
  smartlistById,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const [triggers, setConnectedTriggers] = React.useState<ConnectedTrigger[]>(
    [],
  );

  React.useEffect(() => {
    /* This particular component serves two purposes:
        - Showcase the exits associated with success 
        - Showcase the exits associated with failure. 
      Consequently, depending on the type, we need to extract the relevant triggers 
      that correspond to exits representing either success or failure */
    if (cadence && !disabled) {
      setConnectedTriggers(getCadenceWinOrLoseConnectedTriggers(cadence, kind));
    }
  }, [cadence, setConnectedTriggers, kind, disabled]);
  return (
    <ButtonBase disabled={disabled} onClick={onClick}>
      <div className={classes.card}>
        <div className={classNames({ [classes.disabledOverLay]: disabled })} />
        <div className={classes.cardHeader}>
          {kind === DestinationStatus.WIN ? (
            <CheckCircleIcon className={classes.greenICon} />
          ) : (
            <CancelIcon className={classes.redIcon} />
          )}

          {kind === DestinationStatus.FAIL ? (
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
                  key={`trigger_chip${trigger?.trigger_config?.uuid}`}
                  connected_trigger_config={trigger}
                  smartlist={
                    smartlistById?.[trigger?.filtering_config?.smartlist_pk]
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ButtonBase>
  );
};

export default React.memo(CadenceConnectedTriggersCard);

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

const useChipStyles = makeStyles<Theme, { identifier: TriggerIdentifier }>(
  (theme: Theme) => ({
    rootChip: {
      borderRadius: theme.spacing(1),
      backgroundColor: ({ identifier }) =>
        identifier === TriggerIdentifier.TIMEOUT
          ? chroma(theme.palette.text.secondary).alpha(0.09).hex()
          : chroma(theme.palette.primary.main).alpha(0.09).hex(),
      maxWidth: '90px',
      paddingLeft: theme.spacing(0.5),
    },
    rootIconColorPrimary: {
      color: ({ identifier }) =>
        identifier === TriggerIdentifier.TIMEOUT
          ? theme.palette.text.secondary
          : theme.palette.primary.main,
    },
    rootIconColorSecondary: {
      color: theme.palette.secondary.main,
    },
    rootChipLabel: {
      color: ({ identifier }) =>
        identifier === TriggerIdentifier.TIMEOUT
          ? theme.palette.text.secondary
          : theme.palette.text.primary,
    },
  }),
);
