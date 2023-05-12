// @ts-nocheck
import React from 'react';
import classNames from 'classnames';

import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import green from '@material-ui/core/colors/green';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import { SvgIconComponent } from '@material-ui/icons';

import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import { CadenceMarketingActionsEnum } from '#libs/sequential_marketingDEPRECATED/constants';

type Props = {
  item: CadenceMarketingActionsEnum;
  selected: boolean;
  configured: boolean;
  disabled: boolean;
  onClick: () => void;
  svgIcon: SvgIconComponent;
  label: string;
};

export const MarketingActionCard: React.FC<Props> = ({
  item,
  selected,
  configured,
  disabled,
  onClick,
  svgIcon,
  label,
}) => {
  const classes = useStyles();
  return (
    <div
      key={`reset_marketing_action_button${item}`}
      className={classes.cardContainer}
    >
      {configured && !selected && (
        <div
          className={classNames(
            classes.topRightIconButton,
            classes.configuredIconContainer,
          )}
        >
          <DoneAllIcon fontSize="small" className={classes.configuredIcon} />
        </div>
      )}
      <ButtonBase
        disabled={disabled}
        onClick={onClick}
        key={`marketing_action_card${item}`}
      >
        <Card
          className={classNames(classes.cardOutter, {
            [classes.borderOutlined]: configured,
            [classes.strongElevation]: selected,
          })}
          key={`marketing_action_card${item}`}
        >
          <div className={classes.cardInner}>
            <div
              className={classNames({
                [classes.shakeAnimation]: selected,
              })}
            >
              <CustomMuiIcon
                MuiIcon={svgIcon}
                variant={disabled ? 'disabled' : 'primary'}
                MuiIconProps={{ fontSize: 'large' }}
              />
            </div>
            <Typography className={classes.stepLabel} variant="subtitle2">
              {label ?? ''}
            </Typography>
          </div>
        </Card>
      </ButtonBase>
    </div>
  );
};
export default MarketingActionCard;

const useStyles = makeStyles((theme: Theme) => ({
  cardContainer: {
    position: 'relative',
  },
  cardOutter: {
    width: '100px',
    height: '100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: theme.spacing(1),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    border: `1px solid #E0E0E0`,
    '&:hover': {
      boxShadow:
        'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 1px 2px',
    },
  },
  borderOutlined: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  strongElevation: {
    boxShadow:
      'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 8px 16px',
  },
  topRightIconButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translate(50%, -50%)',
    zIndex: 1000,
  },
  cardInner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
  },
  stepLabel: {
    fontWeight: 500,
  },
  shakeAnimation: {
    animation: '$shake 0.75s infinite',
  },
  configuredIconContainer: {
    backgroundColor: green[600],
    borderRadius: '100%',
    height: '20px',
    width: '20px',
  },
  configuredIcon: {
    padding: theme.spacing(0.3),
    color: 'white',
  },
  '@keyframes shake': {
    '0%': { transform: 'rotate(0)' },
    '15% ': { transform: 'rotate(4deg)' },
    '30%': { transform: 'rotate(-4deg)' },
    '45%': { transform: 'rotate(3deg)' },
    '60%': { transform: 'rotate(-3deg)' },
    '75%': { transform: 'rotate(2deg)' },
    '85%': { transform: 'rotate(-2deg)' },
    '92%': { transform: 'rotate(1deg)' },
    '100%': { transform: 'rotate(0)' },
  },
}));
