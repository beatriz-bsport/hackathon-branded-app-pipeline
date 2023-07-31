import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { SpotInformation } from '../types';

type Props = { classes: any; spotInformation: SpotInformation };

const PlaceNumber = (props: Props) => {
  const { classes, spotInformation } = props;
  const { t } = useTranslation('booking');

  return (
    <div className={classes.container}>
      <Typography variant="body2">
        {spotInformation?.name || t('booking:place')} {spotInformation.prefix}
        {spotInformation.indexType}
      </Typography>
      <svg width={20} height={20}>
        <g>
          {spotInformation?.shape === 'circular' && (
            <circle
              cx="10"
              cy="10"
              r="4"
              fill={spotInformation?.fill || 'white'}
              stroke={spotInformation?.stroke || 'black'}
              strokeWidth="2"
            />
          )}
          {spotInformation?.shape === 'rectangle' && (
            <rect
              x={6}
              y={6}
              width={13}
              height={8}
              stroke={spotInformation?.stroke || 'black'}
              fill={spotInformation?.fill || 'white'}
              strokeWidth={2}
            />
          )}
          {spotInformation?.shape === 'square' && (
            <rect
              x={6}
              y={5}
              width={9}
              height={9}
              stroke={spotInformation?.stroke || 'black'}
              fill={spotInformation?.fill || 'white'}
              strokeWidth={2}
            />
          )}
          {spotInformation?.shape === 'triangle' && (
            <polygon
              points="11,5 6,15 16,15"
              stroke={spotInformation?.stroke || 'black'}
              fill={spotInformation?.fill || 'white'}
            />
          )}
        </g>
      </svg>
    </div>
  );
};

const styles = () => {
  return { container: { display: 'flex' } };
};

export default withStyles(styles)(PlaceNumber);
