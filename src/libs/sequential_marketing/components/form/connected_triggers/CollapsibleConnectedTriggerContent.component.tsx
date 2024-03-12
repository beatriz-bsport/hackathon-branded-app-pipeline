import React from 'react';
import Immutable from 'seamless-immutable';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';

import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import ConnectedTriggerContent from './ConnectedTriggerContent.component';
import { triggerIconByKind } from '#libs/sequential_marketing/components/helpers/utils';
import {
  TRIGGER_FORM_DEFAULT_HEIGHT,
  TriggerKind,
} from '#libs/sequential_marketing/constants';

import type { SmartList } from '#libs/smart-list/types';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';

type Props = {
  color: string;
  isLast: boolean;
  isOpen: boolean;
  isFromMUIPopover?: boolean;
  withoutCollapseAnimation?: boolean;
  smartlists: Immutable.ImmutableArray<SmartList>;
  trigger: ConnectedTrigger;
  triggerKind: TriggerKind;
  deleteTrigger: () => void;
  openOrCloseTrigger: () => void;
  updateTrigger: (data: ConnectedTrigger) => void;
};

const CollapsibleConnectedTriggerContent: React.FC<Props> = ({
  color,
  isLast,
  isOpen,
  isFromMUIPopover,
  withoutCollapseAnimation,
  smartlists,
  trigger,
  triggerKind,
  deleteTrigger,
  openOrCloseTrigger,
  updateTrigger,
}) => {
  const { t } = useTranslation('marketing');

  const classes = useStyles();

  const handleOnClickItem = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      openOrCloseTrigger();
    },
    [openOrCloseTrigger],
  );

  const handleDeleteTrigger = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      deleteTrigger();
    },
    [deleteTrigger],
  );

  return (
    <>
      <div className={classes.content}>
        <ButtonBase
          disableRipple
          className={classes.header}
          onClick={handleOnClickItem}
        >
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          <CustomMuiIcon
            defaultBackGround
            customColor={color}
            icon={triggerIconByKind[triggerKind]}
            withBackground={false}
          />
          <Typography variant="body1">
            {t(`cadence.triggers.kinds.${triggerKind}`)}
          </Typography>
          <IconButton
            className={classes.deleteButton}
            onClick={handleDeleteTrigger}
            size="small"
          >
            <CustomMuiIcon
              defaultBackGround
              icon="Cancel"
              withBackground={false}
            />
          </IconButton>
        </ButtonBase>
        <Collapse
          in={isOpen}
          timeout={withoutCollapseAnimation ? 0 : undefined}
        >
          <div className={classes.collapseSection}>
            <ConnectedTriggerContent
              isFromMUIPopover={isFromMUIPopover}
              kind={triggerKind}
              smartlists={smartlists}
              trigger={trigger}
              updateValue={updateTrigger}
            />
          </div>
        </Collapse>
      </div>
      {!isLast && <Divider />}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
    width: '100%',
    height: TRIGGER_FORM_DEFAULT_HEIGHT,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
  },
  collapseSection: {
    paddingTop: theme.spacing(1),
  },
}));

export default React.memo(CollapsibleConnectedTriggerContent);
